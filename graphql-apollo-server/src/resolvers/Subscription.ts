import { subscriptionField, extendType, idArg } from "nexus";
import { prismaObjectType } from "nexus-prisma";
import { getUserId } from "../utils/getUserId";

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
    subscribe: async (parent, { id }, ctx) => {

        const userId = getUserId(ctx);
        if (!userId) {
            throw new Error("Not Authenticated");
        }
        return ctx.prisma.$subscribe.comment({
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
    subscribe: async (parent, args, ctx) => {
        return ctx.prisma.$subscribe.post({
            node: {
                isPublished: true
            },
        })
    },
    resolve: payload => payload
})