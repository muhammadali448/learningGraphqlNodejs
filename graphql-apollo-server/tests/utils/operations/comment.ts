import { gql } from "@apollo/client";
const deleteComment = gql`
  mutation($id: ID!) {
    deleteComment(id: $id) {
      id
      text
      author {
        id
      }
      post {
        id
      }
    }
  }
`;

const subscriptionComment = gql`
  subscription($postId: ID!) {
    comment(postId: $postId) {
      node {
        id
        text
      }
      mutation
    }
  }
`;

const fetchCommentsFromPost = gql`
  query($postId: ID!) {
    post(id: $postId) {
      id
      title
      body
      isPublished
      comments {
        text
      }
    }
  }
`;

const createComment = gql`
  mutation($data: createCommentInput!) {
    createComment(data: $data) {
      id
      text
    }
  }
`;

const updateComment = gql`
  mutation($id: ID!, $data: updateCommentInput!) {
    updateComment(id: $id, data: $data) {
      id
      text
    }
  }
`;

export {
  createComment,
  deleteComment,
  updateComment,
  subscriptionComment,
  fetchCommentsFromPost,
};
