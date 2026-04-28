import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getUserByUsername, createUser } from '../models/users';

dotenv.config({ path: 'server/.env' });

const router = Router();
const SALT_ROUNDS = 10;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return secret;
}

function formatAuthError(err: unknown): string {
  if (err instanceof AggregateError) {
    const nested = err.errors?.[0] as Error | undefined;
    if (nested?.message) return nested.message;
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return 'Auth request failed';
}

// POST /auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password, profilePicture } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'username and password are required' });
      return;
    }

    const existing = await getUserByUsername(username);
    if (existing) {
      res.status(409).json({ error: 'Username already taken' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await createUser(username, hashedPassword, profilePicture ?? null);

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        profilePicture: user.profile_picture,
      },
    });
  } catch (err) {
    const message = formatAuthError(err);
    console.error('Signup error:', err);
    res.status(500).json({ error: message });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'username and password are required' });
      return;
    }

    const user = await getUserByUsername(username);
    if (!user) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        profilePicture: user.profile_picture,
      },
    });
  } catch (err) {
    const message = formatAuthError(err);
    console.error('Login error:', err);
    res.status(500).json({ error: message });
  }
});

export default router;
