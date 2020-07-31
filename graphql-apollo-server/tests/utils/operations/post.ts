import { gql } from "@apollo/client";
const getPosts = gql`
  query {
    allPosts {
      id
      title
      content
      isPublished
    }
  }
`;
const getMyPosts = gql`
  query {
    myPosts {
      id
      title
      content
      isPublished
    }
  }
`;

const updatePost = gql`
  mutation($id: ID!, $data: updatePostInput!) {
    updatePost(id: $id, updatePostInput: $data) {
      id
      title
      content
      isPublished
    }
  }
`;
const createPost = gql`
  mutation($data: createPostInput!) {
  createPost(createPostInput: $data) {
    title
    id
    isPublished
    content
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
    posts {
      node {
        id
        title
        content
        isPublished
      }
      mutation
    }
  }
`;

const fetchPublishedPostById = gql`
  query($id: ID!) {
    postById(id: $id) {
      id
      title
      content
      isPublished
    }
  }
`;

export {
  getPosts,
  getMyPosts,
  fetchPublishedPostById,
  updatePost,
  createPost,
  deletePost,
  subscriptionPosts,
};
