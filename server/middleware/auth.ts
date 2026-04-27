import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: { id: string; email?: string }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Response | void {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'Missing Authorization header' })
  const parts = auth.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid Authorization format' })
  const token = parts[1]
  try {
    const secret = process.env.JWT_SECRET || 'devsecret'
    const payload = jwt.verify(token, secret) as any
    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
