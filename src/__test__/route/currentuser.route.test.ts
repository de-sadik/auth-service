import app from '../../server';
import request from 'supertest';
import * as handlers from '../../handlers/user';
import User from '../../interface/user';




describe(`Current user  route`, () => {
    let cookie:any 
    beforeAll(async ()=>{
        const testUser: Omit<User, 'password'> = {
            id: '1390266c-ddc8-445d-a1d0-66c5e9e1f759',
            createdAT: new Date('2022-12-26 17:10:28.385'),
            username: 'testuser',
            email: 'test@test.com',
          };
    
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
            name: 'testuser',
            email: 'test@test.com',
            password: 'password',
          })
    
        cookie = response.get("Set-Cookie");
    
    })

  it('responds with details about the current user', async () => {

    const response = await request(app).get('/api/users/currentuser').set('Cookie', cookie).send().expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com');
  });

  it('responds with null if not authenticated', async () => {
    const response = await request(app).get('/api/users/currentuser').send().expect(200);

    expect(response.body.currentUser).toEqual(null);
  });

});
