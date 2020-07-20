import bcrypt from "bcryptjs";
const generateHashPassword = (password) => {
  if (password.length < 8) {
    throw new Error("Password should be greater than 8 characters");
  }
  return bcrypt.hash(password, 10);
};

export default generateHashPassword;
