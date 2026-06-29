const express = require('express');
const db = require('../db');

const router = express.Router();


// LIST
router.get('/', async (req, res) => {

    try {

        const { q } = req.query;

        let sql = `SELECT * FROM objects`;
        const values = [];

        if (q) {

            sql += `
                WHERE name ILIKE $1
                   OR code ILIKE $1
                   OR address ILIKE $1
                   OR customer ILIKE $1
            `;

            values.push(`%${q}%`);
        }

        sql += ` ORDER BY id`;

        const result = await db.query(sql, values);

        res.json(result.rows);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }
});


// GET ONE (ВАЖНО ДЛЯ РЕДАКТИРОВАНИЯ)
router.get('/:id', async (req, res) => {

    try {

        const result = await db.query(
            'SELECT * FROM objects WHERE id=$1',
            [req.params.id]
        );

        if (!result.rows.length)
            return res.status(404).json({ error: 'Not found' });

        res.json(result.rows[0]);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }
});


// CREATE
router.post('/', async (req, res) => {

    try {

        const { code, name, address, customer, status } = req.body;

        const result = await db.query(
            `INSERT INTO objects
             (code, name, address, customer, status)
             VALUES ($1,$2,$3,$4,$5)
             RETURNING *`,
            [code, name, address, customer, status]
        );

        res.status(201).json(result.rows[0]);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }
});


// UPDATE
router.put('/:id', async (req, res) => {

    try {

        const data = req.body;

        const result = await db.query(
            `
            UPDATE objects SET
                code = $1,
                name = $2,
                address = $3,
                customer = $4,
                status = $5
            WHERE id = $6
            RETURNING *
            `,
            [
                data.code,
                data.name,
                data.address,
                data.customer,
                data.status,
                req.params.id
            ]
        );

        if (!result.rows.length) {
            return res.status(404).json({ error: "not found" });
        }

        res.json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});


// DELETE
router.delete('/:id', async (req, res) => {

    try {

        await db.query(
            'DELETE FROM objects WHERE id=$1',
            [req.params.id]
        );

        res.status(204).send();

    } catch (err) {

        res.status(500).json({ error: err.message });

    }
});


module.exports = router;