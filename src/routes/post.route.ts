import express from "express"; 
import {
    createPostSchema,
    updatePostSchema,
    deletePostSchema,
} from "../schema/post.schema";
import {
    createPostHandler,
    updatePostHandler,
    getPostByIdHandler,
    deletePostHandler,
} from "../controller/post.controller";
import { validateRequest, requiresUser } from "../middleware";

const postRouter = express.Router();

//Create a post
postRouter.post(
    "/create",
    [requiresUser, validateRequest(createPostSchema)],
    createPostHandler,
);

//Update a posts
postRouter.put(
    "/update/:postId",
    [requiresUser, validateRequest(updatePostSchema)],
    updatePostHandler,
);

//Get a post by Id
postRouter.get("/post/getPostById/:postId", getPostByIdHandler);

//Delete a post
postRouter.delete(
    "/delete/:postId",
    [requiresUser, validateRequest(deletePostSchema)],
    deletePostHandler,
);

export default postRouter;