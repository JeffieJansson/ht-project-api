import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import data from "./data.json" with { type: "json" }
import listEndpoints from "express-list-endpoints";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/thoughts-api"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

const port = process.env.PORT || 9000
const app = express()


app.use(cors())
app.use(express.json())

// documentation of the API with express-list-endpoints
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);

  res.json([{
    message: "Welcome to my Thoughts API",
    endpoints: endpoints
  }]);
});

// One endpoint to return a collection of results(GET all thoughts)
app.get("/thoughts", (req, res) => {
  const { hearts } = req.query; // Get the hearts using query parameter
  let filteredData = data;

  // Filter hearts greater than or equal to the specified value to the endpoint which returns all thoughts
  if (hearts) {
    filteredData = filteredData.filter((thought) => {
      return thought.hearts >= Number(hearts);
    });
  }

  res.json(filteredData);
})


// One endpoint to return a single result  (GET thoughts by id)
app.get("/thoughts/:id", (req, res) => {
  const { id } = req.params
  const thoughtsId = data.find((thoughts) => thoughts._id === id)

  if(!thoughtsId) {
      return res.status(404).json({ error: `Thought with id ${id} not found` });
    }
  res.json(thoughtsId)
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})