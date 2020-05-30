import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';


// ValidationError has some specific properties, but we need to convert
// it into our consistent error structure => { errors: { message: string, field?: string} [] }
// this process is done in serializeErrors()
export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super('Invalid request parameters');
        // Only because we're extending a built-in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(error => {
            return { message: error.msg, field: error.param };
        });
    }
}