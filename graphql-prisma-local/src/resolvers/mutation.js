import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const mutation = {
  updateUser: async (parent, { id, data }, { db: { users }, prisma }, info) => {
    const isUserExist = await prisma.exists.User({ id });
    if (!isUserExist) {
      throw new Error("User not exist");
    }
    const updateUser = await prisma.mutation.updateUser(
      {
        where: {
          id,
        },
        data,
      },
      info
    );
    return updateUser;
  },
  updatePost: async (parent, { id, data }, { prisma, pubsub }, info) => {
    const isPostExist = await prisma.exists.Post({ id });
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
  updateComment: async (parent, { id, data }, { prisma, pubsub }, info) => {
    const isCommentExist = await prisma.exists.Comment({ id });
    if (!isCommentExist) {
      throw new Error("Comment not exist");
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
  deleteComment: async (parent, { id }, { prisma, pubsub }, info) => {
    const isCommentExist = await prisma.exists.Comment({ id });
    if (!isCommentExist) {
      throw new Error("Comment not exist");
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
  deletePost: async (parent, { id }, { prisma, pubsub }, info) => {
    const isPostExist = await prisma.exists.Post({ id });
    if (!isPostExist) {
      throw new Error("Post not exist");
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
  deleteUser: async (parent, { id }, { prisma }, info) => {
    const isUserExist = await prisma.exists.User({ id });
    if (!isUserExist) {
      throw new Error("User not exist");
    }
    const deletedUser = await prisma.mutation.deleteUser(
      {
        where: {
          id,
        },
      },
      info
    );
    return deletedUser;
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
    { data: { title, body, isPublished, author } },
    { pubsub, prisma },
    info
  ) => {
    const isUserExist = await prisma.exists.User({ id: author });
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
              id: author,
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
    { data: { author, post, text } },
    { pubsub, prisma },
    info
  ) => {
    const isUserExist = await prisma.exists.User({ id: author });
    const isPostExist = await prisma.exists.Post({ id: post });
    if (!isUserExist) {
      throw new Error("User not exist");
    }
    if (!isPostExist) {
      throw new Error("Post not exist");
    }
    const newComment = await prisma.mutation.createComment(
      {
        data: {
          text,
          author: {
            connect: {
              id: author,
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
