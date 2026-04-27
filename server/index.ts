import express from 'express';
import 'dotenv/config';
import authRouter from './controllers/auth';
import usersRouter from './controllers/users';
import postsRouter from './controllers/posts';
import commentsRouter from './controllers/comments';

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
});