import { rule, shield, and } from "graphql-shield";
import { getUserId } from "../utils/getUserId";

const rules = {
    isAuthenticatedUser: rule()((parent, args, ctx) => {
        const userId = getUserId(ctx.request);
        return Boolean(userId)
    }),
    isPostOwner: rule()(async (parent, { id }, ctx) => {
        const userId = getUserId(ctx.request);
        const author = await ctx.prisma.post({ id }).author();
        return userId === author.id
    })
};

export const middlewares = shield({
    Query: {
        myProfile: rules.isAuthenticatedUser,
        allPosts: rules.isAuthenticatedUser,
        allUsers: rules.isAuthenticatedUser,
        postById: rules.isAuthenticatedUser
    },
    Mutation: {
        deletePost: rules.isPostOwner,
        deleteUser: rules.isAuthenticatedUser,
        updatePost: and(rules.isAuthenticatedUser, rules.isPostOwner),
        updateUser: rules.isAuthenticatedUser
    }
});
