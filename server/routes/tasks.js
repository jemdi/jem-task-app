import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

function mapTask(row) {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    createdAt: row.created_at,
    scheduledAt: row.scheduled_at,
    notes: row.notes
  }
}

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY created_at ASC')
    res.json(rows.map(mapTask))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { title, scheduledAt, notes } = req.body
    const { rows } = await pool.query(
      'INSERT INTO tasks (title, scheduled_at, notes) VALUES ($1, $2, $3) RETURNING *',
      [title, scheduledAt || null, notes || null]
    )
    res.status(201).json(mapTask(rows[0]))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/tasks/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, completed, scheduledAt, notes } = req.body

    const fields = []
    const values = []
    let idx = 1

    if (title !== undefined) { fields.push(`title = $${idx++}`); values.push(title) }
    if (completed !== undefined) { fields.push(`completed = $${idx++}`); values.push(completed) }
    if (scheduledAt !== undefined) { fields.push(`scheduled_at = $${idx++}`); values.push(scheduledAt || null) }
    if (notes !== undefined) { fields.push(`notes = $${idx++}`); values.push(notes || null) }

    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' })

    values.push(id)
    const { rows } = await pool.query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    )

    if (rows.length === 0) return res.status(404).json({ error: 'Task not found' })
    res.json(mapTask(rows[0]))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/tasks/completed — must be registered before /:id
router.delete('/completed', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE completed = true')
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id])
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
