const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {

    try {
const { q } = req.query;
        let sql = `
SELECT
    id,
    login,
    full_name,
    role,
    department
FROM users
`;

const values = [];

if (q) {

    sql += `
    WHERE
        login ILIKE $1
        OR full_name ILIKE $1
        OR department ILIKE $1
    `;

    values.push(`%${q}%`);

}

sql += `
ORDER BY full_name
`;

const result = await db.query(sql, values);

        res.json(result.rows);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            error: "DB error"
        });

    }

});
const bcrypt = require("bcryptjs");
router.get("/:id", requireAuth, async (req, res) => {

    try {

        const result = await db.query(

            `
            SELECT
                id,
                login,
                full_name,
                role,
                department
            FROM users
            WHERE id = $1
            `,

            [req.params.id]

        );

        if (!result.rows.length) {

            return res.status(404).json({
                error: "Пользователь не найден."
            });

        }

        res.json(result.rows[0]);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            error: "DB error"
        });

    }

});
router.post("/", requireAuth, async (req, res) => {

    try {

        const {
            login,
            password,
            full_name,
            role,
            department
        } = req.body;

        if (!login || !password || !full_name) {

            return res.status(400).json({
                error: "Заполните обязательные поля."
            });

        }

        const hash = await bcrypt.hash(password, 10);

        const result = await db.query(

            `
            INSERT INTO users
            (
                login,
                password,
                full_name,
                role,
                department
            )

            VALUES
            ($1,$2,$3,$4,$5)

            RETURNING id
            `,

            [
                login,
                hash,
                full_name,
                role,
                department
            ]

        );

        res.status(201).json(result.rows[0]);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            error: "DB error"
        });

    }

});
router.put("/:id", requireAuth, async (req, res) => {

    try {

        const {
            login,
            full_name,
            role,
            department
        } = req.body;

        const result = await db.query(

            `
            UPDATE users
            SET
                login = $1,
                full_name = $2,
                role = $3,
                department = $4
            WHERE id = $5
            RETURNING *
            `,

            [
                login,
                full_name,
                role,
                department,
                req.params.id
            ]

        );

        if (!result.rows.length) {

            return res.status(404).json({
                error: "Пользователь не найден."
            });

        }

        res.json(result.rows[0]);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            error: "DB error"
        });

    }

});
router.delete("/:id", requireAuth, async (req, res) => {

    try {

        await db.query(
            "DELETE FROM users WHERE id = $1",
            [req.params.id]
        );

        res.status(204).send();

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            error: "DB error"
        });

    }

});
module.exports = router;