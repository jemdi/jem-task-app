import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { pool } from './db.js'
import authRouter from './routes/auth.js'
import tasksRouter from './routes/tasks.js'
import { requireAuth } from './middleware/auth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: '*' }))
app.use(express.json())

app.get('/', (req, res) => res.json({ status: 'ok', message: 'Jem Task App API is running.' }))
app.use('/api/auth', authRouter)
app.use('/api/tasks', requireAuth, tasksRouter)

async function start() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      scheduled_at TIMESTAMPTZ,
      notes TEXT
    )
  `)
  await pool.query(`
    CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON tasks (created_at ASC)
  `)
  console.log('Database ready.')
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

start()
