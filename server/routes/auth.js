import { Router } from 'express'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (
    username === process.env.LOGIN_USERNAME &&
    password === process.env.LOGIN_PASSWORD
  ) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token })
  } else {
    res.status(401).json({ error: 'Invalid username or password' })
  }
})

export default router
