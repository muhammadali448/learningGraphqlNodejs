import { gql } from "@apollo/client";
const deleteComment = gql`
  mutation($id: ID!) {
    deleteComment(id: $id) {
      id
      text
    }
  }
`;

const subscriptionComment = gql`
  subscription($postId: ID!) {
    comments(id: $postId) {
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
    postById(id: $postId) {
      id
      title
      content
      isPublished
      comments {
        text
      }
    }
  }
`;

const createComment = gql`
  mutation($data: createCommentInput!, $postId: ID!) {
    createComment(createCommentInput: $data, postId: $postId) {
      id
      text
    }
  }
`;

const updateComment = gql`
  mutation($id: ID!, $data: updateCommentInput!) {
    updateComment(id: $id, updateCommentInput: $data) {
      id
      text
      author {
        id
      }
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
