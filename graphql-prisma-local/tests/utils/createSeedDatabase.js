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

const user2 = {
  inputFields: {
    name: "Will Boogieman",
    email: "will222@gmail.com",
    password: bcrypt.hashSync("will123"),
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

const comment1 = {
  inputFields: {
    text: "nice post comment_1",
  },
  comment: undefined,
};

const comment2 = {
  inputFields: {
    text: "nice post comment_2",
  },
  comment: undefined,
};

const createSeedDatabase = async () => {
  jest.setTimeout(10000);
  await prisma.mutation.deleteManyUsers();
  await prisma.mutation.deleteManyPosts();
  user1.user = await prisma.mutation.createUser({
    data: user1.inputFields,
  });
  user2.user = await prisma.mutation.createUser({
    data: user2.inputFields,
  });
  user1.jwt = jwt.sign({ userId: user1.user.id }, process.env.JWT_SECRET);
  user2.jwt = jwt.sign({ userId: user2.user.id }, process.env.JWT_SECRET);
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
  comment1.comment = await prisma.mutation.createComment({
    data: {
      ...comment1.inputFields,
      author: {
        connect: {
          id: user1.user.id,
        },
      },
      post: {
        connect: {
          id: post1.post.id,
        },
      },
    },
  });
  comment2.comment = await prisma.mutation.createComment({
    data: {
      ...comment2.inputFields,
      author: {
        connect: {
          id: user2.user.id,
        },
      },
      post: {
        connect: {
          id: post1.post.id,
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

export { createSeedDatabase, user1, post1, user2, comment1, comment2 };
