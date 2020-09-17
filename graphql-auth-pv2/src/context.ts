import { PrismaClient } from "@prisma/client";
import { ContextParameters } from "graphql-yoga/dist/types";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  request: {
    request: {
      headers: {
        authorization: string;
      };
    };
    connection: {
      context: {
        Authorization: string;
      };
    };
  };
}

export function createContext(request: ContextParameters) {
  return {
    request,
    prisma,
  };
}
