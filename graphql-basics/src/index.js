import { GraphQLServer } from "graphql-yoga";
import { v4 } from "uuid";
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
    id: "post_1_abc",
    title: "wow hahaha",
    body: "This is multiple limited to gtx1080",
    isPublished: true,
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

const comments = [
  {
    id: "comment-abc-1",
    text: "nice post 1",
    author: "abc111",
    post: "post_1abc",
  },
  {
    id: "comment-abc-2",
    text: "nice post 2",
    author: "abc111",
    post: "post_1abc",
  },
  {
    id: "comment-abc-3",
    text: "nice post 3",
    author: "abc222",
    post: "post_2abc",
  },
  {
    id: "comment-abc-4",
    text: "nice post 4",
    author: "abc333",
    post: "post_3abc",
  },
];

const typeDefs = `
  type Query {
    users(name: String): [User!]!  
    me: User!
    posts(queryString: String): [Post!]!
    comments: [Comment!]!
  }
  type Mutation {
    createUser(data: createUserInput!): User!
    createPost(data: createPostInput!): Post!
    createComment(data: createCommentInput!): Comment!
  }

  input createUserInput {
    name: String!
    email: String! 
    age: Int
  }

  input createPostInput {
    title: String!
    body: String!
    isPublished: Boolean 
    author: ID!
  }

  input createCommentInput {
    text: String!
    author: ID!
    post: ID!
  }

  type User {
      id: ID!
      name: String!
      email: String!
      age: Int
      posts: [Post!]!
      comments: [Comment!]!
  }
  type Post {
      id: ID!
      title: String!
      body: String!
      isPublished: Boolean!
      author: User!
      comments: [Comment!]!
  }
  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    comments: () => comments,
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
  Mutation: {
    createUser: (parent, { data: { email, name, age } }, ctx, info) => {
      // console.log(args);
      const isEmailTaken = users.some((user) => user.email === email);
      if (isEmailTaken) {
        throw new Error("Email already taken");
      }
      const user = {
        id: v4(),
        name,
        email,
        age,
      };
      users.push(user);
      return user;
    },
    createPost: (
      parent,
      { data: { title, body, isPublished, author } },
      ctx,
      info
    ) => {
      const isUserExist = users.some((user) => user.id === author);
      if (!isUserExist) {
        throw new Error("User not exist");
      }
      const post = {
        id: v4(),
        title,
        body,
        isPublished,
        author: author,
      };
      posts.push(post);
      return post;
    },
    createComment: (parent, { data: { author, post, text } }, ctx, info) => {
      console.log(post);
      const isUserExist = users.some((user) => user.id === author);
      const postFound = posts.some((p) => p.id === post && p.isPublished);
      posts.map((ps) =>
        console.log(ps.id + " : " + post + " : " + ps.isPublished)
      );
      if (!isUserExist || !postFound) {
        throw new Error("Error in creating a comment");
      }
      const comment = {
        id: v4(),
        author,
        post,
        text,
      };
      comments.push(comment);
      return comment;
    },
  },
  Post: {
    author: (parent, arg, ctx, info) =>
      users.find((f) => f.id === parent.author),
    comments: (parent, args, ctx, info) =>
      comments.filter((comment) => comment.post === parent.id),
  },
  User: {
    posts: (parent, args, ctx, info) =>
      posts.filter((post) => post.author === parent.id),
    comments: (parent, args, ctx, info) =>
      comments.filter((comment) => comment.author === parent.id),
  },
  Comment: {
    author: (parent, args, ctx, info) =>
      users.find((f) => f.id === parent.author),
    post: (parent, args, ctx, info) => posts.find((f) => f.id === parent.post),
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => console.log("Server is running"));
