import { GraphQLServer, PubSub } from "graphql-yoga";
import db from "./db";
import user from "./resolvers/user";
import comment from "./resolvers/comment";
import post from "./resolvers/post";
import mutation from "./resolvers/mutation";
import query from "./resolvers/query";
import subscription from "./resolvers/subscription";

const resolvers = {
  Query: query,
  Mutation: mutation,
  Subscription: subscription,
  Post: post,
  User: user,
  Comment: comment,
};

const pubsub = new PubSub();
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    db,
    pubsub,
  },
});
server.start(() => console.log("Server is running"));
