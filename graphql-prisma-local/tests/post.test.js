import "core-js/stable";
import "regenerator-runtime/runtime";
import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import { createSeedDatabase, user1, post1 } from "./utils/createSeedDatabase";
import getClient from "./utils/getClient";
import {
  getPosts,
  getMyPosts,
  updatePost,
  createPost,
  deletePost,
} from "./utils/operations/post";
const client = getClient();

describe("Post Test Cases", () => {
  beforeEach(createSeedDatabase);
  test("should return published posts", async () => {
    const response = await client.query({
      query: getPosts,
    });
    expect(response.data.posts.length).toBe(1);
    expect(response.data.posts[0].isPublished).toBeTruthy();
  });
  test("should return myPosts", async () => {
    const client = getClient(user1.jwt);
    const { data } = await client.query({ query: getMyPosts });
    expect(data.myPosts).toHaveLength(2);
  });
  test("should update post title", async () => {
    const client = getClient(user1.jwt);
    const title = "change hogya";
    const variables = {
      data: { title },
      id: post1.post.id,
    };
    const { data } = await client.mutate({ mutation: updatePost, variables });
    expect(data.updatePost.title).toBe(title);
  });
  test("should update isPublished to false title", async () => {
    const client = getClient(user1.jwt);
    const variables = {
      data: { isPublished: false },
      id: post1.post.id,
    };
    const { data } = await client.mutate({ mutation: updatePost, variables });
    const isPostExist = await prisma.exists.Post({
      id: post1.post.id,
      isPublished: false,
    });
    expect(data.updatePost.isPublished).toBeFalsy();
    expect(isPostExist).toBeTruthy();
  });
  test("should create a post", async () => {
    const client = getClient(user1.jwt);

    let title = "new post";
    let body = "";
    let isPublished = true;
    const variables = {
      data: { title, body, isPublished },
    };
    const { data } = await client.mutate({ mutation: createPost, variables });
    expect(data.createPost.title).toBe(title);
    expect(data.createPost.body).toBe(body);
    expect(data.createPost.isPublished).toBe(isPublished);
    // const isPostExist = await prisma.exists.Post({
    //   id: data.createPost.id,
    // });
    // expect(isPostExist).toBeTruthy();
  });
  test("should delete post", async () => {
    const client = getClient(user1.jwt);
    const variables = {
      id: post1.post.id,
    };
    await client.mutate({ mutation: deletePost, variables });
    const isPostExist = await prisma.exists.Post({
      id: post1.post.id,
    });
    expect(isPostExist).toBeFalsy();
  });
});
