/// <reference types="qs" />
import { Request, Response, NextFunction } from 'express';
interface UserPayload {
    id: string;
    email: string;
}
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}
export declare const currentUser: (req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>, next: NextFunction) => void;
export {};
