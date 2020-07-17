const query = {
  users: (_, { name }, { prisma }, info) => {
    // name
    //   ? users.filter(
    //       (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) > -1
    //     )
    //   : users
    const optArgs = {};
    if (name) {
      optArgs.where = {
        OR: [{ name_contains: name }, { email_contains: name }],
        // name_contains: name,
      };
    }
    return prisma.query.users(optArgs, info);
  },
  posts: (_, { queryString }, { prisma }, info) => {
    // if (queryString) {
    //   return posts.filter(
    //     (post) =>
    //       post.title.toLowerCase().includes(queryString.toLowerCase()) ||
    //       post.body.toLowerCase().includes(queryString.toLowerCase())
    //   );
    // } else {
    //   return posts;
    // }
    return prisma.query.posts(null, info);
  },
  comments: (_, args, { db: { comments } }, info) => comments,
};

export default query;
