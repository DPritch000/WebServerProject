import { Router } from 'express';
import {
  getAllPosts,
  getPostsByUser,
  getPostsForFeed,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../models/posts';

const router = Router();

// GET /posts — all posts
router.get('/', async (_req, res) => {
  try {
    const posts = await getAllPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /posts/user/:userId — posts by a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user id' });
      return;
    }
    const posts = await getPostsByUser(userId);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /posts/feed/:userId?friends=1,2,3 — posts for a user's feed
router.get('/feed/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user id' });
      return;
    }
    const friendIds = req.query.friends
      ? String(req.query.friends).split(',').map(Number).filter(n => !isNaN(n))
      : [];
    const posts = await getPostsForFeed(userId, friendIds);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

// GET /posts/:id — single post
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid post id' });
      return;
    }
    const post = await getPostById(id);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST /posts — create a post
router.post('/', async (req, res) => {
  try {
    const { authorId, title, durationMinutes, date, description, distanceKm, picture } = req.body;
    if (!authorId || !title || !durationMinutes || !date) {
      res.status(400).json({ error: 'authorId, title, durationMinutes, and date are required' });
      return;
    }
    const post = await createPost(authorId, title, durationMinutes, date, description, distanceKm, picture);
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// PATCH /posts/:id — update a post
router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid post id' });
      return;
    }
    const { title, description, duration_minutes, distance_km, date, picture } = req.body;
    const updated = await updatePost(id, { title, description, duration_minutes, distance_km, date, picture });
    if (!updated) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE /posts/:id — delete a post
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid post id' });
      return;
    }
    const deleted = await deletePost(id);
    if (!deleted) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
