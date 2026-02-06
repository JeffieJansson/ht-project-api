import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints";
import dotenv from "dotenv";

import thoughtRoutes from "./routes/thoughtRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

//Connecting to MongoDB
const mongoUrl = process.env.MONGO_URL
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

const port = process.env.PORT || 9000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// documentation of the API with express-list-endpoints
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.json([{
    message: "Welcome to the Thoughts API",
    endpoints: endpoints
  }]);
});

app.use("/user", userRoutes);
app.use("/thoughts", thoughtRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})