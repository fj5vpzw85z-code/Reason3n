import { Pool, PoolClient } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://reason3n:password123@localhost:5432/reason3n_dev'
});

/**
 * Executes a callback within a transaction where the `app.current_workspace_id` 
 * is set, enforcing PostgreSQL Row-Level Security for that specific tenant.
 * See Section 6.1 of the architecture spec.
 */
export async function withTenantContext<T>(
  workspaceId: string, 
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Set the session variable for RLS (local to this transaction)
    await client.query(`SELECT set_config('app.current_workspace_id', $1, true)`, [workspaceId]);
    
    const result = await callback(client);
    
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
