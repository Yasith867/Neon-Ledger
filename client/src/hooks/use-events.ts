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

    const pool = new Pool({ connectionString });

    try {
      // First, try to add block_timestamp column (idempotent)
      await pool.query(`
        ALTER TABLE events ADD COLUMN IF NOT EXISTS block_timestamp TIMESTAMP
      `);
      
      // If ALTER succeeds, query with block_timestamp
      const result = await pool.query(`
        SELECT id, user_address, action, created_at, block_timestamp
        FROM events 
        ORDER BY COALESCE(block_timestamp, created_at) DESC 
        LIMIT 50
      `);
      setEvents(result.rows);
      setDbError(null);
    } catch (err: any) {
      // If ALTER or query fails, try simple query without block_timestamp
      console.log("Using fallback query (block_timestamp may not exist):", err.message);
      try {
        const result = await pool.query(`
          SELECT id, user_address, action, created_at, NULL as block_timestamp
          FROM events 
          ORDER BY created_at DESC 
          LIMIT 50
        `);
        setEvents(result.rows);
        setDbError(null);
      } catch (fallbackErr: any) {
        console.error("Fallback query also failed:", fallbackErr);
        if (events.length === 0) { 
          setDbError("Failed to connect to Neon database");
        }
      }
    } finally {
      try {
        await pool.end();
      } catch (e) {
        // ignore pool end errors
      }
      setIsLoading(false);
    }
  }, [connectionString, events.length]);

  const insertEvent = async (userAddress: string, action: string, blockTimestamp?: Date) => {
    if (!connectionString) return;

    const pool = new Pool({ connectionString });
    try {
      if (blockTimestamp) {
        // Try insert with block_timestamp
        try {
          await pool.query(
            'INSERT INTO events (user_address, action, created_at, block_timestamp) VALUES ($1, $2, NOW(), $3)',
            [userAddress, action, blockTimestamp.toISOString()]
          );
        } catch (err) {
          // Fallback to insert without block_timestamp
          await pool.query(
            'INSERT INTO events (user_address, action, created_at) VALUES ($1, $2, NOW())',
            [userAddress, action]
          );
        }
      } else {
        await pool.query(
          'INSERT INTO events (user_address, action, created_at) VALUES ($1, $2, NOW())',
          [userAddress, action]
        );
      }
      fetchEvents(); 
    } catch (err) {
      console.error("Failed to insert event:", err);
      toast({
        title: "Database Error",
        description: "Failed to save event to database",
        variant: "destructive"
      });
    } finally {
      try {
        await pool.end();
      } catch (e) {
        // ignore
      }
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
