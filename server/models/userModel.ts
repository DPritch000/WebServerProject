import { supabase } from '../db/supabaseClient'
import bcrypt from 'bcrypt'

export type User = {
  id?: string
  email: string
  name?: string
  password_hash?: string
}

export async function createUser(email: string, password: string, name?: string) {
  const password_hash = await bcrypt.hash(password, 10)
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, name, password_hash }])
    .select()
  if (error) throw error
  return data?.[0]
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).limit(1)
  if (error) throw error
  return data?.[0]
}

export async function getUserById(id: string) {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).limit(1)
  if (error) throw error
  return data?.[0]
}

export async function updateUser(id: string, changes: Partial<User>) {
  const { data, error } = await supabase.from('users').update(changes).eq('id', id).select()
  if (error) throw error
  return data?.[0]
}

export async function deleteUser(id: string) {
  const { error } = await supabase.from('users').delete().eq('id', id)
  if (error) throw error
  return true
}

export async function verifyPassword(email: string, password: string) {
  const user = await getUserByEmail(email)
  if (!user || !user.password_hash) return false
  const ok = await bcrypt.compare(password, user.password_hash)
  return ok ? user : false
}
