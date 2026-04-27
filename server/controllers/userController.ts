import { Response } from 'express'
import * as userModel from '../models/userModel'

export async function getProfile(req: any, res: Response) {
  try {
    const user = await userModel.getUserById(req.user.id)
    return res.json({ user })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err })
  }
}

export async function updateProfile(req: any, res: Response) {
  try {
    const changes = req.body
    const user = await userModel.updateUser(req.user.id, changes)
    return res.json({ user })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err })
  }
}

export async function deleteAccount(req: any, res: Response) {
  try {
    await userModel.deleteUser(req.user.id)
    return res.json({ ok: true })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err })
  }
}
