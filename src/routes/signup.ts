import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { createNewUser, getUser } from '../handlers/user';
import { validateRequest, BadRequestError } from '@hackathonskilldb/common-middlewares';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('name').not().isEmpty().withMessage('name should be present'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const existingUser = await getUser(email);

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = await createNewUser(name, email, password);
    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        usrname: user.username,
      },
      process.env.JWT_KEY!,
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send({"username":user.username,"email":user.email});
  },
);

export { router as signupRouter };
