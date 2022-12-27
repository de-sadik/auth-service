import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { signupRouter } from './routes/signup';
import { errorHandler } from './errors/error-handler';
import { currentUserRouter } from './routes/current-user';



const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true);
app.use(
  cookieSession({
    signed: false,
    secure: false
  })
);

app.use(signupRouter)
app.use(currentUserRouter)


app.get('/helathcheck', (req, res) => {
  res.status(200);
  res.json({ message: 'server is live' });
});

app.use(errorHandler);

export default app;
