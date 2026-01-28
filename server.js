import cors from "cors"
import express, { response } from "express"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL //mongodb://localhost:27017/thoughtsdb
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

const port = process.env.PORT || 9000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())


// Thoughts schema
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "A Message is required"],
    minlength: [5, "A Message must be at least 5 characters"],
    maxlength: [140, "A Message cannot exceed 140 characters"],
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Thought = mongoose.model("Thought", ThoughtSchema);

// Add seeding of db
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Thought.deleteMany();

    thoughtData.forEach(thought => {
      new Thought(thought).save();
  });
}
  seedDatabase();
}


// documentation of the API with express-list-endpoints
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  console.log("mongo:", process.env.MONGO_URL);
  res.json([{
    message: "Welcome to my Thoughts API",
    endpoints: endpoints
  }]);
});

// One endpoint to return a collection of results(GET all thoughts)
app.get("/thoughts", async (req, res) => {
  const { hearts } = req.query;

  const query = {}

  if (hearts) {
      query.hearts = { $gte: Number(hearts) } //$gte -  MongoDB operator for "greater than or equal to"
  }

  try {
    const filteredThoughts = await Thought.find(query)
    if (filteredThoughts.length === 0) {

    return res.status(404).json({
      success: false,
      response: [],
      message: "No thoughts found for that query"
    });
  }
    return res.status(200).json({
      success: true,
      response: filteredThoughts,
      message: "Thoughts retrieved successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      response: [],
      message: error,
    })
  }
});



// One endpoint to return a single result  (GET thoughts by id)
app.get("/thoughts/:id", async (req, res) => {
  const { id } = req.params
  try {
    const thought = await Thought.findById(Number(id));


    if (!thought) {

      return res.status(404).json ({
        success: false,
        response: [],
        message: `Thought with id ${id} not found`
      })
    }

  } catch (error) {
    return res.status(500).json ({
        success: false,
        response: [],
        message: error,
    })

  }

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})