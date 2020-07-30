import "core-js/stable";
import "regenerator-runtime/runtime";
import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import {
  createSeedDatabase,
  user1,
  user2,
  post1,
  post2,
} from "./utils/createSeedDatabase";
import getClient from "./utils/getClient";
import {
  getPosts,
  getMyPosts,
  updatePost,
  createPost,
  deletePost,
  subscriptionPosts,
  fetchPublishedPostById,
} from "./utils/operations/post";
import { async } from "regenerator-runtime/runtime";
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
  test("Should fetch published post by id", async () => {
    const variables = {
      id: post1.post.id,
    };
    const { data } = await client.query({
      query: fetchPublishedPostById,
      variables,
    });
    expect(data.post.isPublished).toBeTruthy();
  });
  test("Should fetch own post by id", async () => {
    const client = getClient(user2.jwt);
    const variables = {
      id: post2.post.id,
    };
    const { data } = await client.query({
      query: fetchPublishedPostById,
      variables,
    });
    expect(data.post.isPublished).toBeFalsy();
  });
  test("Should not fetch draft post from other user", async () => {
    const client = getClient(user1.jwt);
    const variables = {
      id: post2.post.id,
    };
    expect(
      client.query({
        query: fetchPublishedPostById,
        variables,
      })
    ).rejects.toThrow();
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
  test("Should require authentication to update a post", () => {
    const title = "change hogya";
    const variables = {
      data: { title },
      id: post1.post.id,
    };
    expect(
      client.mutate({ mutation: updatePost, variables })
    ).rejects.toThrow();
  });
  test("Should not be able to update another users post", async () => {
    const client = getClient(user1.jwt);
    const title = "change hogya";
    const variables = {
      data: { title },
      id: post2.post.id,
    };
    expect(
      client.mutate({ mutation: updatePost, variables })
    ).rejects.toThrow();
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
  });
  test("Should require authentication to create a post", () => {
    let title = "new post";
    let body = "";
    let isPublished = true;
    const variables = {
      data: { title, body, isPublished },
    };
    expect(
      client.mutate({ mutation: createPost, variables })
    ).rejects.toThrow();
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
  test("Should require authentication to delete a post", () => {
    const variables = {
      id: post1.post.id,
    };
    expect(
      client.mutate({ mutation: deletePost, variables })
    ).rejects.toThrow();
  });
  test("Should not be able to delete another users post", async () => {
    const client = getClient(user1.jwt);
    const variables = {
      id: post2.post.id,
    };
    expect(
      client.mutate({ mutation: deletePost, variables })
    ).rejects.toThrow();
  });
  test("should subscribe a post", (done) => {
    const client = getClient(user1.jwt);
    const sub = client.subscribe({ query: subscriptionPosts }).subscribe({
      next(response) {
        try {
          expect(response.data.post.mutation).toBe("DELETED");
          sub.unsubscribe();
          done();
        } catch (err) {
          done(err);
        }
      },
    });
    setTimeout(async () => {
      await prisma.mutation.deletePost({
        where: { id: post1.post.id },
      });
    }, 1000);
  });
});
