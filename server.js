import cors from "cors"
import express, { response } from "express"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints";
import dotenv from "dotenv";
import thoughtJson from "./data.json" with { type: "json" };

dotenv.config();

// Load initial data for seeding (only used if RESET_DB is true)
let thoughtData = thoughtJson;

const mongoUrl = process.env.MONGO_URL
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
    message: "Welcome to my Thoughts API",
    endpoints: endpoints
  }]);
});

// One endpoint to return a collection of results(GET all thoughts)
app.get("/thoughts", async (req, res) => {
  const { hearts } = req.query;
  const query = {}

  if (hearts) {
    query.hearts = { $gte: Number(hearts) }
  }

  try {
    const filteredThoughts = await Thought.find(query).sort({ createdAt: -1 });
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
  const id = req.params.id 
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json ({
        success: false,
        response: null,
        message: "Invalid ID format"
      });
    }

    const thought = await Thought.findById(id);


    if (!thought) {

      return res.status(404).json ({
        success: false,
        response: [],
        message: `Thought not found`
      })
    }

        return res.status(200).json ({
      success: true,
      response: thought,
      message: "Success"
    })

  } catch (error) {
    return res.status(500).json ({
        success: false,
        response: [],
        message: error,
    })

  }

})

//create new thought and save() it to the database (POST)
app.post("/thoughts", async (req, res) => {
  const body = req.body;

  try {
    const newThought = {
      message: body.message,
    };

    const createdThought = await new Thought(newThought).save()

    return res.status(201).json ({
      success: true,
      response: createdThought,
      message: "Thought created successfully"
    })

  } catch (error) {
    return res.status(500).json ({
      success: false,
      response: null,
      message: error,
    })
  }
});

//TODO delete a thought by id (DELETE)
app.delete("/thoughts/:id", async (req, res) => {
  const id = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json ({
        success: false,
        response: null,
        message: "Invalid ID format"
      });
    }
    const deletedThought = await Thought.findByIdAndDelete(id);

    if (!deletedThought) {
      return res.status(404).json({
        success: false,
        response: null,
        message: "Thought not found"
      });
    }

    return res.status(200).json({
      success: true,
      response: deletedThought,
      message: "Thought deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      response: null,
      message: error.message
    });
  }
})

// Like a thought by id (PATCH)
app.patch("/thoughts/:id/like", async (req, res) => {
  const id = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json ({
        success: false,
        response: null,
        message: "Invalid ID format"
      });
    }

    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      { $inc: { hearts: 1 } },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({
        success: false,
        response: null,
        message: "Thought not found"
      });
    }

    return res.status(200).json({
      success: true,
      response: updatedThought,
      message: "Thought liked successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      response: null,
      message: error,
    });
  }
})

// Update a thought by id (PATCH)
app.patch("/thoughts/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        response: null,
        message: "Invalid ID format"
      });
    }

    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      { message: body.message },
      { new: true }
    );

    if (!updatedThought) {
      return res.status(404).json({
        success: false,
        response: null,
        message: "Thought not found"
      });
    }

    return res.status(200).json({
      success: true,
      response: updatedThought,
      message: "Thought updated successfully"
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      response: null,
      message: error.message
    });
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})