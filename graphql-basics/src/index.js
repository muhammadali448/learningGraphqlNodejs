import { GraphQLServer } from "graphql-yoga";
import db from "./db";
import user from "./resolvers/user";
import comment from "./resolvers/comment";
import post from "./resolvers/post";
import mutation from "./resolvers/mutation";
import query from "./resolvers/query";

const resolvers = {
  Query: query,
  Mutation: mutation,
  Post: post,
  User: user,
  Comment: comment,
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    db,
  },
});
server.start(() => console.log("Server is running"));
