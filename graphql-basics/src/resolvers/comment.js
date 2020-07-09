const comment = {
  author: (parent, args, { db: { users } }, info) =>
    users.find((f) => f.id === parent.author),
  post: (parent, args, { db: { posts } }, info) =>
    posts.find((f) => f.id === parent.post),
};

export default comment;
