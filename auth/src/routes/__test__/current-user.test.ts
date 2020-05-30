import request from 'supertest';
import { app } from '../../app';

it('responds with detail about the current user', async () => {
    // getCookie() is defined in 'auth/src/test/setup.ts' as a global function
    const cookie = await global.getCookie();

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);

    expect(response.body.currentUser).toEqual(null);
});