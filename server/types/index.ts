import express from 'express';
import usersRouter from './controllers/users';
import postsRouter from './controllers/posts';
import commentsRouter from './controllers/comments';

const app = express();

app.use(express.json());
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

export type UserRole = 'admin' | 'user';

export type User = {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  created_at: Date;
};

export type Post = {
  id: number;
  title: string;
  description: string | null;
  author_id: number;
  duration_minutes: number;
  distance_km: number | null;
  date: Date;
  picture: string | null;
  created_at: Date;
};

export type Comment = {
  id: number;
  content: string;
  post_id: number;
  author_id: number;
  created_at: Date;
};

export type Exercise = {
  id: number;
  name: string;
  type: string;
  duration: number;
  photo: string | null;
  created_at: Date;
};
