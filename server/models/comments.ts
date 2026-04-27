import { Pool } from 'pg';
import dotenv from 'dotenv';
import type { Comment } from '../types/index';

dotenv.config({ path: 'server/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase.co')
    ? { rejectUnauthorized: false }
    : undefined,
});

// GET all comments for a post
export async function getCommentsByPost(postId: number): Promise<Comment[]> {
  const { rows } = await pool.query<Comment>(
    'SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC',
    [postId]
  );
  return rows;
}

// GET a single comment by id
export async function getCommentById(id: number): Promise<Comment | null> {
  const { rows } = await pool.query<Comment>('SELECT * FROM comments WHERE id = $1', [id]);
  return rows[0] ?? null;
}

// CREATE a comment
export async function createComment(
  postId: number,
  authorId: number,
  content: string
): Promise<Comment> {
  const { rows } = await pool.query<Comment>(
    'INSERT INTO comments (post_id, author_id, content) VALUES ($1, $2, $3) RETURNING *',
    [postId, authorId, content]
  );
  return rows[0];
}

// UPDATE a comment's content
export async function updateComment(id: number, content: string): Promise<Comment | null> {
  const { rows } = await pool.query<Comment>(
    'UPDATE comments SET content = $1 WHERE id = $2 RETURNING *',
    [content, id]
  );
  return rows[0] ?? null;
}

// DELETE a comment
export async function deleteComment(id: number): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM comments WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
