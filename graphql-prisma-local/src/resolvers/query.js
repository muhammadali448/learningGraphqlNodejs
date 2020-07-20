import { getUserId } from "../utils/getUserId";

const query = {
  users: (_, { name }, { prisma }, info) => {
    const optArgs = {};
    if (name) {
      optArgs.where = {
        name_contains: name,
        // name_contains: name,
      };
    }
    return prisma.query.users(optArgs, info);
  },
  myPosts: (_, { queryString }, { prisma, auth }, info) => {
    const userId = getUserId(auth);
    const objArgs = {
      where: {
        author: {
          id: userId,
        },
      },
    };
    if (queryString) {
      objArgs.where = {
        ...objArgs.where,
        OR: [{ title_contains: queryString }, { body_contains: queryString }],
      };
    }
    return prisma.query.posts(objArgs, info);
  },
  posts: (_, { queryString }, { prisma }, info) => {
    const objArgs = {
      where: {
        isPublished: true,
      },
    };
    if (queryString) {
      objArgs.where = {
        ...objArgs.where,
        OR: [{ title_contains: queryString }, { body_contains: queryString }],
      };
    }
    return prisma.query.posts(objArgs, info);
  },
  comments: (_, args, { prisma }, info) => prisma.query.comments(null, info),
  me: async (_, args, { auth, prisma }, info) => {
    const userId = getUserId(auth);
    return prisma.query.user(
      {
        where: {
          id: userId,
        },
      },
      info
    );
  },
  post: async (_, { id }, { prisma, auth }, info) => {
    const userId = getUserId(auth, false);
    const posts = await prisma.query.posts(
      {
        where: {
          id,
          OR: [
            { isPublished: true },
            {
              author: {
                id: userId,
              },
            },
          ],
        },
      },
      info
    );
    if (posts.length === 0) {
      throw new Error("Post not found");
    }
    return posts[0];
  },
};

export default query;
