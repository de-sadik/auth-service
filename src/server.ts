import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { signupRouter } from './routes/signup';
import { errorHandler } from '@hackathonskilldb/common-middlewares';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import cors from 'cors'



const app = express();
const corsOptions = {
  //To allow requests from client
  origin: [
    "http://localhost:3000",
  ],
  credentials: true,
  // exposedHeaders: ["set-cookie"],
}
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions))

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
app.use(signinRouter);
app.use(signoutRouter)


app.get('/helathcheck', (req, res) => {
  res.status(200);
  res.json({ message: 'server is live' });
});

app.use(errorHandler);

export default app;
