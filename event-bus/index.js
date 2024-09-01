const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// storing all the incoming events
const events = [];

// creating an event-bus

app.post("/events", (req, res) => {
  const event = req.body;
  //   console.log(event);

  // lec - 51
  events.push(event);

  // event-bus/broker sending back data to differnt services
  axios.post("http://localhost:4000/events", event);
  axios.post("http://localhost:4001/events", event);
  axios.post("http://localhost:4002/events", event);
  axios.post("http://localhost:4003/events", event);

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Listening at port 4005");
});
