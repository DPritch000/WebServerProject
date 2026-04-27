import { Pool } from 'pg';
import dotenv from 'dotenv';
import type { User, UserRole } from '../types/index';

dotenv.config({ path: 'server/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase.co')
    ? { rejectUnauthorized: false }
    : undefined,
});

// GET all users
export async function getAllUsers(): Promise<User[]> {
  const { rows } = await pool.query<User>('SELECT * FROM users ORDER BY id');
  return rows;
}

// GET a single user by id
export async function getUserById(id: number): Promise<User | null> {
  const { rows } = await pool.query<User>('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] ?? null;
}

// GET a single user by username
export async function getUserByUsername(username: string): Promise<User | null> {
  const { rows } = await pool.query<User>('SELECT * FROM users WHERE username = $1', [username]);
  return rows[0] ?? null;
}

// CREATE a user
export async function createUser(
  username: string,
  password: string,
  role: UserRole = 'user'
): Promise<User> {
  const { rows } = await pool.query<User>(
    'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
    [username, password, role]
  );
  return rows[0];
}

// UPDATE a user
export async function updateUser(
  id: number,
  patch: Partial<Pick<User, 'username' | 'password' | 'role'>>
): Promise<User | null> {
  const fields = Object.keys(patch) as (keyof typeof patch)[];
  if (fields.length === 0) return getUserById(id);

  const setClauses = fields.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const values = fields.map(key => patch[key]);
  values.push(id as any);

  const { rows } = await pool.query<User>(
    `UPDATE users SET ${setClauses} WHERE id = $${fields.length + 1} RETURNING *`,
    values
  );
  return rows[0] ?? null;
}

// DELETE a user
export async function deleteUser(id: number): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
