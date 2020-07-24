import "core-js/stable";
import "regenerator-runtime/runtime";
import "cross-fetch/polyfill";
import prisma from "../src/prisma";
import {
  createSeedDatabase,
  user1,
  user2,
  comment1,
  comment2,
} from "./utils/createSeedDatabase";
import getClient from "./utils/getClient";
import { deleteComment } from "./utils/operations/comment";
import { async } from "regenerator-runtime/runtime";
const client = getClient();

describe("Comment Test Cases", () => {
  beforeEach(createSeedDatabase);
  test("should delete own comment", async () => {
    const client = getClient(user1.jwt);
    const variables = {
      id: comment1.comment.id,
    };
    const { data } = await client.mutate({
      mutation: deleteComment,
      variables,
    });
    // expect(data.deleteComment.author.id).toBe(user1.user.id);
    const isCommentExist = await prisma.exists.Comment({
      id: comment1.comment.id,
    });
    expect(isCommentExist).toBeFalsy();
  });
  test("should not delete others comment", async () => {
    const client = getClient(user1.jwt);
    const variables = {
      id: comment2.comment.id,
    };
    expect(
      client.mutate({
        mutation: deleteComment,
        variables,
      })
    ).rejects.toThrow();
  });
});
