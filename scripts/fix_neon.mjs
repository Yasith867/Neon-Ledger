import { Pool } from '@neondatabase/serverless';

const connectionString = 'postgresql://neondb_owner:npg_hkUXIp2DYt3M@ep-delicate-hill-ahd6gm0q-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function fix() {
  const pool = new Pool({ connectionString });
  
  try {
    // Add block_timestamp column if it doesn't exist
    console.log('Adding block_timestamp column...');
    await pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS block_timestamp TIMESTAMP`);
    console.log('Column added successfully');
    
    // Clear old events without proper timestamps
    console.log('Clearing old events...');
    const deleteResult = await pool.query(`DELETE FROM events WHERE block_timestamp IS NULL`);
    console.log('Deleted rows:', deleteResult.rowCount);
    
    // Verify table structure
    const result = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'events'`);
    console.log('Table structure:', result.rows);
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

fix();
