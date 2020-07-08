import { GraphQLServer } from "graphql-yoga";

// const typeDefs = `
//   type Query {
//     hello(name: String): String!
//     bye: String!
//     location: String!
//     bio: String!
//   }
// `;

// const typeDefs = `
//   type Query {
//     id: ID!
//     name: String!
//     age: Int!
//     isEmployeed: Boolean!
//     gpa: Float
//   }
// `;

// add(numbers: [Float!]!): Float!
// grades: [Int!]!
const users = [
  {
    id: "abc111",
    name: "Muhammad Ali",
    email: "ma6627863@gmail.com",
  },
  {
    id: "abc222",
    name: "Yasir Abbas",
    email: "yasir222@gmail.com",
  },
  {
    id: "abc333",
    name: "Sufyan Khan",
    email: "sufyankhan@gmail.com",
  },
];

const posts = [
  {
    id: "post_1abc",
    title: "wow",
    body: "This is limited to gtx1080",
    isPublished: false,
    author: "abc111",
  },
  {
    id: "post_2abc",
    title: "2 Overclocking is serious",
    body: "hello",
    isPublished: true,
    author: "abc222",
  },
  {
    id: "post_3abc",
    title: "3 Overclocking is serious",
    body: "3 This is limited to gtx1080",
    isPublished: false,
    author: "abc333",
  },
];
const typeDefs = `
  type Query {
    users(name: String): [User!]!  
    me: User!
    posts(queryString: String): [Post!]!
  }
  type User {
      id: ID!
      name: String!
      email: String!
      age: Int
  }
  type Post {
      id: ID!
      title: String!
      body: String!
      isPublished: Boolean!
      author: User!
  }
`;
const resolvers = {
  Query: {
    // add: (_, { numbers }) =>
    //   numbers.length === 0 ? 0 : numbers.reduce((total, num) => total + num),
    // grades: () => [1, 2, 3, 4, 5].filter((no) => no % 2 === 0),

    users: (_, { name }) =>
      name
        ? users.filter(
            (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) > -1
          )
        : users,
    me: () => ({
      id: "abc123",
      name: "Muhammad Ali",
      email: "ma6627863@gmail.com",
    }),
    posts: (_, { queryString }) => {
      if (queryString) {
        return posts.filter(
          (post) =>
            post.title.toLowerCase().includes(queryString.toLowerCase()) ||
            post.body.toLowerCase().includes(queryString.toLowerCase())
        );
      } else {
        return posts;
      }
    },
    // id: () => "abcd1234",
    // name: () => "Muhammad Ali",
    // age: () => 24,
    // isEmployeed: () => false,
    // gpa: () => null,
    // hello: (_, { name }) => `Hello, from Pakistan ${name}`,
    // bye: () => "We have so much fun!!!",
    // location: () => "Karachi, Pakistan",
    // bio: () => "I am Engineer",
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is running"));
