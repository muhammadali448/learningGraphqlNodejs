import jwt from "jsonwebtoken";
const generateToken = (userId) => {
  const token = jwt.sign(
    {
      userId,
    },
    "createUserToken",
    {
      expiresIn: "7d",
    }
  );
  return token;
};

export default generateToken;
