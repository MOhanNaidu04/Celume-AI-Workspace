import fs from 'fs';
import path from 'path';
import pool from './db.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createMigrationsTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  try {
    await pool.query(createTableQuery);
    console.log('✓ Migrations table created or already exists');
  } catch (error) {
    console.error('Error creating migrations table:', error);
    throw error;
  }
}

async function getExecutedMigrations() {
  try {
    const result = await pool.query('SELECT name FROM migrations ORDER BY name');
    return result.rows.map(row => row.name);
  } catch (error) {
    console.error('Error fetching executed migrations:', error);
    throw error;
  }
}

async function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, 'migrations');
  
  try {
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    return files;
  } catch (error) {
    console.error('Error reading migrations directory:', error);
    throw error;
  }
}

async function executeMigration(fileName) {
  const filePath = path.join(__dirname, 'migrations', fileName);
  
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Execute the migration SQL
    await pool.query(sql);
    
    // Record the migration
    await pool.query(
      'INSERT INTO migrations (name) VALUES ($1)',
      [fileName]
    );
    
    console.log(`✓ Executed migration: ${fileName}`);
    return true;
  } catch (error) {
    console.error(`✗ Error executing migration ${fileName}:`, error.message);
    throw error;
  }
}

async function runMigrations() {
  try {
    console.log('\n🔄 Starting database migrations...\n');
    
    // Create migrations table if it doesn't exist
    await createMigrationsTable();
    
    // Get list of executed migrations
    const executedMigrations = await getExecutedMigrations();
    console.log(`Found ${executedMigrations.length} previously executed migration(s)\n`);
    
    // Get list of migration files
    const migrationFiles = await getMigrationFiles();
    
    if (migrationFiles.length === 0) {
      console.log('No migration files found.');
      return;
    }
    
    // Execute pending migrations
    let pendingCount = 0;
    for (const fileName of migrationFiles) {
      if (!executedMigrations.includes(fileName)) {
        await executeMigration(fileName);
        pendingCount++;
      }
    }
    
    if (pendingCount === 0) {
      console.log('\nNo pending migrations to execute.');
    } else {
      console.log(`\n✅ Successfully executed ${pendingCount} migration(s)`);
    }
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations
runMigrations();
