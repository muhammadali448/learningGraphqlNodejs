import { prismaObjectType, prismaEnumType } from 'nexus-prisma'
import { inputObjectType } from "nexus";

export const Comment = prismaObjectType<"Comment">({
    name: 'Comment',
    definition(t) {
        t.prismaFields([
            "*"
        ])
    },
})

export const CommentOrderByInput = prismaEnumType<"CommentOrderByInput">({
    name: "CommentOrderByInput",
    members: ["createdAt_ASC", "createdAt_DESC", "text_ASC", "text_DESC"]
})

export const createCommentInput = inputObjectType({
    name: "createCommentInput",
    definition(t) {
        t.string("text", { nullable: false });
    },
});

export const updateCommentInput = inputObjectType({
    name: "updateCommentInput",
    definition(t) {
        t.string("text",)
    }
})