import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    // check if the secret key is defined
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    // mongoose is used to connect to a MongoDb instance
    // using the ClusterIP service of the database (auth-mongo-srv)
    // '/auth' at the end creates a database named auth
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to MongoDb');
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000');
    });
};

start();