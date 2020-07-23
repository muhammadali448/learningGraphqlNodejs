import ApolloClient, { gql } from "apollo-boost";

const client = new ApolloClient({
  uri: "http://localhost:4000",
});

const getUsers = gql`
  query {
    users {
      id
      name
    }
    posts {
      title
      author {
        name
      }
    }
  }
`;

client
  .query({
    query: getUsers,
  })
  .then((res) => {
    // console.log(res.data);
    const usersDivSelect = document.getElementById("users");
    const postsDivSelect = document.getElementById("posts");
    let html = "<h3>Users:</h3><ul>";
    res.data.users.forEach((element) => {
      html += `<li>${element.name}</li>`;
    });
    html += "</ul>";
    usersDivSelect.innerHTML = html;
    let html2 = "<h3>Posts:</h3><ul>";
    res.data.posts.forEach((element) => {
      html2 += `<li>${element.title} by ${element.author.name}</li>`;
    });
    html2 += "</ul>";
    postsDivSelect.innerHTML = html2;
  })
  .catch((err) => {
    console.log("hehe", err.message);
  });
