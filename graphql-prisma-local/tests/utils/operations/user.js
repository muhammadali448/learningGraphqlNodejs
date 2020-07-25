import { gql } from "@apollo/client";
const createUser = gql`
  mutation($data: createUserInput!) {
    createUser(data: $data) {
      user {
        id
        name
        email
      }
      token
    }
  }
`;
const loginUser = gql`
  mutation($data: loginUserInput) {
    loginUser(data: $data) {
      token
    }
  }
`;
const getUsers = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;
const getProfile = gql`
  query {
    me {
      id
      name
      email
    }
  }
`;

export { createUser, loginUser, getUsers, getProfile };
