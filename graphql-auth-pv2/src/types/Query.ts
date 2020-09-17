import { getUserId } from "../utils/getUserId";
import { queryType, stringArg } from "@nexus/schema";
export const Query = queryType({
  definition(t) {
    t.list.field("allUsers", {
      type: "User",
      nullable: false,
      args: {
        searchNameString: stringArg({ nullable: true }),
      },
      resolve: (_parent, { searchNameString }, ctx) => {
        return ctx.prisma.user.findMany({
          where: {
            name: {
              contains: searchNameString,
            },
          },
        });
      },
    });
    t.field("currentUser", {
      type: "User",
      nullable: false,
      resolve: (_parent, _args, ctx) => {
        const userId = getUserId(ctx);
        return ctx.prisma.user.findOne({
          where: {
            id: Number(userId),
          },
        });
      },
    });
  },
});
