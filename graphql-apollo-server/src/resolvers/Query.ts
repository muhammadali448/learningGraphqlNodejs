import { getUserId } from "../utils/getUserId";
import { queryType, stringArg, idArg } from "nexus";

export const Query = queryType({
    definition(t) {
        t.list.field("allUsers", {
            type: "User",
            nullable: false,
            args: {
                searchNameString: stringArg({ nullable: true })
            },
            resolve: (parent, { searchNameString }, ctx) => {
                return ctx.prisma.users({
                    where: {
                        name_contains: searchNameString
                    }
                });
            }
        })
        t.field("myProfile", {
            type: "User",
            nullable: false,
            resolve: (parent, args, ctx) => {
                const userId = getUserId(ctx);
                return ctx.prisma.user({ id: userId });
            }
        })
        t.list.field("allPosts", {
            type: "Post",
            nullable: false,
            args: {
                searchString: stringArg({ nullable: true }),
            },
            resolve: (parent, { searchString }, ctx) => {
                return ctx.prisma.posts({
                    where: {
                        isPublished: true,
                        OR: [
                            { title_contains: searchString },
                            { content_contains: searchString },
                        ],
                    },
                })
            },
        })
        t.field("postById", {
            type: "Post",
            args: {
                id: idArg({ required: true })
            },
            nullable: false,
            resolve: async (parent, { id }, ctx) => {
                const userId = getUserId(ctx);
                const posts = await ctx.prisma.posts({
                    where: {
                        id,
                        OR: [
                            { isPublished: true },
                            {
                                author: {
                                    id: userId
                                }
                            }
                        ]
                    }
                });
                return posts[0];
            }
        })
    }
});