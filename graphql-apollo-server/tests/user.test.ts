import "core-js/stable";
import "regenerator-runtime/runtime";
import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import { createSeedDatabase, user1 } from "./utils/createSeedDatabase";
import getClient from "./utils/getClient";
import {
  createUser,
  loginUser,
  getProfile,
  getUsers,
} from "./utils/operations/user";
import { async } from "regenerator-runtime/runtime";
const client = getClient();

describe("Users Test Cases", () => {
  beforeEach(createSeedDatabase);
  test("should create a new user", async () => {
    const variables = {
      data: {
        name: "Muhammad Ali",
        email: "ma6627863@gmail.com",
        password: "admin123",
      },
    };
    const response = await client.mutate({
      mutation: createUser,
      variables,
    });
    const isUserExist = await prisma.exists.User({
      id: response.data.createUser.user.id,
    });
    expect(isUserExist).toBeTruthy();
  });
  test("Should not signup a user with email that is already in use ", async () => {
    const variables = {
      data: {
        ...user1.inputFields,
      },
    };
    await expect(
      client.mutate({
        mutation: createUser,
        variables,
      })
    ).rejects.toThrow();
  });
  test("Should login and provide authentication token", async () => {
    const variables = {
      data: {
        email: user1.inputFields.email,
        password: "hello123",
      },
    };
    const response = await client.mutate({
      mutation: loginUser,
      variables,
    });
    expect(response.data.loginUser).toHaveProperty("token");
  });

  test("should not create a new user if password length is less than 8u", async () => {
    const variables = {
      data: {
        name: "ABC NAME",
        email: "abc222@gmail.com",
        password: "admin",
      },
    };
    await expect(
      client.mutate({
        mutation: createUser,
        variables,
      })
    ).rejects.toThrow();
  });

  test("should get users", async () => {
    const response = await client.query({
      query: getUsers,
    });
    expect(response.data.users.length).toBe(2);
    // expect(response.data.users[0].email).toBeNull();
    // expect(response.data.users[0].name).toBe("John Smith");
  });
  test("Should hide emails when fetching list of users ", async () => {
    const response = await client.query({
      query: getUsers,
    });
    response.data.users.forEach((u) => {
      expect(u.email).toBeNull();
    });
  });

  test("should login with bad credentials", async () => {
    const variables = {
      data: { email: "hello222@gmail.com", password: "hello22222" },
    };
    await expect(
      client.mutate({
        mutation: loginUser,
        variables,
      })
    ).rejects.toThrow();
  });
  test("Should return me query when authentication provided", async () => {
    const client = getClient(user1.jwt);
    const { data } = await client.query({ query: getProfile });
    expect(data.me.id).toBe(user1.user.id);
    expect(data.me.name).toBe(user1.user.name);
    expect(data.me.email).toBe(user1.user.email);
  });
  test("Should reject me query without authentication", async () => {
    expect(client.query({ query: getProfile })).rejects.toThrow();
  });
});
