import { Request, Response } from 'express'
import * as exerciseModel from '../models/exerciseModel'

export async function list(_req: Request, res: Response) {
  try {
    const items = await exerciseModel.getAllExercises()
    return res.json({ items })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err })
  }
}

export async function create(req: any, res: Response) {
  try {
    const { name, description } = req.body
    const owner_id = req.user?.id
    const item = await exerciseModel.createExercise(name, description, owner_id)
    return res.json({ item })
  } catch (err: any) {
    return res.status(400).json({ error: err.message || err })
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id
    const item = await exerciseModel.updateExercise(id, req.body)
    return res.json({ item })
  } catch (err: any) {
    return res.status(400).json({ error: err.message || err })
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    await exerciseModel.deleteExercise(id)
    return res.json({ ok: true })
  } catch (err: any) {
    return res.status(400).json({ error: err.message || err })
  }
}
