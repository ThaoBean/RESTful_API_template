import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { decode } from "../utils/jwt.utils";
import { reIssueAccessToken } from "../service/session.service";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    //Lấy token được gửi lên từ phía client
    // console.log(req);

    const accessToken = get(req, "headers.authorization", "").replace(
        /^Bearer\s/,
        ""
    );
    console.log("===> accessToken: ", accessToken);

    const refreshToken = get(req, "headers.x-refresh"); //neu ko co thi se la undefined

    console.log(" ===> refreshToken: ",refreshToken);   
    if (!accessToken) return next();

    const { decoded, expired } = decode(accessToken);
    console.log("====> decoded, expired: ", decoded, expired);

    if (decoded) {
        // @ts-ignore
        req.user = decoded;
        // @ts-ignore
        console.log("===> req.use1: ", req.user);
        return next();
    }

    if (expired && refreshToken) {
        const newAccessToken = await reIssueAccessToken({ refreshToken });

        if (newAccessToken) {
            // Add the new access token to the response header
            res.setHeader("x-access-token", newAccessToken);

            const { decoded } = decode(newAccessToken);

            // @ts-ignore
            req.user = decoded;
            // @ts-ignore
            console.log(req.user);
        }

        return next();
    }

    return next();
};

export default deserializeUser;