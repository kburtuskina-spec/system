const express = require('express');
const db = require('../db');
const router = express.Router();
const handleDbError = require('../utils/handleDbError');

router.get('/', async (req, res) => {

    try {

        const { q } = req.query;

        let sql = `
            SELECT *
            FROM materials
        `;

        const values = [];

        if (q) {

            sql += `
            WHERE
                name ILIKE $1
                OR code ILIKE $1
                OR category ILIKE $1
            `;

            values.push(`%${q}%`);

        }

        sql += `
            ORDER BY name
        `;

        const result = await db.query(sql, values);

        res.json(result.rows);

    }

    catch (err) {

        return handleDbError(res, err);

    }

});
router.get("/:id", async (req, res) => {

    try {

        const result = await db.query(
            `
            SELECT *
            FROM materials
            WHERE id = $1
            `,
            [req.params.id]
        );

        if (!result.rows.length) {

            return res.status(404).json({
                error: "Материал не найден."
            });

        }

        res.json(result.rows[0]);

    }

    catch (err) {

        return handleDbError(res, err);

    }

});
router.post("/", async (req, res) => {

    try {

        const {
            code,
            name,
            unit,
            category,
            stock
        } = req.body;

        if (!name) {

            return res.status(400).json({
                error: "Укажите название материала."
            });

        }

        const result = await db.query(

            `
            INSERT INTO materials
            (
                code,
                name,
                unit,
                category,
                stock
            )

            VALUES
            ($1,$2,$3,$4,$5)

            RETURNING *
            `,

            [
                code,
                name,
                unit,
                category,
                stock || 0
            ]

        );

        res.status(201).json(result.rows[0]);

    }

    catch (err) {

        return handleDbError(res, err);

    }

});
router.put("/:id", async (req, res) => {

    try {

        const {
            code,
            name,
            unit,
            category,
            stock
        } = req.body;

        const result = await db.query(

            `
            UPDATE materials
            SET
                code = $1,
                name = $2,
                unit = $3,
                category = $4,
                stock = $5
            WHERE id = $6
            RETURNING *
            `,

            [
                code,
                name,
                unit,
                category,
                stock,
                req.params.id
            ]

        );

        if (!result.rows.length) {

            return res.status(404).json({
                error: "Материал не найден."
            });

        }

        res.json(result.rows[0]);

    }

    catch (err) {

        return handleDbError(res, err);

    }

});
router.delete("/:id", async (req, res) => {

    try {

        await db.query(
            "DELETE FROM materials WHERE id = $1",
            [req.params.id]
        );

        res.status(204).send();

    }

    catch (err) {

        return handleDbError(res, err);

    }

});
module.exports = router;
