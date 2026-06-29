const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {

    try {

        const total = await db.query(
            "SELECT COUNT(*) FROM requests"
        );

        const inWork = await db.query(
            "SELECT COUNT(*) FROM requests WHERE status='В работе'"
        );

        const completed = await db.query(
            "SELECT COUNT(*) FROM requests WHERE status='Выполнено'"
        );

        const overdue = await db.query(`
            SELECT COUNT(*)
            FROM requests
            WHERE due_date < CURRENT_DATE
            AND status <> 'Выполнено'
        `);

        const latest = await db.query(`
            SELECT
                requests.id,
                objects.name AS object_name,
                requests.status,
                requests.due_date
            FROM requests
            LEFT JOIN objects
            ON requests.object_id = objects.id
            ORDER BY requests.created_at DESC
            LIMIT 5
        `);
const notifications = await db.query(`
    SELECT
        id,
        status,
        due_date
    FROM requests
    ORDER BY created_at DESC
    LIMIT 5
`);
        res.json({

    stats: {

        total: Number(total.rows[0].count),
        inWork: Number(inWork.rows[0].count),
        completed: Number(completed.rows[0].count),
        overdue: Number(overdue.rows[0].count)

    },

    latest: latest.rows,

    notifications: notifications.rows

});

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            error: "DB error"
        });

    }

});

module.exports = router;