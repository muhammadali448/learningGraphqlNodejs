import jwt from "jsonwebtoken";

export const getUserId = (auth, isAuthRequired = true) => {
  if (auth) {
    const token = auth.split(" ")[1];
    const user = jwt.verify(token, "createUserToken");
    return user.userId;
  }
  if (isAuthRequired) {
    throw new Error("Unauthorized");
  }
  return null;
};
