import { idArg, mutationType, arg } from 'nexus'
import generateHashPassword from '../utils/generateHashPassword';
import generateToken from '../utils/generateToken';
import { compare } from "bcrypt";
import { getUserId } from '../utils/getUserId';
import { prisma } from '../generated/prisma-client';

export const Mutation = mutationType({
    definition(t) {
        t.field("signup", {
            type: "AuthPayload",
            nullable: false,
            args: {
                signupInput: arg({ type: "signupInput", required: true })
            },
            resolve: async (parent, { signupInput: { name, email, password } }, ctx) => {
                const isUserExist = await ctx.prisma.$exists.user({ email });
                if (isUserExist) {
                    throw new Error("Email is already associated with another user");
                }
                const hashPassword = await generateHashPassword(password);
                const newUser = await ctx.prisma.createUser({
                    name,
                    email,
                    password: hashPassword
                });
                return {
                    user: newUser,
                    token: generateToken(newUser.id)
                };
            }
        })
        t.field("deleteUser", {
            type: "User",
            nullable: false,
            args: {
                id: idArg({ nullable: false })
            },
            resolve: async (parent, { id }, ctx) => {
                const userId = getUserId(ctx);
                const deletedUser = await ctx.prisma.deleteUser(
                    {
                        id: userId,
                    },
                );
                return deletedUser;
            }
        });
        t.field("updateUser", {
            type: "User",
            nullable: false,
            args: {
                updateUserInput: arg({ type: "updateUserInput", nullable: false })
            },
            resolve: async (parent, { updateUserInput: { name, email, password } }, ctx) => {
                const userId = getUserId(ctx);
                if (typeof password === "string") {
                    const hashedPassword = await generateHashPassword(password);
                    password = hashedPassword;
                }
                const updateUser = await ctx.prisma.updateUser(
                    {
                        where: {
                            id: userId,
                        },
                        data: {
                            name,
                            email,
                            password
                        },
                    },
                );
                return updateUser;
            }
        })
        t.field("login", {
            type: "AuthPayload",
            nullable: false,
            args: {
                loginInput: arg({ type: "loginInput", required: true })
            },
            resolve: async (parent, { loginInput: { email, password } }, ctx) => {
                const user = await ctx.prisma.user({
                    email
                });
                if (!user) {
                    throw new Error("User not exist");
                }
                const isPasswordMatch = await compare(password, user.password);
                if (!isPasswordMatch) {
                    throw new Error("Password not correct");
                }
                return {
                    user,
                    token: generateToken(user.id),
                };
            }
        })
        t.field("createPost", {
            type: "Post",
            nullable: false,
            args: {
                createPostInput: arg({ type: "createPostInput", required: true })
            },
            resolve: async (parent, { createPostInput: { title, content } }, ctx) => {
                const userId = getUserId(ctx);
                const newPost = await ctx.prisma.createPost({
                    title,
                    content,
                    author: {
                        connect: {
                            id: userId,
                        },
                    },
                });
                return newPost;
            }
        })
        t.field("deletePost", {
            type: "Post",
            nullable: false,
            args: {
                id: idArg({ nullable: false })
            },
            resolve: async (parent, { id }, ctx) => {
                const deletedPost = await ctx.prisma.deletePost({
                    id
                });
                return deletedPost;
            }
        })
        t.field("updatePost", {
            type: "Post",
            nullable: false,
            args: {
                id: idArg({ nullable: false }),
                updatePostInput: arg({ type: "updatePostInput", nullable: false })
            },
            resolve: async (parent, { id, updatePostInput: { title, content, isPublished } }, ctx) => {
                const isPostPublished = await ctx.prisma.$exists.post({
                    id,
                    isPublished: true
                });
                if (
                    isPostPublished &&
                    typeof isPublished !== "undefined" &&
                    !isPublished
                ) {
                    await ctx.prisma.deleteManyComments({
                        post: {
                            id,
                        },
                    });
                }
                const updatedPost = await ctx.prisma.updatePost({
                    data: {
                        title,
                        content,
                        isPublished
                    },
                    where: {
                        id
                    }
                });
                return updatedPost;
            }
        })
        t.field("createComment", {
            type: "Comment",
            nullable: false,
            args: {
                postId: idArg({ nullable: false, }),
                createCommentInput: arg({ type: "createCommentInput", nullable: false })
            },
            resolve: async (parent, { createCommentInput: { text }, postId }, ctx) => {
                const userId = getUserId(ctx);
                const newComment = await ctx.prisma.createComment(
                    {
                        text,
                        author: {
                            connect: {
                                id: userId,
                            },
                        },
                        post: {
                            connect: {
                                id: postId,
                            },
                        }
                    },
                );
                return newComment;
            }
        })
        t.field("deleteComment", {
            type: "Comment",
            nullable: false,
            args: {
                id: idArg({ nullable: false })
            },
            resolve: async (parent, { id }, ctx) => {
                const userId = getUserId(ctx);
                const deletedComment = await ctx.prisma.deleteComment(
                    {
                        id
                    }
                );
                return deletedComment;
            }
        })
        t.field("updateComment", {
            type: "Comment",
            nullable: false,
            args: {
                id: idArg({ nullable: false }),
                updateCommentInput: arg({ type: "updateCommentInput", nullable: false })
            },
            resolve: async (parent, { id, updateCommentInput: { text } }, ctx) => {
                // const userId = getUserId(ctx);
                // const author = await ctx.prisma.comment({
                //     id
                // }).author();
                const updatedComment = await ctx.prisma.updateComment(
                    {
                        where: {
                            id
                        },
                        data: {
                            text
                        }
                    },
                );
                return updatedComment;
            }
        })
    }
});