const { Pool } = require('pg');

console.log("DATABASE_URL =", process.env.DATABASE_URL);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.query("SELECT current_database()")
    .then(r => console.log("Current DB:", r.rows[0].current_database))
    .catch(console.error);

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};