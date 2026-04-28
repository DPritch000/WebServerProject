import { Pool } from 'pg';
import dotenv from 'dotenv';
import type { PublicUser, User, UserRole } from '../types/index';

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

export async function getAllPublicUsers(viewerId: number): Promise<PublicUser[]> {
  const { rows } = await pool.query<PublicUser>(
    `SELECT u.id, u.username, u.role,
      u.profile_picture AS "profilePicture",
      EXISTS (
        SELECT 1 FROM follows f
        WHERE f.follower_id = $1 AND f.following_id = u.id
      ) AS "isFollowing"
     FROM users u
     WHERE u.id <> $1
     ORDER BY u.username ASC`,
    [viewerId]
  );
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

export async function getFollowingIds(userId: number): Promise<number[]> {
  const { rows } = await pool.query<{ following_id: number }>(
    'SELECT following_id FROM follows WHERE follower_id = $1',
    [userId]
  );
  return rows.map(r => r.following_id);
}

export async function isFollowing(followerId: number, followingId: number): Promise<boolean> {
  if (followerId === followingId) return true;

  const { rows } = await pool.query<{ exists: boolean }>(
    `SELECT EXISTS (
      SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2
    )`,
    [followerId, followingId]
  );
  return rows[0]?.exists ?? false;
}

export async function followUser(followerId: number, followingId: number): Promise<void> {
  await pool.query(
    `INSERT INTO follows (follower_id, following_id)
     VALUES ($1, $2)
     ON CONFLICT (follower_id, following_id) DO NOTHING`,
    [followerId, followingId]
  );
}

export async function unfollowUser(followerId: number, followingId: number): Promise<void> {
  await pool.query(
    'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
    [followerId, followingId]
  );
}

// CREATE a user
export async function createUser(
  username: string,
  password: string,
  profilePicture: string | null = null,
  role: UserRole = 'user'
): Promise<User> {
  const finalProfilePicture =
    profilePicture ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`;

  const { rows } = await pool.query<User>(
    'INSERT INTO users (username, password, profile_picture, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [username, password, finalProfilePicture, role]
  );
  return rows[0];
}

// UPDATE a user
export async function updateUser(
  id: number,
  patch: Partial<Pick<User, 'username' | 'password' | 'profile_picture' | 'role'>>
): Promise<User | null> {
  const fields = (Object.keys(patch) as (keyof typeof patch)[]).filter(key => patch[key] !== undefined);
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
