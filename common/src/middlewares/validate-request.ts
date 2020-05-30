import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';

// 'validationResult' inspects req and pulls out any info appended to the 
// req while the validation step (2nd arg in POST request in routes/signup.ts)
// we throw a RequestValidationError if an error is found
export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    // next() fuuntion is called to move onto the next middleware
    next();
};