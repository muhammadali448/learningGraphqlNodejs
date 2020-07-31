import { prisma } from "../src/generated/prisma-client";
import {
  createSeedDatabase,
  user1,
  user2,
  comment1,
  comment2,
  post1,
  post2,
} from "./utils/createSeedDatabase";
import getClient from "./utils/getClient";
import {
  deleteComment,
  subscriptionComment,
  fetchCommentsFromPost,
  createComment,
  updateComment,
} from "./utils/operations/comment";
import server from "../src/server";
const client = getClient();

describe("Comment Test Cases", () => {
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
  test("Should fetch post comments", async () => {
    const variables = {
      postId: post1.post.id,
    };
    const { data } = await client.query({
      query: fetchCommentsFromPost,
      variables,
    });
    expect(data.postById.comments).toHaveLength(2);
  });
  test("Should require authentication to create a comment", async () => {
    const variables = {
      data: {
        text: "new comment",
      },
      postId: post1.post.id,
    };
    expect(
      client.mutate({
        mutation: createComment,
        variables,
      })
    ).rejects.toThrow();
  });
  test("Should create a new comment", async () => {
    const client = getClient(user1.jwt);
    const variables = {
      data: {
        text: "new comment",
      },
      postId: post1.post.id,
    };
    const { data } = await client.mutate({
      mutation: createComment,
      variables,
    });
    const isCommentExist = await prisma.$exists.comment({
      id: data.id,
    });
    expect(isCommentExist).toBeTruthy();
  });
  test("Should not create comment on draft post", () => {
    const client = getClient(user1.jwt);
    const variables = {
      data: {
        text: "new comment",
      },
      postId: post2.post.id,
    };
    expect(
      client.mutate({
        mutation: createComment,
        variables,
      })
    ).rejects.toThrow();
  });
  test("Should require authentication to update a comment", async () => {
    const text = "Comment updated";
    const variables = {
      id: comment1.comment.id,
      data: {
        text,
      },
    };
    expect(
      client.mutate({
        mutation: updateComment,
        variables,
      })
    ).rejects.toThrow();
  });
  test("Should update comment", async () => {
    const client = getClient(user2.jwt);
    const text = "Comment updated";
    const variables = {
      id: comment2.comment.id,
      data: {
        text,
      },
    };
    const { data } = await client.mutate({
      mutation: updateComment,
      variables,
    });
    expect(data.updateComment.text).toBe(text);
  });
  test("Should not update another users comment", () => {
    const client = getClient(user1.jwt);
    const text = "Comment updated";
    const variables = {
      id: comment2.comment.id,
      data: {
        text,
      },
    };
    expect(
      client.mutate({
        mutation: updateComment,
        variables,
      })
    ).rejects.toThrow();
  });
  test("Should require authentication to delete a comment", async () => {
    const variables = {
      id: comment1.comment.id,
    };
    expect(
      client.mutate({
        mutation: deleteComment,
        variables,
      })
    ).rejects.toThrow();
  });
  test("should delete own comment", async () => {
    const client = getClient(user1.jwt);
    const variables = {
      id: comment1.comment.id,
    };
    await client.mutate({
      mutation: deleteComment,
      variables,
    });
    const isCommentExist = await prisma.$exists.comment({
      id: comment1.comment.id,
    });
    expect(isCommentExist).toBeFalsy();
  });
  test("Should not delete another users comment", async () => {
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
  test("should subscribe a comment for a post", (done) => {
    const client = getClient(user1.jwt);
    const variables = {
      postId: post1.post.id,
    };
    const sub = client
      .subscribe({ query: subscriptionComment, variables })
      .subscribe({
        next(response: any) {
          try {
            expect(response.data.comments.mutation).toBe("DELETED");
            sub.unsubscribe();
            done();
          } catch (err) {
            done(err);
          }
        },
      });
    setTimeout(async () => {
      await prisma.deleteComment({
        id: comment1.comment.id,
      });
    }, 1000);
  });
});
