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
    `SELECT c.*, u.username AS author_username, u.profile_picture AS author_profile_picture
     FROM comments c
     JOIN users u ON u.id = c.author_id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
    [postId]
  );
  return rows;
}

// GET a single comment by id
export async function getCommentById(id: number): Promise<Comment | null> {
  const { rows } = await pool.query<Comment>(
    `SELECT c.*, u.username AS author_username, u.profile_picture AS author_profile_picture
     FROM comments c
     JOIN users u ON u.id = c.author_id
     WHERE c.id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

// CREATE a comment
export async function createComment(
  postId: number,
  authorId: number,
  content: string
): Promise<Comment> {
  const { rows } = await pool.query<Comment>(
    `WITH inserted AS (
      INSERT INTO comments (post_id, author_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    )
    SELECT i.*, u.username AS author_username, u.profile_picture AS author_profile_picture
    FROM inserted i
    JOIN users u ON u.id = i.author_id`,
    [postId, authorId, content]
  );
  return rows[0];
}

// UPDATE a comment's content
export async function updateComment(id: number, content: string): Promise<Comment | null> {
  const { rows } = await pool.query<Comment>(
    `WITH updated AS (
      UPDATE comments
      SET content = $1
      WHERE id = $2
      RETURNING *
    )
    SELECT u2.*, u.username AS author_username, u.profile_picture AS author_profile_picture
    FROM updated u2
    JOIN users u ON u.id = u2.author_id`,
    [content, id]
  );
  return rows[0] ?? null;
}

// DELETE a comment
export async function deleteComment(id: number): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM comments WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
