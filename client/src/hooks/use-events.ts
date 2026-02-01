import { useState, useEffect, useCallback, useRef } from 'react';
import { Pool } from '@neondatabase/serverless';
import { useToast } from './use-toast';

export interface EventLog {
  id: number;
  user_address: string;
  action: string;
  created_at: string;
}

// Keep connection outside to avoid recreation, but serverless pools are lightweight
const connectionString = import.meta.env.VITE_DATABASE_URL;

export function useEvents() {
  const [events, setEvents] = useState<EventLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Ref to track if we've already shown an error to avoid spamming toast
  const hasShownError = useRef(false);

  const fetchEvents = useCallback(async () => {
    if (!connectionString) {
      if (!hasShownError.current) {
        setDbError("Missing VITE_DATABASE_URL environment variable");
        hasShownError.current = true;
      }
      setIsLoading(false);
      return;
    }

    try {
      const pool = new Pool({ connectionString });
      // Recent 50 events
      const result = await pool.query(`
        SELECT * FROM events 
        ORDER BY created_at DESC 
        LIMIT 50
      `);
      setEvents(result.rows);
      await pool.end();
      setDbError(null);
    } catch (err: any) {
      console.error("Database fetch error:", err);
      // Don't show toast on every poll failure, just log
      if (events.length === 0 && !hasShownError.current) { 
         setDbError("Failed to connect to Neon database");
         hasShownError.current = true;
      }
    } finally {
      setIsLoading(false);
    }
  }, [events.length]);

  const insertEvent = async (userAddress: string, action: string) => {
    if (!connectionString) return;

    try {
      const pool = new Pool({ connectionString });
      await pool.query(
        'INSERT INTO events (user_address, action, created_at) VALUES ($1, $2, NOW())',
        [userAddress, action]
      );
      await pool.end();
      // Immediately refresh list
      fetchEvents(); 
    } catch (err) {
      console.error("Failed to insert event:", err);
      toast({
        title: "Database Error",
        description: "Failed to save event to database log",
        variant: "destructive"
      });
    }
  };

  // Polling effect
  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 2000); // Poll every 2s
    return () => clearInterval(interval);
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    dbError,
    insertEvent
  };
}
