import prisma from "../../src/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const user1 = {
  inputFields: {
    name: "John Smith",
    email: "john_smith222@gmail.com",
    password: bcrypt.hashSync("hello123"),
  },
  user: undefined,
  jwt: undefined,
};

const post1 = {
  inputFields: {
    title: "test title",
    body: "test body",
    isPublished: true,
  },
  post: undefined,
};

const createSeedDatabase = async () => {
  await prisma.mutation.deleteManyUsers();
  await prisma.mutation.deleteManyPosts();
  user1.user = await prisma.mutation.createUser({
    data: user1.inputFields,
  });
  user1.jwt = jwt.sign({ userId: user1.user.id }, process.env.JWT_SECRET);
  post1.post = await prisma.mutation.createPost({
    data: {
      ...post1.inputFields,
      author: {
        connect: {
          id: user1.user.id,
        },
      },
    },
  });
  await prisma.mutation.createPost({
    data: {
      title: "test title",
      body: "",
      isPublished: false,
      author: {
        connect: {
          id: user1.user.id,
        },
      },
    },
  });
};

export { createSeedDatabase, user1, post1 };
