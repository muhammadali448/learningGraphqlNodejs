import ApolloClient from "apollo-boost";

const getClient = (jwt) => {
  const request = async (operation) => {
    if (jwt) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${jwt}`,
        },
      });
    }
  };
  return new ApolloClient({
    uri: "http://localhost:4000",
    request,
  });
};

export default getClient;
