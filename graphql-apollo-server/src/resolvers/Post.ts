import { prismaObjectType } from 'nexus-prisma'
import { inputObjectType } from "nexus";
export const createPostInput = inputObjectType({
    name: "createPostInput",
    definition(t) {
        t.string("title", { nullable: false });
        t.string("content", { nullable: false });
    },
});

export const updatePostInput = inputObjectType({
    name: "updatePostInput",
    definition(t) {
        t.string("title");
        t.string("content");
        t.boolean("isPublished");
    },
});

export const Post = prismaObjectType<"Post">({
    name: 'Post',
    definition(t) {
        t.prismaFields([
            "id",
            "title",
            "createdAt",
            "content",
            "author",
            "isPublished",
            {
                name: "comments",
                args: [],
            }
        ])
    },
})