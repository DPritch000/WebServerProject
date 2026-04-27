import { Router } from 'express';
import {
  getCommentsByPost,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} from '../models/comments';

const router = Router();

// GET /comments/post/:postId — all comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    if (isNaN(postId)) {
      res.status(400).json({ error: 'Invalid post id' });
      return;
    }
    const comments = await getCommentsByPost(postId);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// GET /comments/:id — single comment
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid comment id' });
      return;
    }
    const comment = await getCommentById(id);
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comment' });
  }
});

// POST /comments — create a comment
router.post('/', async (req, res) => {
  try {
    const { postId, authorId, content } = req.body;
    if (!postId || !authorId || !content) {
      res.status(400).json({ error: 'postId, authorId, and content are required' });
      return;
    }
    const comment = await createComment(postId, authorId, content);
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// PATCH /comments/:id — update a comment
router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid comment id' });
      return;
    }
    const { content } = req.body;
    if (!content) {
      res.status(400).json({ error: 'content is required' });
      return;
    }
    const updated = await updateComment(id, content);
    if (!updated) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// DELETE /comments/:id — delete a comment
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid comment id' });
      return;
    }
    const deleted = await deleteComment(id);
    if (!deleted) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;
