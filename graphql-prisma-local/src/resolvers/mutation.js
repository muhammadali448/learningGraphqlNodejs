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
  updatePost: (parent, { id, data }, { db: { posts }, pubsub }, info) => {
    const isUpdatePostExistIndex = posts.findIndex((post) => post.id === id);
    const originalPost = {
      ...posts[isUpdatePostExistIndex],
    };

    if (isUpdatePostExistIndex === -1) {
      throw new Error("Post not exist");
    }
    const newPost = {
      ...posts[isUpdatePostExistIndex],
      ...data,
    };
    posts[isUpdatePostExistIndex] = newPost;
    if (typeof data.isPublished === "boolean") {
      if (originalPost.isPublished && !newPost.isPublished) {
        // deleted Post
        pubsub.publish("post", {
          post: { mutation: "DELETED", data: originalPost },
        });
      } else if (!originalPost.isPublished && newPost.isPublished) {
        // created Post
        pubsub.publish("post", {
          post: { mutation: "CREATED", data: newPost },
        });
      }
    } else if (originalPost.isPublished) {
      // updated
      pubsub.publish("post", { post: { mutation: "UPDATED", data: newPost } });
    }
    return newPost;
  },
  updateComment: (parent, { id, data }, { db: { comments }, pubsub }, info) => {
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
    pubsub.publish(`post-${comments[isUpdateCommentExistIndex].post}`, {
      comment: {
        mutation: "UPDATED",
        data: comments[isUpdateCommentExistIndex],
      },
    });
    return comments[isUpdateCommentExistIndex];
  },
  deleteComment: (parent, { id }, { db: { comments }, pubsub }, info) => {
    const isCommentExistIndex = comments.findIndex(
      (comment) => comment.id === id
    );
    if (isCommentExistIndex === -1) {
      throw new Error("Comment not exist");
    }
    const deleteComment = comments.splice(isCommentExistIndex, 1);
    pubsub.publish(`post-${deleteComment[0].post}`, {
      comment: { mutation: "DELETED", data: deleteComment[0] },
    });
    return deleteComment[0];
  },
  deletePost: (parent, { id }, { db: { posts, comments }, pubsub }, info) => {
    const isPostExistIndex = posts.findIndex((post) => post.id === id);
    if (isPostExistIndex === -1) {
      throw new Error("Post not exist");
    }
    const deletedPost = posts.splice(isPostExistIndex, 1)[0];
    comments = comments.filter((comment) => comment.post !== id);
    if (deletedPost.isPublished) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: deletedPost,
        },
      });
    }
    return deletedPost;
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
    { db: { posts, users }, pubsub },
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
    if (isPublished) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }
    return post;
  },
  createComment: (
    parent,
    { data: { author, post, text } },
    { db: { posts, comments, users }, pubsub },
    info
  ) => {
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
    pubsub.publish(`post-${post}`, {
      comment: { mutation: "CREATED", data: comment },
    });
    return comment;
  },
};

export default mutation;
