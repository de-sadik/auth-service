import User from '../interface/user';
import prisma from '../utils/db';
import { Password } from '../utils/password';

export const getUser = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user
};

export const createNewUser = async (name: string,email:string,password:string): Promise<User>  => {
    const user = await prisma.user.create({
      data: {
        username: name,
        email: email,
        password: await Password.toHash(password)
      }
    })
    return user
}
