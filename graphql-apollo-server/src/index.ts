import { ApolloServer, gql } from 'apollo-server'
import { idArg, queryType, stringArg } from 'nexus'
import { makePrismaSchema, prismaObjectType } from 'nexus-prisma'
import * as path from 'path'
import datamodelInfo from './generated/nexus-prisma'
import { prisma } from './generated/prisma-client'


const Employee = prismaObjectType<"Employee">({
  name: "Employee",
  description: "Employee of a company(Employeer)",
  definition: (t) => {
    t.prismaFields(["email", "id", "name", "status", "createdAt", {
      name: "employeer",
      args: []
    }]);
  }
});

const Employeer = prismaObjectType<"Employeer">({
  name: "Employeer",
  description: "Also know as a company that has many employees",
  definition: (t) => {
    t.prismaFields(["*", {
      name: "employees",
      args: []
    }]);
    t.int("no_employees", {
      description: "No of employees that a employeer have",
      resolve: async ({ id }, { }, { prisma }) => {
        const response = await prisma.employees({
          where: {
            employeer: {
              id
            }
          }
        })
        return response.length
      }
    })
  }
});

const Query = prismaObjectType<"Query">({
  name: "Query",
  // Expose all generated `Todo`-queries
  definition: (t) => t.prismaFields(["*"]),
});

const Mutation = prismaObjectType<"Mutation">({
  name: "Mutation",
  // Expose all generated `Todo`-queries
  definition: (t) => t.prismaFields(["*"]),
});

const schema = makePrismaSchema({
  // Provide all the GraphQL types we've implemented
  types: [Query, Mutation, Employee, Employeer],

  // Configure the interface to Prisma
  prisma: {
    datamodelInfo,
    client: prisma,
  },

  // Specify where Nexus should put the generated files
  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    typegen: path.join(__dirname, './generated/nexus.ts'),
  },

  // Configure nullability of input arguments: All arguments are non-nullable by default
  nonNullDefaults: {
    input: false,
    output: false,
  },

  // Configure automatic type resolution for the TS representations of the associated types
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname, './types.ts'),
        alias: 'types',
      },
    ],
    contextType: 'types.Context',
  },
})

const server = new ApolloServer({
  schema,
  context: { prisma },
})

server.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000`),
)
