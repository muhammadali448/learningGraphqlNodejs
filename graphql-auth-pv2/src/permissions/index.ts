import { rule, shield } from "graphql-shield";
import { getUserId } from "../utils/getUserId";
import { Context } from "../context";

const rules = {
  isAuthenticatedUser: rule()((parent, args, ctx: Context) => {
    const userId = getUserId(ctx);
    return Boolean(userId);
  }),
  isAdmin: rule()(async (_parent, _args, ctx: Context) => {
    const userId = getUserId(ctx);
    const user = await ctx.prisma.user.findOne({
      where: {
        id: Number(userId),
      },
    });
    return user && user.isAdmin == true;
  }),
};
export const permissions = shield(
  {
    Query: {
      currentUser: rules.isAuthenticatedUser,
      allUsers: rules.isAdmin,
    },
    Mutation: {
      deleteUsers: rules.isAdmin,
    },
  },
  {
    allowExternalErrors: true,
  }
);
