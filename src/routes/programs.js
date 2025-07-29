const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { initializeDatabase } = require('../config/db');

let db;
initializeDatabase().then(conn => { db = conn; });

// Input validation helpers
function isValidProgramName(name) {
  return typeof name === 'string' && name.trim().length > 0 && name.length <= 255;
}
function isBoolean(val) {
  return typeof val === 'boolean';
}
function isPositiveInt(val) {
  return Number.isInteger(val) && val > 0;
}

// POST /api/programs
router.post('/', async (req, res) => {
  const { program_name, is_active } = req.body;
  if (!isValidProgramName(program_name) || !isBoolean(is_active)) {
    return res.status(400).json({ status: 'error', message: 'Invalid input: program_name must be a non-empty string (max 255 chars), is_active must be boolean.' });
  }
  try {
    const [result] = await db.execute(
      'INSERT INTO programs (program_name, is_active) VALUES (?, ?)',
      [program_name, is_active]
    );
    const id = result.insertId;
    return res.json({
      status: 'success',
      data: { id, program_name, is_active }
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Database error: ' + err.message });
  }
});

// GET /api/programs/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!isPositiveInt(id)) {
    return res.status(400).json({ status: 'error', message: 'Invalid id: must be a positive integer.' });
  }
  try {
    const [rows] = await db.execute('SELECT * FROM programs WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Program not found' });
    }
    const { program_name, is_active } = rows[0];
    return res.json({
      status: 'success',
      data: { id, program_name, is_active: !!is_active }
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Database error: ' + err.message });
  }
});

// PUT /api/programs/:id
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { program_name, is_active } = req.body;
  if (!isPositiveInt(id)) {
    return res.status(400).json({ status: 'error', message: 'Invalid id: must be a positive integer.' });
  }
  // Validate fields if present
  if (
    (program_name !== undefined && !isValidProgramName(program_name)) ||
    (is_active !== undefined && !isBoolean(is_active))
  ) {
    return res.status(400).json({ status: 'error', message: 'Invalid input: program_name must be a non-empty string (max 255 chars), is_active must be boolean.' });
  }
  if (program_name === undefined && is_active === undefined) {
    return res.status(400).json({ status: 'error', message: 'At least one of program_name or is_active must be provided.' });
  }
  try {
    // Build dynamic query
    const fields = [];
    const values = [];
    if (program_name !== undefined) {
      fields.push('program_name = ?');
      values.push(program_name);
    }
    if (is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(is_active);
    }
    values.push(id);
    const [result] = await db.execute(
      `UPDATE programs SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Program not found' });
    }
    // Return the updated record
    const [rows] = await db.execute('SELECT * FROM programs WHERE id = ?', [id]);
    const updated = rows[0];
    return res.json({
      status: 'success',
      data: {
        id: updated.id,
        program_name: updated.program_name,
        is_active: !!updated.is_active
      }
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Database error: ' + err.message });
  }
});

// DELETE /api/programs/:id
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!isPositiveInt(id)) {
    return res.status(400).json({ status: 'error', message: 'Invalid id: must be a positive integer.' });
  }
  try {
    const [result] = await db.execute('DELETE FROM programs WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Program not found' });
    }
    return res.json({ status: 'success', data: { id } });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Database error: ' + err.message });
  }
});

module.exports = router; 