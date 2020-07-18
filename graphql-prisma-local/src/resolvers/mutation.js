import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserId } from "../utils/getUserId";
const mutation = {
  updateUser: async (parent, { data }, { prisma, auth }, info) => {
    const userId = getUserId(auth);
    const isUserExist = await prisma.exists.User({ id: userId });
    if (!isUserExist) {
      throw new Error("User not exist");
    }
    const updateUser = await prisma.mutation.updateUser(
      {
        where: {
          id: userId,
        },
        data,
      },
      info
    );
    return updateUser;
  },
  updatePost: async (parent, { id, data }, { prisma, pubsub, auth }, info) => {
    const userId = getUserId(auth);
    const isPostExist = await prisma.exists.Post({
      id,
      author: {
        id: userId,
      },
    });
    if (!isPostExist) {
      throw new Error("Post not exist");
    }
    const updatedPost = await prisma.mutation.updatePost(
      {
        data,
        where: {
          id,
        },
      },
      info
    );
    return updatedPost;
  },
  updateComment: async (
    parent,
    { id, data },
    { prisma, pubsub, auth },
    info
  ) => {
    const userId = getUserId(auth);
    const isCommentExist = await prisma.exists.Comment({
      id,
      author: {
        id: userId,
      },
    });
    if (!isCommentExist) {
      throw new Error("Unauthorized");
    }
    const updatedComment = await prisma.mutation.updateComment(
      {
        where: {
          id,
        },
        data,
      },
      info
    );
    return updatedComment;
  },
  deleteComment: async (parent, { id }, { prisma, pubsub, auth }, info) => {
    const userId = getUserId(auth);
    const isCommentExist = await prisma.exists.Comment({
      id,
      author: { id: userId },
    });
    if (!isCommentExist) {
      throw new Error("Unauthorized");
    }
    const deletedComment = await prisma.mutation.deleteComment(
      {
        where: {
          id,
        },
      },
      info
    );
    return deletedComment;
  },
  deletePost: async (parent, { id }, { prisma, pubsub, auth }, info) => {
    const userId = getUserId(auth);
    const isPostExist = await prisma.exists.Post({
      id,
      author: { id: userId },
    });
    if (!isPostExist) {
      throw new Error("Unauthorized");
    }
    const deletedPost = await prisma.mutation.deletePost(
      {
        where: {
          id,
        },
      },
      info
    );
    return deletedPost;
  },
  deleteUser: async (parent, args, { prisma, auth }, info) => {
    const userId = getUserId(auth);
    const isUserExist = await prisma.exists.User({ id: userId });
    if (!isUserExist) {
      throw new Error("User not exist");
    }
    const deletedUser = await prisma.mutation.deleteUser(
      {
        where: {
          id: userId,
        },
      },
      info
    );
    return deletedUser;
  },
  loginUser: async (
    parent,
    { data: { email, password } },
    { prisma },
    info
  ) => {
    const user = await prisma.query.user({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error("User not exist");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Password not correct");
    }
    const token = jwt.sign(
      {
        userId: user.id,
      },
      "createUserToken"
    );
    return {
      user,
      token,
    };
  },
  createUser: async (
    parent,
    { data: { email, name, password } },
    { prisma },
    info
  ) => {
    const isEmailExist = await prisma.exists.User({ email });
    if (isEmailExist) {
      throw new Error("Email already exist");
    }
    if (password.length < 8) {
      throw new Error("Password should be greater than 8 characters");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.mutation.createUser({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });
    const token = jwt.sign(
      {
        userId: newUser.id,
      },
      "createUserToken"
    );
    return {
      user: newUser,
      token,
    };
  },
  createPost: async (
    parent,
    { data: { title, body, isPublished } },
    { pubsub, prisma, auth },
    info
  ) => {
    const userId = getUserId(auth);
    const isUserExist = await prisma.exists.User({ id: userId });
    if (!isUserExist) {
      throw new Error("User not exist");
    }
    const newPost = await prisma.mutation.createPost(
      {
        data: {
          title,
          body,
          isPublished,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      },
      info
    );
    return newPost;
  },
  createComment: async (
    parent,
    { data: { post, text } },
    { pubsub, prisma, auth },
    info
  ) => {
    const userId = getUserId(auth);
    const isUserExist = await prisma.exists.User({ id: userId });
    const isPostExist = await prisma.exists.Post({ id: post });
    const isCommentAuth = await prisma.exists.Comment({
      author: { id: userId },
    });
    if (!isUserExist) {
      throw new Error("User not exist");
    }
    if (!isPostExist) {
      throw new Error("Post not exist");
    }
    if (!isCommentAuth) {
      throw new Error("Unauthorized");
    }
    const newComment = await prisma.mutation.createComment(
      {
        data: {
          text,
          author: {
            connect: {
              id: userId,
            },
          },
          post: {
            connect: {
              id: post,
            },
          },
        },
      },
      info
    );
    return newComment;
  },
};

export default mutation;
