import { Pool } from 'pg';
import dotenv from 'dotenv';
import type { Post } from '../types/index';

dotenv.config({ path: 'server/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase.co')
    ? { rejectUnauthorized: false }
    : undefined,
});

// GET all posts ordered by date descending
export async function getAllPosts(): Promise<Post[]> {
  const { rows } = await pool.query<Post>('SELECT * FROM posts ORDER BY date DESC');
  return rows;
}

// GET posts by a specific user
export async function getPostsByUser(authorId: number): Promise<Post[]> {
  const { rows } = await pool.query<Post>(
    'SELECT * FROM posts WHERE author_id = $1 ORDER BY date DESC',
    [authorId]
  );
  return rows;
}

// GET posts by a user and their friends
export async function getPostsForFeed(authorId: number, friendIds: number[]): Promise<Post[]> {
  const ids = [authorId, ...friendIds];
  const { rows } = await pool.query<Post>(
    'SELECT * FROM posts WHERE author_id = ANY($1::int[]) ORDER BY date DESC',
    [ids]
  );
  return rows;
}

// GET a single post by id
export async function getPostById(id: number): Promise<Post | null> {
  const { rows } = await pool.query<Post>('SELECT * FROM posts WHERE id = $1', [id]);
  return rows[0] ?? null;
}

// CREATE a post
export async function createPost(
  authorId: number,
  title: string,
  durationMinutes: number,
  date: string,
  description?: string,
  distanceKm?: number,
  picture?: string
): Promise<Post> {
  const { rows } = await pool.query<Post>(
    `INSERT INTO posts (author_id, title, description, duration_minutes, distance_km, date, picture)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [authorId, title, description ?? null, durationMinutes, distanceKm ?? null, date, picture ?? null]
  );
  return rows[0];
}

// UPDATE a post
export async function updatePost(
  id: number,
  patch: Partial<Pick<Post, 'title' | 'description' | 'duration_minutes' | 'distance_km' | 'date' | 'picture'>>
): Promise<Post | null> {
  const fields = Object.keys(patch) as (keyof typeof patch)[];
  if (fields.length === 0) return getPostById(id);

  const setClauses = fields.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const values = fields.map(key => patch[key]);
  values.push(id as any);

  const { rows } = await pool.query<Post>(
    `UPDATE posts SET ${setClauses} WHERE id = $${fields.length + 1} RETURNING *`,
    values
  );
  return rows[0] ?? null;
}

// DELETE a post
export async function deletePost(id: number): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
