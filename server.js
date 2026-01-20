import cors from "cors"
import express from "express"
import data from "./data.json" with { type: "json" }
import listEndpoints from "express-list-endpoints";


// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 9000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);

  res.json([{
    message: "Welcome to my Thoughts API",
    endpoints: endpoints
  }]);
});


app.get("/thoughts", (req, res) => {
  res.json(data)
})

app.get("/thoughts/:id", (req, res) => {
  const { id } = req.params
  const thoughtsId = data.find((thoughts) => thoughts._id === id)
  res.json(thoughtsId)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
