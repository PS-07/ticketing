import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

// add a global getCookie() function
declare global {
    namespace NodeJS {
        interface Global {
            getCookie(): Promise<string[]>;
        }
    }
}

let mongo: any;

// connect to MongoDb
beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';
    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

// clear the db before each test
beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

// close the connection to MongoDb
afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

// getCookie() return the cookie received by browser while signup/signin
global.getCookie = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({ email, password })
        .expect(201);

    const cookie = response.get('Set-Cookie');
    return cookie;
};