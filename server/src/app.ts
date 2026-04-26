import express from 'express';
import authRouter from './routes/auth.routes';
import usersRouter from './routes/users.routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorHandler } from './middleware/error.handler.middleware';
import helmet from 'helmet';

const app = express();

app.use(helmet())
app.use(cors())
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json({message: 'Home'});
})

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter)

app.use((req, res, next) => {
    next({status: 404, message: "Route not found"})
})

app.use(errorHandler);


export default app