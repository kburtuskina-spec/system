const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

require('dotenv').config();
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('Set DATABASE_URL in .env');
  process.exit(1);
}

const pool = new Pool({ connectionString });

const bcrypt = require('bcryptjs');

async function runFile(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  await pool.query(sql);
}

async function main() {
  try {
    const migrationsDir = path.resolve(__dirname, '..', 'migrations');
    // Run schema first if present, then seed
    const schemaFile = path.join(migrationsDir, 'schema.sql');
    const seedFile = path.join(migrationsDir, 'seed.sql');
    if (fs.existsSync(schemaFile)) await runFile(schemaFile);
    if (fs.existsSync(path.join(migrationsDir, 'init.sql')) && !fs.existsSync(schemaFile)) {
      // legacy init — run only if schema not provided
      await runFile(path.join(migrationsDir, 'init.sql'));
    }
    if (fs.existsSync(seedFile)) await runFile(seedFile);
    // Hash any plaintext passwords in users table (idempotent)
    try {
      const users = await pool.query('SELECT id, password FROM users');
      for (const u of users.rows) {
        const p = u.password || '';
        if (!p.startsWith('$2')) {
          const h = await bcrypt.hash(p, 10);
          await pool.query('UPDATE users SET password=$1 WHERE id=$2', [h, u.id]);
        }
      }
    } catch (e) {
      // ignore if users table not present yet
    }
    console.log('Migrations and seed applied successfully');
  } catch (err) {
    console.error('Error applying migrations:', err);
  } finally {
    await pool.end();
  }
}

main();
