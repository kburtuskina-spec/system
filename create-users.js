require('dotenv').config();

const bcrypt = require('bcryptjs');
const db = require('./src/db');

async function run() {

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('123456', 10);

    await db.query(`
        UPDATE users
        SET login='admin',
            password=$1,
            role='администратор'
        WHERE id=1
    `,[adminPassword]);

    await db.query(`
        UPDATE users
        SET login='petrov',
            password=$1,
            role='сотрудник'
        WHERE id=2
    `,[userPassword]);

    await db.query(`
        UPDATE users
        SET login='sidorov',
            password=$1,
            role='сотрудник'
        WHERE id=3
    `,[userPassword]);

    console.log("Пользователи созданы.");

    process.exit();

}

run();