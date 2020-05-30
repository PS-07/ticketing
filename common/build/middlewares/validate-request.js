"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_validator_1 = require("express-validator");
var request_validation_error_1 = require("../errors/request-validation-error");
// 'validationResult' inspects req and pulls out any info appended to the 
// req while the validation step (2nd arg in POST request in routes/signup.ts)
// we throw a RequestValidationError if an error is found
exports.validateRequest = function (req, res, next) {
    var errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        throw new request_validation_error_1.RequestValidationError(errors.array());
    }
    // next() fuuntion is called to move onto the next middleware
    next();
};
