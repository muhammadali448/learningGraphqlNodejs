import { gql } from "@apollo/client";
const createUser = gql`
  mutation($data: signupInput!) {
    signup(signupInput: $data) {
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
  mutation($data: loginInput!) {
    login(loginInput: $data) {
      token
    }
  }
`;
const getUsers = gql`
  query {
    allUsers {
      id
      name
      email
    }
  }
`;
const getProfile = gql`
  query {
    myProfile {
      id
      name
      email
    }
  }
`;

export { createUser, loginUser, getUsers, getProfile };
