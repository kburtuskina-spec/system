function handleDbError(res, err) {
  console.error(err && err.stack ? err.stack : err);
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({ error: 'DB error' });
  }
  const msg = err && err.message ? err.message : String(err);
  return res.status(500).json({ error: 'DB error', detail: msg });
}

module.exports = handleDbError;
