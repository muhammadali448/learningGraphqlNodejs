import { Query } from './Query'
import { User } from './User'
import { Mutation } from './Mutation'
import { createPostInput, updatePostInput, Post } from "./Post";
import { createCommentInput, updateCommentInput, Comment, CommentOrderByInput } from "./Comment";
import { AuthPayload, signupInput, loginInput, updateUserInput } from "./Auth";
import { postsSubscription, postsSubscriptionPayload, commentsSubscriptionPayload, commentsSubscription } from "./Subscription";
export const resolvers = {
  Query,
  Mutation,
  User,
  Post,
  Comment,
  CommentOrderByInput,
  postsSubscription,
  postsSubscriptionPayload,
  commentsSubscription,
  commentsSubscriptionPayload,
  AuthPayload,
  signupInput,
  loginInput,
  createPostInput,
  updatePostInput,
  updateUserInput,
  createCommentInput,
  updateCommentInput
}