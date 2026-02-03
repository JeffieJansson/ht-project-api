import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints";
import dotenv from "dotenv";
import thoughtJson from "./data.json" with { type: "json" };
import Thought from "./models/Thought.js";
import thoughtRoutes from "./routes/thoughtRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

// Load initial data for seeding (only used if RESET_DB is true)
let thoughtData = thoughtJson;

//Connecting to MongoDB
const mongoUrl = process.env.MONGO_URL
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

const port = process.env.PORT || 9000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())


// Add seeding of db
if (process.env.RESET_DB === "true") {
  const seedDatabase = async () => {
    await Thought.deleteMany();

    // Remove _id from each thought to let MongoDB generate new ones
    // other way to do it is to use thoughtData = thoughtData.map(thought => { delete thought._id; return thought; });
    const thoughtsToSeed = thoughtData.map(({ _id, __v, ...thought }) => thought);
    
    await Thought.insertMany(thoughtsToSeed);
  }
  seedDatabase();
}


// documentation of the API with express-list-endpoints
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  console.log("mongo:", process.env.MONGO_URL);
  res.json([{
    message: "Welcome to the Thoughts API",
    endpoints: endpoints
  }]);
});

// These are the connections to the different routes with endpoints
app.use("/users", userRoutes);
app.use("/thoughts", thoughtRoutes);
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})