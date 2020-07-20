import { getUserId } from "../utils/getUserId";
const subscription = {
  post: {
    subscribe: (parent, args, { prisma }, info) => {
      return prisma.subscription.post(
        {
          where: {
            node: {
              isPublished: true,
            },
          },
        },
        info
      );
    },
  },
  myPosts: {
    subscribe: (parent, args, { prisma, auth }, info) => {
      const userId = getUserId(auth);
      return prisma.subscription.post(
        {
          where: {
            node: {
              author: {
                id: userId,
              },
            },
          },
        },
        info
      );
    },
  },
  comment: {
    subscribe: (parent, { postId }, { prisma }, info) => {
      return prisma.subscription.comment(
        {
          where: {
            node: {
              post: {
                id: postId,
              },
            },
          },
        },
        info
      );
    },
  },
};

export default subscription;
