import { Prisma } from "prisma-binding";
import { fragmentReplacements } from "./resolvers";

const prisma = new Prisma({
  typeDefs: "./src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
  secret: "chai-peelov2",
  fragmentReplacements,
});

export default prisma;

// Retrieve `id` and `name` of all users
// prisma.query
//   .users(null, "{ id name email posts { id title } }")
//   .then((data) => {
//     console.log(data);
//     for (const key in data) {
//       if (data.hasOwnProperty(key)) {
//         if (key == "posts") {
//           data[key].forEach((element) => {
//             console.log(element);
//           });
//         } else {
//           console.log(data[key]);
//         }
//       }
//     }
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// prisma.query
//   .comments(null, "{ id text author { id name } }")
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
//   })
//   .catch((err) => console.log(err));

// const createPost = async (body, authorId) => {
//   try {
//     const isUserExist = await prisma.exists.User({
//       id: authorId,
//     });
//     if (!isUserExist) {
//       console.log("User not found");
//     } else {
//       const postData = await prisma.mutation.createPost(
//         {
//           data: {
//             ...body,
//             author: {
//               connect: {
//                 id: authorId,
//               },
//             },
//           },
//         },
//         "{ author { id name email posts { title id isPublished } } }"
//       );
//       console.log(postData.author);
//       // const userData = await prisma.query.user(
//       //   {
//       //     where: {
//       //       id: authorId,
//       //     },
//       //   },
//       //   "{ id name email posts { id title body isPublished } }"
//       // );
//       // console.log(userData);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
// createPost(
//   { title: "jab new post hy 3", body: "", isPublished: false },
//   "ckcize9o80013078528o7bgc6"
// );
// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "Yasir ki kahani uski zabani",
//         body: "Mera lagae hyn kch karo",
//         isPublished: true,
//         author: {
//           connect: {
//             id: "ckcizem7p001g0785xjwpee6q",
//           },
//         },
//       },
//     },
//     "{ id title body isPublished author { id name }}"
//   )
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
//     return prisma.query.users(null, "{ id name posts { id title } }");
//   })
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const updatePost = async (postId, data, filter) => {
//   try {
//     const isPostExist = await prisma.exists.Post(filter);
//     if (!isPostExist) {
//       console.log("Post not exists");
//     } else {
//       const updatePostData = await prisma.mutation.updatePost(
//         {
//           data: {
//             ...data,
//           },
//           where: {
//             id: postId,
//           },
//         },
//         "{ author { id name email posts { title id isPublished body }} }"
//       );
//       console.log(updatePostData.author);
//       // const userData = await prisma.query.user(
//       //   {
//       //     where: {
//       //       id: updatePostData.author.id,
//       //     },
//       //   },
//       //   "{ id name email posts { id title body isPublished } }"
//       // );
//       // console.log(userData);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// updatePost(
//   "ckckkxghg000w0989n0v0hpje",
//   {
//     title: "Jan Jao ga v2 Updated",
//     body: `New Post Updated ${new Date().toISOString()}`,
//   },
//   { id: "ckckkxghg000w0989n0v0hpje" }
// );
// prisma.mutation
//   .updatePost(
//     {
//       data: {
//         // isPublished: true,
//         body: "You can check new course material in the end",
//       },
//       where: {
//         id: "ckckkxghg000w0989n0v0hpje",
//       },
//     },
//     "{ id title body isPublished author { name } }"
//   )
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
//     return prisma.query.posts(
//       null,
//       "{ id title body isPublished author {name} }"
//     );
//   })
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const isCommentExist = async (filter) => {
//   try {
//     const result = await prisma.exists.Comment(filter);
//     console.log(result);
//   } catch (error) {
//     console.log(error);
//   }
// };

// isCommentExist({
//   id: "ckcizh4mz003o0785rh1ekjot",
//   author: {
//     id: "ckcize9o80013078528o7bgc6",
//   },
// });
