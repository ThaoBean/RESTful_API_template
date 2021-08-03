import {Request, Response } from "express";
import {get} from "lodash";
import {validatePassword} from "../service/user.service";
import {createSession, createAccessToken, updateSession, findSessions} from "../service/session.service";
import config from 'config';
import {sign} from '../utils/jwt.utils';


export async function createUserSessionHandler(req: Request, res: Response){

    //Validate the email and password
    const user = await validatePassword(req.body);
    if(!user){
        return res.status(401).send("Invalid Username or Password");
    }  
    
    //Create a session
    const session = await createSession(user._id, req.get("user-agent") || "");

    //Create access token
    const accessToken = createAccessToken({user, session});

    //create refresh token
    const refreshToken = sign(session, {
        expiresIn: config.get("refreshTokenTtl"), //1 year
    });

    //send refresh and access token back
    return res.send({accessToken, refreshToken})
}

export async function invalidUserSessionHandler(req: Request, res: Response){
    const sessionId = get(req, "user.session");
    await updateSession({_id: sessionId}, {valid: false});
    return res.sendStatus(200);
}

export async function getUserSessionsHandler(req: Request, res: Response){
    const userId = get(req, "user._id");

    const sessions = await findSessions({user: userId, valid: true});

    return res.send(sessions);
}