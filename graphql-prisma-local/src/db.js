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
    isPublished: true,
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

const db = {
  users,
  posts,
  comments,
};

export { db as default };
