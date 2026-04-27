import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../models/users';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
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
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'username and password are required' });
      return;
    }
    const user = await createUser(username, password, role);
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
    const { username, password, role } = req.body;
    const updated = await updateUser(id, { username, password, role });
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

