import { v4 } from "uuid";
const subscription = {
  post: {
    subscribe: (parent, args, { pubsub }, info) => {
      return pubsub.asyncIterator("post");
    },
  },
  comment: {
    subscribe: (parent, { postId }, { pubsub, db: { posts } }, info) => {
      const post = posts.find((post) => post.id === postId && post.isPublished);
      if (!post) {
        throw new Error("Post not exist");
      }
      const channel = `post-${postId}`;
      return pubsub.asyncIterator(channel);
    },
  },
};

export default subscription;
