import "core-js/stable";
import "regenerator-runtime/runtime";
import "cross-fetch/polyfill";
import ApolloClient, { gql } from "apollo-boost";
import prisma from "../src/prisma";
import bcrypt from "bcryptjs";
const client = new ApolloClient({
  uri: "http://localhost:4000",
});

beforeEach(async () => {
  await prisma.mutation.deleteManyUsers();
  await prisma.mutation.deleteManyPosts();
  const user = await prisma.mutation.createUser({
    data: {
      name: "John Smith",
      email: "john_smith222@gmail.com",
      password: bcrypt.hashSync("hello123"),
    },
  });
  await prisma.mutation.createPost({
    data: {
      title: "test title",
      body: "test body",
      isPublished: true,
      author: {
        connect: {
          id: user.id,
        },
      },
    },
  });
  await prisma.mutation.createPost({
    data: {
      title: "test title",
      body: "",
      isPublished: false,
      author: {
        connect: {
          id: user.id,
        },
      },
    },
  });
});
test("should create a new user", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "Muhammad Ali"
          email: "ma6627863@gmail.com"
          password: "admin123"
        }
      ) {
        user {
          id
          name
        }
        token
      }
    }
  `;
  const response = await client.mutate({
    mutation: createUser,
  });
  const isUserExist = await prisma.exists.User({
    id: response.data.createUser.user.id,
  });
  expect(isUserExist).toBeTruthy();
});

test("should get users profile", async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `;
  const response = await client.query({
    query: getUsers,
  });
  expect(response.data.users.length).toBe(1);
  expect(response.data.users[0].email).toBeNull();
  expect(response.data.users[0].name).toBe("John Smith");
});

test("should return published posts", async () => {
  const getPosts = gql`
    query {
      posts {
        id
        title
        body
        isPublished
      }
    }
  `;
  const response = await client.query({
    query: getPosts,
  });
  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].isPublished).toBeTruthy();
});
