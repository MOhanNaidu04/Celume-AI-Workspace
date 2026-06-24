import pool from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resetDatabase() {
  try {
    console.log('\n⚠️  Resetting database...\n');
    
    // Drop all tables in correct order (respecting foreign keys)
    const dropTablesQuery = `
      DROP TABLE IF EXISTS migrations CASCADE;
      DROP TABLE IF EXISTS user_favorites CASCADE;
      DROP TABLE IF EXISTS messages CASCADE;
      DROP TABLE IF EXISTS chats CASCADE;
      DROP TABLE IF EXISTS prompt_templates CASCADE;
      DROP TABLE IF EXISTS tasks CASCADE;
      DROP TABLE IF EXISTS projects CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `;
    
    await pool.query(dropTablesQuery);
    console.log('✓ Dropped all tables');
    
    // Run migrations again
    const runMigrationsPath = path.join(__dirname, 'runMigrations.js');
    
    console.log('\n🔄 Running migrations...\n');
    
    // Import and run the migrations
    const { spawn } = await import('child_process');
    const migration = spawn('node', [runMigrationsPath]);
    
    migration.stdout.on('data', (data) => {
      process.stdout.write(data);
    });
    
    migration.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
    
    migration.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Database reset successfully\n');
      } else {
        console.log('\n❌ Migration failed\n');
        process.exit(1);
      }
    });
    
  } catch (error) {
    console.error('\n❌ Error resetting database:', error);
    process.exit(1);
  }
}

// Run reset
resetDatabase();
