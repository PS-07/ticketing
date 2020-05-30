import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@pstickets/common';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

const app = express();

// Middlewares
// since traffic is being proxied to the app through Ingress-Nginx, so express will raise an issue
// this command tells express to trust the connection even though it is proxied
app.set('trust proxy', true);
app.use(json());

// signed: false -> cookie will not be encrypted, since JWT is by defualt encrypted
// secure: true  -> cookies will only be used if user visits the app on https connection
// we won't check the connection when in test env
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// NotFoundError will be thrown incase of any invalid URL
// since all 4 valid routes have been checked prior to this, any other
// wrong URL would invoke it. 'all' is used to every type of req i.e. GET, POST etc.

// the 'express-async-errors' package allows changes how express handlers route handlers
// not this async func will await to listen to any error (else we would have used next function)
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };