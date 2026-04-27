import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { createUser, verifyPassword, getUserById } from '../models/userModel'

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body
    const user = await createUser(email, password, name)
    return res.json({ user })
  } catch (err: any) {
    return res.status(400).json({ error: err.message || err })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const user = await verifyPassword(email, password)
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const secret = process.env.JWT_SECRET || 'devsecret'
    const token = jwt.sign({ email: user.email }, secret, { subject: user.id, expiresIn: '7d' })
    return res.json({ token })
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
