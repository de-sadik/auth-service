import app from '../../server';
import request from 'supertest';
import * as handlers from '../../handlers/user';
import User from '../../interface/user';
import { Password } from '../../utils/password';

describe(`Signin route`, () => {
  

  it('clears the cookie after signing out', async () => {
    
    const response = await request(app).post('/api/users/signout').send({}).expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
