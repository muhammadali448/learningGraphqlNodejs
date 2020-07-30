import { subscriptionField, extendType, idArg } from "nexus";
import { prismaObjectType } from "nexus-prisma";

export const postsSubscriptionPayload = prismaObjectType<"PostSubscriptionPayload">({
    name: "PostSubscriptionPayload",
    definition(t) {
        t.field("node", {
            type: "Post",
        })
        t.field("mutation", {
            type: "MutationType",
            nullable: false
        })
    }
});

export const commentsSubscriptionPayload = prismaObjectType<"CommentSubscriptionPayload">({
    name: "CommentSubscriptionPayload",
    definition(t) {
        t.field("node", {
            type: "Comment",
        })
        t.field("mutation", {
            type: "MutationType",
            nullable: false
        })
    }
})

export const commentsSubscription = subscriptionField("comments", {
    type: "CommentSubscriptionPayload",
    nullable: false,
    description: "Listen when a comment is created, deleted or updated for a particular post",
    args: {
        id: idArg({ nullable: false })
    },
    subscribe: async (parent, { id }, { prisma }) => {
        return prisma.$subscribe.comment({
            node: {
                post: {
                    id
                }
            }
        })
    },
    resolve: payload => payload
})

export const postsSubscription = subscriptionField("posts", {
    type: "PostSubscriptionPayload",
    nullable: false,
    description: "Listen when a post is created, deleted or updated",
    subscribe: async (parent, args, { prisma }) => {
        return prisma.$subscribe.post({
            node: {
                isPublished: true
            },
        })
    },
    resolve: payload => payload
})