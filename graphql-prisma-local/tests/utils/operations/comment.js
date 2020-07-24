import { gql } from "apollo-boost";
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

export { deleteComment };
