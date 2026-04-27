import { Request, Response } from 'express'
import * as activityModel from '../models/activityModel'

export async function listByUser(req: any, res: Response) {
  try {
    const user_id = req.user.id
    const items = await activityModel.getActivitiesByUser(user_id)
    return res.json({ items })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err })
  }
}

export async function getById(req: any, res: Response) {
  try {
    const id = req.params.id
    const user_id = req.user.id
    const item = await activityModel.getActivityById(id)
    if (!item) return res.status(404).json({ error: 'Activity not found' })
    // Verify ownership (user can only see their own activities)
    if (item.user_id !== user_id) return res.status(403).json({ error: 'Unauthorized' })
    return res.json({ item })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err })
  }
}

export async function create(req: any, res: Response) {
  try {
    const user_id = req.user.id
    const payload = { ...req.body, user_id }
    const item = await activityModel.createActivity(payload)
    return res.json({ item })
  } catch (err: any) {
    return res.status(400).json({ error: err.message || err })
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id
    const item = await activityModel.updateActivity(id, req.body)
    return res.json({ item })
  } catch (err: any) {
    return res.status(400).json({ error: err.message || err })
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    await activityModel.deleteActivity(id)
    return res.json({ ok: true })
  } catch (err: any) {
    return res.status(400).json({ error: err.message || err })
  }
}

export async function summary(req: any, res: Response) {
  try {
    const user_id = req.user.id
    const data = await activityModel.getActivitySummaryByExercise(user_id)
    return res.json({ data })
  } catch (err: any) {
    return res.status(500).json({ error: err.message || err })
  }
}
