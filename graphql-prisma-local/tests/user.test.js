import "core-js/stable";
import "regenerator-runtime/runtime";
import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import prisma from "../src/prisma";
import { createSeedDatabase, user1 } from "./utils/createSeedDatabase";
import getClient from "./utils/getClient";
const client = getClient();

describe("Users Test Cases", () => {
  beforeEach(createSeedDatabase);
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

  test("should not create a new user if password length is less than 8u", async () => {
    const createUser = gql`
      mutation {
        createUser(
          data: {
            name: "ABC NAME"
            email: "abc222@gmail.com"
            password: "admin"
          }
        ) {
          token
        }
      }
    `;
    await expect(
      client.mutate({
        mutation: createUser,
      })
    ).rejects.toThrow();
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

  test("should login with bad credentials", async () => {
    const loginUser = gql`
      mutation {
        loginUser(
          data: { email: "hello222@gmail.com", password: "hello22222" }
        ) {
          token
        }
      }
    `;
    await expect(
      client.mutate({
        mutation: loginUser,
      })
    ).rejects.toThrow();
  });
  test("should return user profile", async () => {
    const client = getClient(user1.jwt);
    const getProfile = gql`
      query {
        me {
          id
          name
          email
        }
      }
    `;
    const { data } = await client.query({ query: getProfile });
    expect(data.me.id).toBe(user1.user.id);
    expect(data.me.name).toBe(user1.user.name);
    expect(data.me.email).toBe(user1.user.email);
  });
});
