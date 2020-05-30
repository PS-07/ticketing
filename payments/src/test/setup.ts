import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../app';

// add a global getCookie() function
declare global {
    namespace NodeJS {
        interface Global {
            getCookie(id?: string): string[];
        }
    }
}

jest.mock('../nats-wrapper');

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
    jest.clearAllMocks();
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

// getCookie() returns a cookie
// since a cookie is generated when a user signup/signin, so we will have to replicate it
// for testing. but then we would use auth service. since we should avoid communication between
// microservices, we will generate a cookie with some other fake way (with using auth service)
global.getCookie = (id?: string) => {
    // build a JWT payload: { id, email }
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test958@test.com'
    };

    // create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // build session object: { jwt: JWT }
    const session = { jwt: token };

    // turn the session object into JSON
    const sessionJSON = JSON.stringify(session);

    // take JSON and encoode it into base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // return a string thats the cookie with encoded data
    const cookie = `express:sess=${base64}`;
    return [cookie];
};