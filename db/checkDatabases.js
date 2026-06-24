import pkg from 'pg';
const { Pool } = pkg;

async function listDatabases() {
  // Connect to the default postgres database to query all databases
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // Connect to postgres system database
  });

  try {
    console.log('\n📊 Databases in PostgreSQL:\n');
    
    const result = await pool.query(
      `SELECT datname as "Database", 
              pg_size_pretty(pg_database_size(datname)) as "Size"
       FROM pg_database 
       WHERE datistemplate = false
       ORDER BY datname;`
    );

    if (result.rows.length === 0) {
      console.log('No databases found.');
    } else {
      // Print in table format
      console.table(result.rows);
    }

    // Now check our specific database
    console.log('\n📦 Checking celume_ai_workspace database...\n');
    
    const checkDb = new Pool({
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: 'celume_ai_workspace',
    });

    try {
      // Get tables in our database
      const tablesResult = await checkDb.query(
        `SELECT table_name 
         FROM information_schema.tables 
         WHERE table_schema = 'public'
         ORDER BY table_name;`
      );

      console.log(`✓ Connected to celume_ai_workspace database`);
      console.log(`\n📋 Tables in celume_ai_workspace:\n`);
      
      if (tablesResult.rows.length === 0) {
        console.log('No tables found.');
      } else {
        tablesResult.rows.forEach((row, index) => {
          console.log(`  ${index + 1}. ${row.table_name}`);
        });
      }

      // Get migration records
      const migrationsResult = await checkDb.query(
        `SELECT name, executed_at FROM migrations ORDER BY executed_at;`
      );

      console.log(`\n📝 Executed Migrations:\n`);
      if (migrationsResult.rows.length === 0) {
        console.log('No migrations found.');
      } else {
        console.table(migrationsResult.rows);
      }

      await checkDb.end();
    } catch (error) {
      console.error('✗ Error checking celume_ai_workspace database:', error.message);
    }

    await pool.end();
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error.message);
    process.exit(1);
  }
}

listDatabases();
