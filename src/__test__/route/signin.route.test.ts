import app from '../../server';
import request from 'supertest';
import * as handlers from '../../handlers/user';
import User from '../../interface/user';
import { Password } from '../../utils/password';

describe(`Signin route`, () => {
  const testUser: User = {
    id: '1390266c-ddc8-445d-a1d0-66c5e9e1f759',
    createdAT: new Date('2022-12-26 17:10:28.385'),
    username: 'testuser',
    email: 'test@test.com',
    password: "asasasassas"
  };

  it('fails when a email that does not exist is supplied', async () => {
    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(400);
  });

  it('fails when an incorrect password is supplied', async () => {
    const existingUser = jest
      .spyOn(handlers, 'getUser')
      //@ts-ignore
      .mockReturnValueOnce(testUser);

      const passwordsMatch = jest
      .spyOn(Password,'compare')
      .mockResolvedValueOnce(false)  

    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'aslkdfjalskdfj',
      })
      .expect(400);

  });

  it('responds with a cookie when given valid credentials', async () => {
    const existingUser = jest
      .spyOn(handlers, 'getUser')
      //@ts-ignore
      .mockReturnValueOnce(testUser);
    
    const passwordsMatch = jest
    .spyOn(Password,'compare')
    .mockResolvedValueOnce(true)  

    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(200);
    
    expect(existingUser).toBeCalledWith('test@test.com');
    expect(response.get('Set-Cookie')).toBeDefined();
  });

});
