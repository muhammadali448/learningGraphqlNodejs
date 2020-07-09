const user = {
  posts: (parent, args, { db }, info) =>
    posts.filter((post) => post.author === parent.id),
  comments: (parent, args, { db }, info) =>
    comments.filter((comment) => comment.author === parent.id),
};

export default user;
