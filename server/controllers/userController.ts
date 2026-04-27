import { Response } from 'express'
import * as userModel from '../models/userModel'

export async function listAll(_req: any, res: Response) {
  try {
    // Note: In production, add pagination and filtering
    const users = await userModel.getAllUsers()
    return res.json({ items: users })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err })
  }
}

export async function getProfile(req: any, res: Response) {
  try {
    const user = await userModel.getUserById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    return res.json({ user })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err })
  }
}

export async function getById(req: any, res: Response) {
  try {
    const id = req.params.id
    const user = await userModel.getUserById(id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    return res.json({ user })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err })
  }
}

export async function updateProfile(req: any, res: Response) {
  try {
    const changes = req.body
    // Don't allow changing username/password via profile update
    delete changes.username
    delete changes.password_hash
    const user = await userModel.updateUser(req.user.id, changes)
    if (!user) return res.status(404).json({ error: 'User not found' })
    return res.json({ user })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err })
  }
}

export async function deleteAccount(req: any, res: Response) {
  try {
    const deleted = await userModel.deleteUser(req.user.id)
    if (!deleted) return res.status(404).json({ error: 'User not found' })
    return res.json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err })
  }
}
