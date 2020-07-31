import { rule, shield, and } from "graphql-shield";
import { getUserId } from "../utils/getUserId";

const rules = {
    isAuthenticatedUser: rule()((parent, args, ctx) => {

        const userId = getUserId(ctx);
        return Boolean(userId)
    }),
    isPostOwner: rule()(async (parent, { id }, ctx) => {
        const userId = getUserId(ctx);
        const author = await ctx.prisma.post({ id }).author();
        return userId === author.id
    }),
    isPublishedPost: rule()(async (parent, { postId }, ctx) => {
        const isPostPublished = await ctx.prisma.$exists.post({
            id: postId,
            isPublished: true,
        });
        return isPostPublished === true
    }),
    isCommentOwner: rule()(async (parent, { id }, ctx) => {
        const userId = getUserId(ctx);
        const author = await ctx.prisma.comment({
            id
        }).author();
        console.log(author.id === userId);
        return userId == author.id;
    })
};

export const middlewares = shield({
    Query: {
        myProfile: rules.isAuthenticatedUser,
        allPosts: rules.isAuthenticatedUser,
        allUsers: rules.isAuthenticatedUser,
        allComments: rules.isAuthenticatedUser
    },
    Mutation: {
        createPost: rules.isAuthenticatedUser,
        deletePost: and(rules.isAuthenticatedUser, rules.isPostOwner),
        deleteUser: rules.isAuthenticatedUser,
        updatePost: and(rules.isAuthenticatedUser, rules.isPostOwner),
        updateUser: rules.isAuthenticatedUser,
        createComment: and(rules.isAuthenticatedUser, rules.isPublishedPost),
        deleteComment: and(rules.isAuthenticatedUser, rules.isCommentOwner),
        updateComment: and(rules.isAuthenticatedUser, rules.isCommentOwner)
    },
});
