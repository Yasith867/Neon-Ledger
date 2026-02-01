import { useState, useEffect, useCallback } from 'react';
import { Pool } from '@neondatabase/serverless';
import { useToast } from './use-toast';

export interface EventLog {
  id: number;
  user_address: string;
  action: string;
  created_at: string;
  block_timestamp: string | null;
}

export function useEvents() {
  const [events, setEvents] = useState<EventLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const { toast } = useToast();

  const connectionString = import.meta.env.VITE_DATABASE_URL;

  const fetchEvents = useCallback(async () => {
    if (!connectionString) {
      setDbError("Missing VITE_DATABASE_URL environment variable");
      setIsLoading(false);
      return;
    }

    try {
      const pool = new Pool({ connectionString });
      // Recent 50 events
      const result = await pool.query(`
        SELECT * FROM events 
        ORDER BY COALESCE(block_timestamp, created_at) DESC 
        LIMIT 50
      `);
      setEvents(result.rows);
      await pool.end();
      setDbError(null);
    } catch (err: any) {
      console.error("Database fetch error:", err);
      if (events.length === 0) { 
         setDbError("Failed to connect to Neon database");
      }
    } finally {
      setIsLoading(false);
    }
  }, [connectionString, events.length]);

  const insertEvent = async (userAddress: string, action: string, blockTimestamp?: Date) => {
    if (!connectionString) return;

    try {
      const pool = new Pool({ connectionString });
      if (blockTimestamp) {
        await pool.query(
          'INSERT INTO events (user_address, action, created_at, block_timestamp) VALUES ($1, $2, NOW(), $3)',
          [userAddress, action, blockTimestamp.toISOString()]
        );
      } else {
        await pool.query(
          'INSERT INTO events (user_address, action, created_at) VALUES ($1, $2, NOW())',
          [userAddress, action]
        );
      }
      await pool.end();
      fetchEvents(); 
    } catch (err) {
      console.error("Failed to insert event:", err);
      toast({
        title: "Database Error",
        description: "Failed to save event to database",
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
    insertEvent,
    isConnected: !dbError && !!connectionString
  };
}
