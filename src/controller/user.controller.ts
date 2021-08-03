import {Request, Response } from "express";
import {omit} from "lodash";
import { createUser } from "../service/user.service";
import log from "../logger";

export async function createUserHandler(req: Request, res: Response){
    try{
        const user = await createUser(req.body);
        return res.send(omit(user.toJSON(), "password")); //bo thuoc tinh password, lay toan bo cac thuoc tinh con laij
    }catch(e: any){
        log.error(e);
        // return res.status(409).send(e.message);
        return res.status(409).send("Duplicate email, email is unique.");
    }
}

