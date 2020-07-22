import jwt from "jsonwebtoken";

export const getUserId = (auth, isAuthRequired = true) => {
  const authTokenWithBarer = auth.request
    ? auth.request.headers.authorization
    : auth.connection.context.Authorization;
  if (authTokenWithBarer) {
    const token = authTokenWithBarer.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user.userId;
  }
  if (isAuthRequired) {
    throw new Error("Unauthorized");
  }
  return null;
};
