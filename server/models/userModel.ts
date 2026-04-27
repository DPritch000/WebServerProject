import { supabase } from '../db/supabaseClient'
import bcrypt from 'bcrypt'

export type User = {
  id?: string
  username: string
  name?: string
  password_hash?: string
}

export async function createUser(username: string, password: string, name?: string) {
  const password_hash = await bcrypt.hash(password, 10)
  const { data, error } = await supabase
    .from('users')
    .insert([{ username, name, password_hash }])
    .select()
  if (error) throw error
  return data?.[0]
}

export async function getUserByUsername(username: string) {
  const { data, error } = await supabase.from('users').select('*').eq('username', username).limit(1)
  if (error) throw error
  return data?.[0]
}

export async function getUserById(id: string) {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).limit(1)
  if (error) throw error
  return data?.[0]
}

export async function getAllUsers() {
  const { data, error } = await supabase.from('users').select('*')
  if (error) throw error
  return data || []
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

export async function verifyPassword(username: string, password: string) {
  const user = await getUserByUsername(username)
  if (!user || !user.password_hash) return false
  const ok = await bcrypt.compare(password, user.password_hash)
  return ok ? user : false
}
