import express from 'express';
import 'dotenv/config';
import authRouter from './controllers/auth';
import usersRouter from './controllers/users';
import postsRouter from './controllers/posts';
import commentsRouter from './controllers/comments';

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Vary', 'Origin');
    }
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
        return;
    }
    next();
});

app.use(express.json());

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
});