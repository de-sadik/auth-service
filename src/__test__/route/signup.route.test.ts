import app from '../../server';
import request from 'supertest';
import * as handlers from '../../handlers/user';
import User from '../../interface/user';

describe(`Signup route`, () => {
  const testUser: Omit<User, 'password'> = {
    id: '1390266c-ddc8-445d-a1d0-66c5e9e1f759',
    createdAT: new Date('2022-12-26 17:10:28.385'),
    username: 'testuser',
    email: 'test@test.com',
  };
  it('returns a 201 on successful signup', async () => {
    const existingUser = jest
      .spyOn(handlers, 'getUser')
      //@ts-ignore
      .mockReturnValueOnce(null);

    const user = jest
      .spyOn(handlers, 'createNewUser')
      //@ts-ignore
      .mockReturnValueOnce(testUser);

    return await request(app)
      .post('/api/users/signup')
      .send({
        name: 'testuser',
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);
  });

  it('returns a 400 with an invalid email', async () => {
    return await request(app)
      .post('/api/users/signup')
      .send({
        name: 'testuser',
        email: 'alskdflaskjfd',
        password: 'password',
      })
      .expect(400);
  });

  it('returns a 400 with an invalid password', async () => {
    return await request(app)
      .post('/api/users/signup')
      .send({
        name: 'testuser',
        email: 'alskdflaskjfd',
        password: 'p',
      })
      .expect(400);
  });

  it('returns a 400 with missing email and password and name', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'alskjdf',
      })
      .expect(400);

    await request(app)
      .post('/api/users/signup')
      .send({
        name: 'testuser',
        password: 'alskjdf',
      })
      .expect(400);

    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        name: 'testuser',
      })
      .expect(400);
  });

  it('disallows duplicate emails', async () => {
    const existingUser = jest
      .spyOn(handlers, 'getUser')
      //@ts-ignore
      .mockReturnValueOnce(testUser);

    await request(app)
      .post('/api/users/signup')
      .send({
        name:"testuser",
        email: 'test@test.com',
        password: 'password',
      })
      .expect(400);
  });

  it('sets a cookie after successful signup', async () => {
    const existingUser = jest
      .spyOn(handlers, 'getUser')
      //@ts-ignore
      .mockReturnValueOnce(null);

    const user = jest
      .spyOn(handlers, 'createNewUser')
      //@ts-ignore
      .mockReturnValueOnce(testUser);
      
    const response = await request(app)
      .post('/api/users/signup')
      .send({
        name:"testuser",
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
