import { extractFragmentReplacements } from "prisma-binding";
import user from "./user";
import comment from "./comment";
import post from "./post";
import mutation from "./mutation";
import query from "./query";
import subscription from "./subscription";

const resolvers = {
  Query: query,
  Mutation: mutation,
  Subscription: subscription,
  Post: post,
  User: user,
  Comment: comment,
};

const fragmentReplacements = extractFragmentReplacements(resolvers);
export { resolvers, fragmentReplacements };
