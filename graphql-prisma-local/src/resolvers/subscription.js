import { v4 } from "uuid";
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
