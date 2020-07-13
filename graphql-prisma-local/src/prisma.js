import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "./src/generated/prisma.graphql",
  endpoint: "http://localhost:4466/",
});

// Retrieve `id` and `name` of all users
prisma.query
  .users(null, "{ id name email posts { id title } }")
  .then((data) => {
    console.log(data);
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (key == "posts") {
          data[key].forEach((element) => {
            console.log(element);
          });
        } else {
          console.log(data[key]);
        }
      }
    }
  })
  .catch((err) => {
    console.log(err);
  });

prisma.query
  .comments(null, "{ id text author { id name } }")
  .then((data) => {
    console.log(JSON.stringify(data, undefined, 2));
  })
  .catch((err) => console.log(err));
