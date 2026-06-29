const express = require('express');
const db = require('../db');
const { requireAuth, requireOwnerOrAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { status, q, limit = 100, offset = 0, export: exportType } = req.query;

    const where = [];
    const values = [];
    let idx = 1;

    if (status) {
      where.push(`status = $${idx}`);
      values.push(status);
      idx++;
    }

    if (q) {
      where.push(`(requester ILIKE $${idx} OR item ILIKE $${idx} OR department ILIKE $${idx})`);
      values.push(`%${q}%`);
      idx++;
    }

    const limitVal = parseInt(limit, 10) || 100;
    const offsetVal = parseInt(offset, 10) || 0;

    const sql = `
SELECT
    requests.*,
    objects.name AS object_name

FROM requests

LEFT JOIN objects
ON requests.object_id = objects.id

${where.length ? 'WHERE ' + where.join(' AND ') : ''}

ORDER BY requests.created_at DESC

LIMIT $${idx}
OFFSET $${idx + 1}
`;

    values.push(limitVal, offsetVal);

    const result = await db.query(sql, values);

    if (exportType === 'csv') {

      const rows = result.rows;

      const header = [
        'id',
        'requester',
        'department',
        'item',
        'quantity',
        'created_at',
        'due_date',
        'completed_at',
        'status',
        'description'
      ];

      const csv = [header.join(',')]
        .concat(
          rows.map(r =>
            header.map(h => {
              const v = r[h] == null ? '' : String(r[h]).replace(/"/g, '""');
              return `"${v.replace(/\n/g, ' ')}"`;
            }).join(',')
          )
        ).join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
res.setHeader(
  'Content-Disposition',
  'attachment; filename="requests.csv"'
);

return res.send('\uFEFF' + csv.replace(/,/g, ';'));
    }

    res.json(result.rows);

  } catch (err) {
    const handleDbError = require('../utils/handleDbError');
    return handleDbError(res, err);
  }
});

router.get('/:id', async (req, res) => {

  try {

    const result = await db.query(
      `
      SELECT
        requests.*,
        objects.name AS object_name

      FROM requests

      LEFT JOIN objects
      ON requests.object_id = objects.id

      WHERE requests.id = $1
      `,
      [req.params.id]
    );

    if (!result.rows.length)
      return res.status(404).json({ error: 'Not found' });

    res.json(result.rows[0]);

  } catch (err) {

    const handleDbError = require('../utils/handleDbError');
    return handleDbError(res, err);

  }

});

router.get('/:id/materials', async (req, res) => {

  try {

    const result = await db.query(
      `
      SELECT
      rm.id,
      rm.quantity,
      rm.note,
      m.id AS material_id,
      m.name AS material_name,
      m.unit

      FROM request_materials rm

      JOIN materials m
      ON rm.material_id=m.id

      WHERE rm.request_id=$1
      `,
      [req.params.id]
    );

    res.json(result.rows);

  } catch (err) {

    const handleDbError = require('../utils/handleDbError');
    return handleDbError(res, err);

  }

});

router.post('/:id/materials', async (req, res) => {

  try {

    const { material_id, quantity, note } = req.body;

    if (!material_id)
      return res.status(400).json({ error: 'material_id required' });

    const result = await db.query(
      `
      INSERT INTO request_materials
      (request_id,material_id,quantity,note)

      VALUES($1,$2,$3,$4)

      RETURNING *
      `,
      [
        req.params.id,
        material_id,
        quantity || 1,
        note || null
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {

    const handleDbError = require('../utils/handleDbError');
    return handleDbError(res, err);

  }

});

router.post('/', requireAuth, async (req, res) => {

  try {

    const {
      requester,
      department,
      item,
      quantity,
      due_date,
      completed_at,
      status,
      description
    } = req.body;

    const realRequester =
      requester ||
      req.user.full_name ||
      req.user.login;

    const result = await db.query(
      `
      INSERT INTO requests
      (
        requester,
        department,
        item,
        quantity,
        due_date,
        completed_at,
        status,
        description,
        object_id,
        created_by
      )

      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)

      RETURNING *
      `,
      [
        realRequester,
        department,
        item,
        quantity || 1,
        due_date || null,
        completed_at || null,
        status || 'Создана',
        description || null,
        req.body.object_id || null,
        req.user.id
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: 'DB error' });

  }

});

router.put('/:id',
requireAuth,
requireOwnerOrAdmin(async (req) => {

const r = await db.query(
'SELECT created_by FROM requests WHERE id=$1',
[req.params.id]
);

return r.rows[0] ? r.rows[0].created_by : null;

}),
async (req,res)=>{

try{

const {id}=req.params;

const fields=[
'requester',
'department',
'item',
'quantity',
'due_date',
'completed_at',
'status',
'description'
];

const updates=[];
const values=[];
let idx=1;

for(const f of fields){

if(f in req.body){

updates.push(`${f}=$${idx}`);

values.push(req.body[f]);

idx++;

}

}

if(!updates.length)
return res.status(400).json({error:'No fields to update'});

values.push(id);

const sql = `
UPDATE requests
SET ${updates.join(',')}
WHERE id=$${idx}
RETURNING *
`;

const result=await db.query(sql,values);

if(!result.rows.length)
return res.status(404).json({error:'Not found'});

res.json(result.rows[0]);

}catch(err){

console.error(err);

res.status(500).json({error:'DB error'});

}

});

router.delete('/:id',
requireAuth,
requireOwnerOrAdmin(async(req)=>{

const r=await db.query(
'SELECT created_by FROM requests WHERE id=$1',
[req.params.id]
);

return r.rows[0] ? r.rows[0].created_by : null;

}),
async(req,res)=>{

try{

await db.query(
'DELETE FROM requests WHERE id=$1',
[req.params.id]
);

res.status(204).send();

}catch(err){

console.error(err);

res.status(500).json({error:'DB error'});

}

});

module.exports = router;