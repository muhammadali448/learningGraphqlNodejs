import jwt from "jsonwebtoken";

export const getUserId = (auth) => {
  if (!auth) {
    throw new Error("Unauthorized");
  }
  const token = auth.split(" ")[1];
  const user = jwt.verify(token, "createUserToken");
  return user.userId;
};
