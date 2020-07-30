import { verify } from "jsonwebtoken";
import { Context } from '../types'
export const APP_SECRET = 'chai-peelo:v2'
interface Token {
    userId: string
};
export const getUserId = (context: Context, isAuthRequired = true) => {
    const authTokenWithBarer = context.request.request
        ? context.request.request.headers.authorization
        : context.request.connection.context.Authorization;
    if (authTokenWithBarer) {
        const token = authTokenWithBarer.split(" ")[1];
        const user = verify(token, APP_SECRET) as Token;
        console.log(user.userId);
        return user.userId;
    }
    return null;
};