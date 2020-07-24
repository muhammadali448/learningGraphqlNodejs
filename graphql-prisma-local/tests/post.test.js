import "core-js/stable";
import "regenerator-runtime/runtime";
import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import prisma from "../src/prisma";
import { createSeedDatabase, user1, post1 } from "./utils/createSeedDatabase";
import getClient from "./utils/getClient";
const client = getClient();

describe("Post Test Cases", () => {
  beforeEach(createSeedDatabase);
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
  test("should return myPosts", async () => {
    const client = getClient(user1.jwt);
    const getMyPosts = gql`
      query {
        myPosts {
          id
          title
          body
          isPublished
        }
      }
    `;
    const { data } = await client.query({ query: getMyPosts });
    expect(data.myPosts).toHaveLength(2);
  });
  test("should update post title", async () => {
    const client = getClient(user1.jwt);
    const title = "change hogya";
    const updatePost = gql`
      mutation {
        updatePost(
          id: "${post1.post.id}"
          data: { title: "${title}" }
        ) {
          title
        }
      }
    `;
    const { data } = await client.mutate({ mutation: updatePost });
    expect(data.updatePost.title).toBe(title);
  });
  test("should update isPublished to false title", async () => {
    const client = getClient(user1.jwt);
    const updatePost = gql`
      mutation {
        updatePost(
          id: "${post1.post.id}"
          data: { isPublished: false }
        ) {
            isPublished
        }
      }
    `;
    const { data } = await client.mutate({ mutation: updatePost });
    const isPostExist = await prisma.exists.Post({
      id: post1.post.id,
      isPublished: false,
    });
    expect(data.updatePost.isPublished).toBeFalsy();
    expect(isPostExist).toBeTruthy();
  });
  test("should update isPublished to false title", async () => {
    const client = getClient(user1.jwt);

    let title = "new post";
    let body = "";
    let isPublished = true;
    const createPost = gql`
      mutation {
        createPost(data: { title: "${title}", body: "${body}", isPublished: ${isPublished} }) {
          id
          title
          body
          isPublished
        }
      }
    `;
    const { data } = await client.mutate({ mutation: createPost });
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
    const createPost = gql`
      mutation {
        deletePost(id: "${post1.post.id}") {
          id
        }
      }
    `;
    await client.mutate({ mutation: createPost });
    const isPostExist = await prisma.exists.Post({
      id: post1.post.id,
    });
    expect(isPostExist).toBeFalsy();
  });
});
