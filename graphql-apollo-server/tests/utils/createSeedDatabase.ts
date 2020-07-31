import { prisma } from '../../src/generated/prisma-client'
import { hashSync } from "bcrypt";
import { sign } from "jsonwebtoken";
const user1 = {
  inputFields: {
    name: "John Smith",
    email: "john_smith222@gmail.com",
    password: hashSync("hello123", 10),
  },
  user: undefined as any,
  jwt: undefined as string,
};

const user2 = {
  inputFields: {
    name: "Will Boogieman",
    email: "will222@gmail.com",
    password: hashSync("will123", 10),
  },
  user: undefined as any,
  jwt: undefined as string,
};

const post1 = {
  inputFields: {
    title: "test title",
    content: "test body",
    isPublished: true,
  },
  post: undefined as any,
};

const post2 = {
  inputFields: {
    title: "test title2",
    content: "test body2",
    isPublished: false,
  },
  post: undefined as any,
};

const comment1 = {
  inputFields: {
    text: "nice post comment_1",
  },
  comment: undefined as any,
};

const comment2 = {
  inputFields: {
    text: "nice post comment_2",
  },
  comment: undefined as any,
};

const createSeedDatabase = async () => {
  jest.setTimeout(10000);
  await prisma.deleteManyUsers();
  await prisma.deleteManyPosts();
  user1.user = await prisma.createUser({
    ...user1.inputFields,
  });
  user2.user = await prisma.createUser({
    ...user2.inputFields,
  });
  user1.jwt = sign({ userId: user1.user.id }, process.env.JWT_SECRET);
  user2.jwt = sign({ userId: user2.user.id }, process.env.JWT_SECRET);
  post1.post = await prisma.createPost({
    ...post1.inputFields,
    author: {
      connect: {
        id: user1.user.id,
      },
    },
  });
  post2.post = await prisma.createPost({
    ...post2.inputFields,
    author: {
      connect: {
        id: user2.user.id,
      },
    },
  });
  comment1.comment = await prisma.createComment({
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

  });
  comment2.comment = await prisma.createComment({
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
  });
  await prisma.createPost({
    title: "test title",
    content: "",
    isPublished: false,
    author: {
      connect: {
        id: user1.user.id,
      },
    },

  });
};

export { createSeedDatabase, user1, post1, post2, user2, comment1, comment2 };
