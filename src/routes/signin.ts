import express, { Request, Response } from 'express';
import { validateRequest, BadRequestError } from '@hackathonskilldb/common-middlewares';
import { getUser } from '../handlers/user';
import jwt from 'jsonwebtoken';
import { Password } from '../utils/password';

const router = express.Router();

router.post('/api/users/signin', validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await getUser(email);

  if (!existingUser) {
    throw new BadRequestError('Email in use');
  }

  const passwordsMatch = await Password.compare(existingUser.password, password);
  if (!passwordsMatch) {
    throw new BadRequestError('Invalid Credentials');
  }

  // Generate JWT
  const userJwt = jwt.sign(
    {
      id: existingUser.id,
      email: existingUser.email,
      usrname: existingUser.username,
    },
    process.env.JWT_KEY!,
  );

  // Store it on session object
  req.session = {
    jwt: userJwt,
  };

  res.status(200).send(existingUser);
});

export { router as signinRouter };
