import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { createUser, verifyPassword, getUserById } from '../models/userModel'

export async function register(req: Request, res: Response) {
  try {
    const { username, password, name } = req.body
    if (!username || !password) return res.status(400).json({ error: 'Username and password are required' })
    const user = await createUser(username, password, name)
    const secret = process.env.JWT_SECRET || 'devsecret'
    const token = jwt.sign({ username: user.username }, secret, { subject: user.id, expiresIn: '7d' })
    return res.json({ user, token })
  } catch (err: any) {
    return res.status(400).json({ error: err.message || err })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ error: 'Username and password are required' })
    const user = await verifyPassword(username, password)
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const secret = process.env.JWT_SECRET || 'devsecret'
    const token = jwt.sign({ username: user.username }, secret, { subject: user.id, expiresIn: '7d' })
    return res.json({ user, token })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err })
  }
}

export async function me(req: any, res: Response) {
  try {
    const user = await getUserById(req.user.id)
    return res.json({ user })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err })
  }
}
