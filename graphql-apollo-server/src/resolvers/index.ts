import { Query } from './Query'
import { User } from './User'
import { Mutation } from './Mutation'
import { createPostInput, updatePostInput, Post } from "./Post";
import { AuthPayload, signupInput, loginInput, updateUserInput } from "./Auth";
export const resolvers = {
  Query,
  Mutation,
  User,
  Post,
  AuthPayload,
  signupInput,
  loginInput,
  createPostInput,
  updatePostInput,
  updateUserInput
}