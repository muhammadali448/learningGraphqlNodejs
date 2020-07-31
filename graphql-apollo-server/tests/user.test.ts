import { prisma } from "../src/generated/prisma-client";
import { createSeedDatabase, user1 } from "./utils/createSeedDatabase";
import server from "../src/server";
import getClient from "./utils/getClient";
import {
  createUser,
  loginUser,
  getProfile,
  getUsers,
} from "./utils/operations/user";
const client = getClient();

describe("Users Test Cases", () => {
  let serverH: any;
  beforeAll(async (done) => {
    serverH = await server.start({ port: 4000 });
    done()
  })

  afterAll(async (done) => {
    await serverH.close()
    done()
  })
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
    console.log(response.data);
    const isUserExist = await prisma.$exists.user({
      id: response.data.signup.user.id,
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
    expect(response.data.login).toHaveProperty("token");
  });

  test("should not create a new user if password length is less than 8 characters", async () => {
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
    const client = getClient(user1.jwt);
    const response = await client.query({
      query: getUsers,
    });
    expect(response.data.allUsers.length).toBe(2);
  });
  // test("Should hide emails when fetching list of users ", async () => {
  //   const response = await client.query({
  //     query: getUsers,
  //   });
  //   response.data.allUsers.forEach((u: any) => {
  //     expect(u.email).toBeNull();
  //   });
  // });

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
    expect(data.myProfile.id).toBe(user1.user.id);
    expect(data.myProfile.name).toBe(user1.user.name);
    expect(data.myProfile.email).toBe(user1.user.email);
  });
  test("Should reject me query without authentication", async () => {
    expect(client.query({ query: getProfile })).rejects.toThrow();
  });
});
