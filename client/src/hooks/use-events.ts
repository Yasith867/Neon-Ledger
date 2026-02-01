import { useState, useEffect, useCallback } from 'react';
import { Pool } from '@neondatabase/serverless';

export interface EventLog {
  id: number;
  user_address: string;
  action: string;
  created_at: string;
}

export function useEvents() {
  const [events, setEvents] = useState<EventLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectionString = import.meta.env.VITE_DATABASE_URL;

  const fetchEvents = useCallback(async () => {
    if (!connectionString) {
      setDbError("Missing VITE_DATABASE_URL");
      setIsLoading(false);
      return;
    }

    try {
      const pool = new Pool({ connectionString });
      // Fetch recent 50 events
      const result = await pool.query(`
        SELECT * FROM events 
        ORDER BY created_at DESC 
        LIMIT 50
      `);
      setEvents(result.rows);
      await pool.end();
      setDbError(null);
      setIsConnected(true);
    } catch (err: any) {
      console.error("Database fetch error:", err);
      // Only set error if we haven't successfully connected before or if we have no data
      if (events.length === 0) {
        setDbError("Failed to connect to Neon database");
        setIsConnected(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [connectionString, events.length]);

  const insertEvent = async (userAddress: string, action: string) => {
    if (!connectionString) return;

    try {
      const pool = new Pool({ connectionString });
      await pool.query(
        'INSERT INTO events (user_address, action, created_at) VALUES ($1, $2, NOW())',
        [userAddress, action]
      );
      await pool.end();
      fetchEvents(); // Immediate refresh
    } catch (err) {
      console.error("Failed to insert event:", err);
      throw err;
    }
  };

  // Poll every 2 seconds
  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 2000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    dbError,
    isConnected,
    insertEvent
  };
}
