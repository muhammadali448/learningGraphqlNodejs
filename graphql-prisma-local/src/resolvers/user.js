import { getUserId } from "../utils/getUserId";

const user = {
  // email: async (parent, args, { prisma, auth }, info) => {
  //   const userId = getUserId(auth, false);
  //   if (userId && parent.id === userId) {
  //     return parent.email;
  //   }
  //   return null;
  // },
  posts: {
    fragment: "fragment userId on User { id }",
    resolve: async (parent, args, { prisma }, info) => {
      return prisma.query.posts({
        where: {
          author: {
            id: parent.id,
          },
          isPublished: true,
        },
      });
    },
  },
  email: {
    fragment: "fragment userId on User { id }",
    resolve: async (parent, args, { prisma, auth }, info) => {
      const userId = getUserId(auth, false);
      if (userId && parent.id === userId) {
        return parent.email;
      }
      return null;
    },
  },
};

export default user;
