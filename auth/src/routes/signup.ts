import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@pstickets/common';

import { User } from '../models/user';

const router = express.Router();

// the 'express-validator' lib is used to validate email and password from incoming request
// the validation is applied as a middleware to thr POST request (in 2nd argument)
// body('email') extracts the email property from the body of the incoming request, same for password

// to communicate the results of validation to the user, 'validateRequest' middleware is imported
router.post(
    '/api/users/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage('Password must be between 4 and 20 characters')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new BadRequestError('Email in use');
        }

        // build and save the user to db
        const user = User.build({ email, password });
        await user.save();

        // Generate JWT
        // the payload in JWT will have id and email (user info)
        // the second arg is a secret key, a ! is used at the end because we've already checked
        // that secret key exists in index.ts file and we don't want typescript to give an error
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!);

        // Store it on session object
        req.session = {
            jwt: userJwt
        };

        res.status(201).send(user);
    }
);

export { router as signupRouter };
