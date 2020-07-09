const query = {
  users: (_, { name }, { db: { users } }, info) =>
    name
      ? users.filter(
          (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) > -1
        )
      : users,
  posts: (_, { queryString }, { db: { posts } }, info) => {
    if (queryString) {
      return posts.filter(
        (post) =>
          post.title.toLowerCase().includes(queryString.toLowerCase()) ||
          post.body.toLowerCase().includes(queryString.toLowerCase())
      );
    } else {
      return posts;
    }
  },
  comments: (_, args, { db: { comments } }, info) => comments,
};

export default query;
