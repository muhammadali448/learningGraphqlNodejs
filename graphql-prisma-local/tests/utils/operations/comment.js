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

export { deleteComment, subscriptionComment };
