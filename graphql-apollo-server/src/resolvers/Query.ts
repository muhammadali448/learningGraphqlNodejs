import { getUserId } from "../utils/getUserId";
import { queryType, stringArg, idArg, intArg, arg, enumType } from "nexus";
import { type } from "os";
import { prismaEnumType } from "nexus-prisma";
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
            },
        })
        t.field("myProfile", {
            type: "User",
            nullable: false,
            resolve: (parent, args, ctx) => {
                const userId = getUserId(ctx.request);
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
        t.list.field("myPosts", {
            type: "Post",
            nullable: false,
            args: {
                searchString: stringArg({ nullable: true }),
            },
            resolve: (parent, { searchString }, ctx) => {
                const userId = getUserId(ctx.request);
                return ctx.prisma.posts({
                    where: {
                        author: {
                            id: userId
                        },
                        OR: [
                            { title_contains: searchString },
                            { content_contains: searchString },
                        ],
                    },
                })
            },
        }),
            t.list.field("allComments", {
                type: "Comment",
                nullable: false,
                args: {
                    orderBy: arg({ type: "CommentOrderByInput" })
                },
                resolve: async (parent, { orderBy }, ctx) => {
                    const allComments = await ctx.prisma.comments(
                        {
                            orderBy
                        }
                    );
                    return allComments;
                }
            })
        t.field("postById", {
            type: "Post",
            args: {
                id: idArg({ nullable: false })
            },
            nullable: false,
            resolve: async (parent, { id }, ctx) => {
                const userId = getUserId(ctx.request, false);
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
                if (posts.length === 0) {
                    throw new Error("Post not found");
                }
                return posts[0];
            }
        })
    }
});