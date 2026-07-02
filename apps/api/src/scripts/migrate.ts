import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgres://reason3n:password123@localhost:5432/reason3n_dev'
  });

  try {
    console.log('Connecting to database...');
    await client.connect();

    const schemaPath = path.resolve(__dirname, '../../../../../infrastructure/migrations/001_initial_schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Applying 001_initial_schema.sql...');
    await client.query(sql);
    console.log('Schema applied successfully.');

    // Seed test data
    console.log('Seeding initial workspace and user...');
    
    // Hash 'password123' with argon2
    const passwordHash = '$argon2id$v=19$m=65536,t=3,p=1$B7hC3A+R4Hh0hO0b7HkQxg$x8l/uQ+hVjGZz0pWzR/O7Q+tO9q5aX/bW2nO3qM/oM';

    const insertWorkspace = `
      INSERT INTO workspaces (id, name, tier, region, encryption_key_ref)
      VALUES ('11111111-1111-1111-1111-111111111111', 'Acme Corp', 'enterprise', 'eu-central-1', 'kms-key-123')
      ON CONFLICT DO NOTHING;
    `;
    await client.query(insertWorkspace);

    // Using a simple users table update for Sprint 1 (needs password_hash and role columns which were omitted in the initial schema script, let's alter table first)
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'viewer';
    `);

    const insertUser = `
      INSERT INTO users (id, workspace_id, email, password_hash, role)
      VALUES ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'admin@reason3n.com', $1, 'owner')
      ON CONFLICT DO NOTHING;
    `;
    await client.query(insertUser, [passwordHash]);
    console.log('Seed completed successfully.');

  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
