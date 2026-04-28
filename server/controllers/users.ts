import { Router } from 'express';
import {
  getAllUsers,
  getAllPublicUsers,
  getUserById,
  getFollowingIds,
  followUser,
  unfollowUser,
  createUser,
  updateUser,
  deleteUser,
} from '../models/users';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users.map(u => ({
      id: u.id,
      username: u.username,
      role: u.role,
      profilePicture: u.profile_picture,
      created_at: u.created_at,
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/public/list', async (req, res) => {
  try {
    const viewerId = parseInt(String(req.query.viewerId ?? ''));
    if (isNaN(viewerId)) {
      res.status(400).json({ error: 'viewerId is required' });
      return;
    }

    const users = await getAllPublicUsers(viewerId);
    res.json(users);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch public users';
    console.error('Public users error:', err);
    res.status(500).json({ error: message });
  }
});

router.get('/:id/following', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid user id' });
      return;
    }

    const followingIds = await getFollowingIds(id);
    res.json({ followingIds });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch following list' });
  }
});

router.post('/:id/follow', async (req, res) => {
  try {
    const followingId = parseInt(req.params.id);
    const followerId = parseInt(String(req.body.followerId ?? ''));

    if (isNaN(followingId) || isNaN(followerId)) {
      res.status(400).json({ error: 'Valid followerId and following id are required' });
      return;
    }

    await followUser(followerId, followingId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

router.delete('/:id/follow', async (req, res) => {
  try {
    const followingId = parseInt(req.params.id);
    const followerId = parseInt(String(req.query.followerId ?? ''));

    if (isNaN(followingId) || isNaN(followerId)) {
      res.status(400).json({ error: 'Valid followerId and following id are required' });
      return;
    }

    await unfollowUser(followerId, followingId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid user id' });
      return;
    }
    const user = await getUserById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      profilePicture: user.profile_picture,
      created_at: user.created_at,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { username, password, role, profilePicture } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'username and password are required' });
      return;
    }
    const user = await createUser(username, password, profilePicture ?? null, role);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid user id' });
      return;
    }
    const { username, password, role, profilePicture } = req.body;
    const updated = await updateUser(id, {
      username,
      password,
      role,
      profile_picture: profilePicture,
    });
    if (!updated) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid user id' });
      return;
    }
    const deleted = await deleteUser(id);
    if (!deleted) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;

