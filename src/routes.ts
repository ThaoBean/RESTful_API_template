import { Express, Request, Response } from "express";
import {
    createPostHandler,
    updatePostHandler,
    getPostByIdHandler,
    deletePostHandler,
} from "./controller/post.controller";
import { createUserHandler } from "./controller/user.controller";
import {
    createUserSessionHandler,
    invalidUserSessionHandler,
    getUserSessionsHandler,
} from "./controller/session.controller";
import { validateRequest, requiresUser } from "./middleware";
import { createUserSchema, createSessionSchema } from "./schema/user.schema";
import {
    createPostSchema,
    updatePostSchema,
    deletePostSchema,
} from "./schema/post.schema";

export default function (app: Express) {
    app.get("/healthCheck", (req: Request, res: Response) => {
        res.sendStatus(200);
    });

    //Register user
    app.post(
        "/user/register",
        validateRequest(createUserSchema),
        createUserHandler,
    );

    //Login
    app.post(
        "/user/login",
        validateRequest(createSessionSchema),
        createUserSessionHandler,
    );

    //Get the user's sessions
    app.get("/user/sessions", requiresUser, getUserSessionsHandler);

    //Logout
    app.delete("/user/logout", requiresUser, invalidUserSessionHandler);

    //Create a post
    app.post(
        "/post/create",
        [requiresUser, validateRequest(createPostSchema)],
        createPostHandler,
    );

    //Update a posts
    app.put(
        "/post/update/:postId",
        [requiresUser, validateRequest(updatePostSchema)],
        updatePostHandler,
    );

    //Get a post by Id
    app.get("/post/getPostById/:postId", getPostByIdHandler);

    //Delete a post
    app.delete(
        "/post/delete/:postId",
        [requiresUser, validateRequest(deletePostSchema)],
        deletePostHandler,
    );
}
