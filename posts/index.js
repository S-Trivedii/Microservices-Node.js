const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// store all posts, all posts will get deleted when a server is restarted
const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  // {3d536622: {id: 3d536622, title: 'First Post'}}
  posts[id] = {
    id,
    title,
  };

  // emiting an event
  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

// Receiving the event
app.post("/events", (req, res) => {
  console.log("Event Received: ", req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log("listening on port 4000");
});
