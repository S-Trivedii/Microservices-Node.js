const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// This where we are going to store post and comment associated with it
const posts = {};
// posts ===
//   {
//     ej3dik: {
//       id: "ej3dik",
//       title: "this is title",
//       comments: [{ id: "klj3kl", content: "comment!" }],
//     },
//     ej3dik: {
//       id: "ej3dik",
//       title: "this is title",
//       comments: [{ id: "klj3kl", content: "comment!" }],
//     },
//   };

app.get("/posts", (req, res) => {
  res.send(posts);
});

// this is where we are going to receive the events from the event bus
app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId } = data;
    const post = posts[postId];
    post.comments.push({ id, content });
  }

  res.send({});
});

app.listen(4002, () => {
  console.log("Listening on port 4002");
});
