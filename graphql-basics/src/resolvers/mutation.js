import { v4 } from "uuid";
import post from "./post";
const mutation = {
  updateUser: (parent, { id, data }, { db: { users } }, info) => {
    const isUpdateUserExistIndex = users.findIndex((user) => user.id === id);
    if (isUpdateUserExistIndex === -1) {
      throw new Error("User not exist");
    }
    if (typeof data.email === "string") {
      const isEmailExist = users.some((user) => user.email === data.email);
      if (isEmailExist) {
        throw new Error("Email already exist try different one");
      }
    }
    users[isUpdateUserExistIndex] = {
      ...users[isUpdateUserExistIndex],
      ...data,
    };
    return users[isUpdateUserExistIndex];
  },
  updatePost: (parent, { id, data }, { db: { posts } }, info) => {
    const isUpdatePostExistIndex = posts.findIndex((post) => post.id === id);
    if (isUpdatePostExistIndex === -1) {
      throw new Error("Post not exist");
    }
    posts[isUpdatePostExistIndex] = {
      ...posts[isUpdatePostExistIndex],
      ...data,
    };
    return posts[isUpdatePostExistIndex];
  },
  updateComment: (parent, { id, data }, { db: { comments } }, info) => {
    const isUpdateCommentExistIndex = comments.findIndex(
      (comment) => comment.id === id
    );
    if (isUpdateCommentExistIndex === -1) {
      throw new Error("Comment not exist");
    }
    comments[isUpdateCommentExistIndex] = {
      ...comments[isUpdateCommentExistIndex],
      ...data,
    };
    return comments[isUpdateCommentExistIndex];
  },
  deleteComment: (parent, { id }, { db: { comments } }, info) => {
    const isCommentExistIndex = comments.findIndex(
      (comment) => comment.id === id
    );
    if (isCommentExistIndex === -1) {
      throw new Error("Comment not exist");
    }
    const deleteComment = comments.splice(isCommentExistIndex, 1);
    return deleteComment[0];
  },
  deletePost: (parent, { id }, { db: { posts, comments } }, info) => {
    const isPostExistIndex = posts.findIndex((post) => post.id === id);
    if (isPostExistIndex === -1) {
      throw new Error("Post not exist");
    }
    const deletedPost = posts.splice(isPostExistIndex, 1);
    comments = comments.filter((comment) => comment.post !== id);
    return deletedPost[0];
  },
  deleteUser: (parent, { id }, { db: { posts, comments, users } }, info) => {
    const isUserExistIndex = users.findIndex((user) => user.id === id);
    if (isUserExistIndex === -1) {
      throw new Error("User not exist");
    }
    const deletedUser = users.splice(isUserExistIndex, 1)[0];
    posts = posts.filter((post) => {
      const isDeleted = post.author === id;
      if (isDeleted) {
        comments = comments.filter((c) => c.post !== post.id);
      }
      return !isDeleted;
    });
    comments = comments.filter((comment) => comment.author !== id);
    return deletedUser;
  },
  createUser: (
    parent,
    { data: { email, name, age } },
    { db: { users } },
    info
  ) => {
    // console.log(args);
    const isEmailTaken = users.some((user) => user.email === email);
    if (isEmailTaken) {
      throw new Error("Email already taken");
    }
    const user = {
      id: v4(),
      name,
      email,
      age,
    };
    users.push(user);
    return user;
  },
  createPost: (
    parent,
    { data: { title, body, isPublished, author } },
    { db: { posts, users } },
    info
  ) => {
    const isUserExist = users.some((user) => user.id === author);
    if (!isUserExist) {
      throw new Error("User not exist");
    }
    const post = {
      id: v4(),
      title,
      body,
      isPublished,
      author: author,
    };
    posts.push(post);
    return post;
  },
  createComment: (
    parent,
    { data: { author, post, text } },
    { db: { posts, comments, users } },
    info
  ) => {
    console.log(post);
    const isUserExist = users.some((user) => user.id === author);
    const postFound = posts.some((p) => p.id === post && p.isPublished);
    posts.map((ps) =>
      console.log(ps.id + " : " + post + " : " + ps.isPublished)
    );
    if (!isUserExist || !postFound) {
      throw new Error("Error in creating a comment");
    }
    const comment = {
      id: v4(),
      author,
      post,
      text,
    };
    comments.push(comment);
    return comment;
  },
};

export default mutation;
