import express from "express";
import { createUserHandler } from "../controller/user.controller";
import {
    createUserSessionHandler,
    invalidUserSessionHandler,
    getUserSessionsHandler,
} from "../controller/session.controller";
import { createUserSchema, createSessionSchema } from "../schema/user.schema";
import { validateRequest, requiresUser } from "../middleware";

// const exp = express();
const userRouter = express.Router();

//Register user
userRouter.post(
    "/register",
    validateRequest(createUserSchema),
    createUserHandler,
);

//Login or generate token
userRouter.post(
    "/login",
    validateRequest(createSessionSchema),
    createUserSessionHandler,
);

//Get the user's sessions
userRouter.get("/sessions", requiresUser, getUserSessionsHandler);

//Logout
userRouter.delete("/logout", requiresUser, invalidUserSessionHandler);

export default userRouter;
