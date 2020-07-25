// import {
//   ApolloClient,
//   InMemoryCache,
//   split,
//   HttpLink,
//   ApolloLink,
//   concat,
// } from "@apollo/client";
// import { getMainDefinition } from "@apollo/client/utilities";
// import { WebSocketLink } from "@apollo/client/link/ws";
// const getClient = (
//   jwt,
//   httpURL = "http://localhost:4000",
//   websocketURL = "ws://localhost:4000"
// ) => {
//   const httpLink = new HttpLink({
//     uri: httpURL,
//     credentials: "same-origins",
//   });

//   const authMiddleware = new ApolloLink((operation, forward) => {
//     if (jwt) {
//       operation.setContext({
//         headers: {
//           authorization: `Bearer ${jwt}`,
//         },
//       });
//     }
//     return forward(operation);
//   });

//   const wsLink = new WebSocketLink({
//     uri: websocketURL,
//     options: {
//       reconnect: true,
//       connectionParams: () => {
//         if (jwt) {
//           return {
//             Authorization: `Bearer ${jwt}`,
//           };
//         }
//       },
//     },
//   });
//   const link = split(
//     ({ query }) => {
//       const { kind, operation } = getMainDefinition(query);
//       return kind === "OperationDefinition" && operation === "subscription";
//     },
//     wsLink,
//     concat(authMiddleware, httpLink)
//   );
//   return new ApolloClient({
//     link,
//     cache: new InMemoryCache(),
//   });
// };

// export default getClient;
