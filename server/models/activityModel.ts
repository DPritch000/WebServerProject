import { supabase } from '../db/supabaseClient'

export type Activity = {
  id?: string
  user_id: string
  exercise_id: string
  duration_minutes?: number
  notes?: string
  performed_at?: string
}

export async function createActivity(activity: Activity) {
  const { data, error } = await supabase.from('activities').insert([activity]).select()
  if (error) throw error
  return data?.[0]
}

export async function getActivityById(id: string) {
  const { data, error } = await supabase.from('activities').select('*').eq('id', id).limit(1)
  if (error) throw error
  return data?.[0]
}

export async function getActivitiesByUser(user_id: string) {
  const { data, error } = await supabase.from('activities').select('*').eq('user_id', user_id)
  if (error) throw error
  return data
}

export async function updateActivity(id: string, changes: Partial<Activity>) {
  const { data, error } = await supabase.from('activities').update(changes).eq('id', id).select()
  if (error) throw error
  return data?.[0]
}

export async function deleteActivity(id: string) {
  const { error } = await supabase.from('activities').delete().eq('id', id)
  if (error) throw error
  return true
}

// Extra model function: summary of minutes per exercise for a user
export async function getActivitySummaryByExercise(user_id: string) {
  // Supabase Postgrest client typing for aggregation can be awkward; fetch activities and summarize in JS
  const { data, error } = await supabase.from('activities').select('exercise_id, duration_minutes').eq('user_id', user_id)
  if (error) throw error
  const map: Record<string, number> = Object.create(null)
  (data || []).forEach((row: any) => {
    const ex = row.exercise_id
    const mins = Number(row.duration_minutes) || 0
    map[ex] = (map[ex] || 0) + mins
  })
  return Object.entries(map).map(([exercise_id, total_minutes]) => ({ exercise_id, total_minutes }))
}
