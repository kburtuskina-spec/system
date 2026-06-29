const express = require('express');
const db = require('../db');

const router = express.Router();
document.addEventListener("DOMContentLoaded", load);

async function load() {

    const res = await fetch('/api/reports');
    const data = await res.json();

    document.getElementById("objectsCount").innerText = data.objectsCount;
    document.getElementById("requestsCount").innerText = data.requestsCount;
    document.getElementById("activeRequests").innerText = data.activeRequests;

    const tbody = document.getElementById("lastRequests");
    tbody.innerHTML = "";

    data.lastRequests.forEach(r => {

        tbody.innerHTML += `
<tr>
<td>${r.id}</td>
<td>${r.object_name ?? '-'}</td>
<td>${r.status}</td>
</tr>
        `;
    });
}

router.get('/', async (req, res) => {

    try {

        const objectsCount = await db.query('SELECT COUNT(*) FROM objects');
        const requestsCount = await db.query('SELECT COUNT(*) FROM requests');

        const activeRequests = await db.query(
            "SELECT COUNT(*) FROM requests WHERE status='Активный'"
        );

        const lastRequests = await db.query(`
            SELECT r.*, o.name as object_name
            FROM requests r
            LEFT JOIN objects o ON o.id = r.object_id
            ORDER BY r.id DESC
            LIMIT 5
        `);

        res.json({
            objectsCount: objectsCount.rows[0].count,
            requestsCount: requestsCount.rows[0].count,
            activeRequests: activeRequests.rows[0].count,
            lastRequests: lastRequests.rows
        });

    } catch (err) {

        console.error(err);
        res.status(500).json({ error: err.message });

    }
});

module.exports = router;