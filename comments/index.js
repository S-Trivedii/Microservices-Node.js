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

  // creating a status property with the default value 'pending'. We are creating a moderation service, when a user create a comment, an event will created called commentCreated. This event will go to the event-bus, event-bus then send this event to moderation service and query service.
  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostId[req.params.id] = comments;

  // emitting an event called commentCreated and sending it to the event bus
  axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending", // lecture - 43
    },
  });

  res.status(201).send(comments);
});

// Receiving event form the event bus/broker
app.post("/events", async (req, res) => {
  console.log("Event Received: ", req.body.type);

  // Processing the received event(commentModerated event)

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    // updating the status to either 'approved or rejected' from pending
    comment.status = status;

    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }

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
