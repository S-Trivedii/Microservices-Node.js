const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  // creating a 4-byte hexadecimal random id
  const commentId = randomBytes(4).toString("hex");

  const { content } = req.body;

  // Retrieves the current comments array for the post. If it doesn't exist, it defaults to an empty array.
  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content });

  commentsByPostId[req.params.id] = comments;

  axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
    },
  });

  res.status(201).send(comments);
});

// Receiving event form the event bus/broker
app.post("/events", (req, res) => {
  console.log("Event Received: ", req.body.type);

  res.send({});
});

app.listen(4001, () => {
  console.log("listening on 4001");
});

// const commentsByPostId = {
//   1: [
//     { id: "f6a2e3", content: "Great post!" },
//     { id: "9d1f4b", content: "Thanks for sharing!" },
//   ],
//   2: [{ id: "8c5f7a", content: "Interesting read!" }],
// };
