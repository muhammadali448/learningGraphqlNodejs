import { gql } from "@apollo/client";
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

const updatePost = gql`
  mutation($id: ID!, $data: updatePostInput!) {
    updatePost(id: $id, data: $data) {
      id
      title
      body
      isPublished
    }
  }
`;
const createPost = gql`
  mutation($data: createPostInput!) {
    createPost(data: $data) {
      id
      title
      body
      isPublished
    }
  }
`;

const deletePost = gql`
  mutation($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

const subscriptionPosts = gql`
  subscription {
    post {
      node {
        id
        title
        body
        isPublished
      }
      mutation
    }
  }
`;

export {
  getPosts,
  getMyPosts,
  updatePost,
  createPost,
  deletePost,
  subscriptionPosts,
};
