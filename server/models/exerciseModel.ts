import { supabase } from '../db/supabaseClient'

export type ExerciseType = {
  id?: string
  name: string
  description?: string
  owner_id?: string
}

export async function createExercise(name: string, description?: string, owner_id?: string) {
  const { data, error } = await supabase
    .from('exercise_types')
    .insert([{ name, description, owner_id }])
    .select()
  if (error) throw error
  return data?.[0]
}

export async function getExerciseById(id: string) {
  const { data, error } = await supabase.from('exercise_types').select('*').eq('id', id).limit(1)
  if (error) throw error
  return data?.[0]
}

export async function getAllExercises() {
  const { data, error } = await supabase.from('exercise_types').select('*')
  if (error) throw error
  return data
}

export async function updateExercise(id: string, changes: Partial<ExerciseType>) {
  const { data, error } = await supabase.from('exercise_types').update(changes).eq('id', id).select()
  if (error) throw error
  return data?.[0]
}

export async function deleteExercise(id: string) {
  const { error } = await supabase.from('exercise_types').delete().eq('id', id)
  if (error) throw error
  return true
}
