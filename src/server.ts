import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/helathcheck', (req, res) => {
  res.status(200);
  res.json({ message: 'server is live' });
});

export default app;
