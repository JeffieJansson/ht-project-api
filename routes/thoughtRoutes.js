import express from "express";
import mongoose from "mongoose";
import Thought from "../models/Thought.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

//Endpoint is /thoughts
// Get all thoughts
router.get("/", async (req, res) => {
  const { hearts } = req.query;
  const query = {};

  if (hearts) {
    query.hearts = { $gte: Number(hearts) }; // Filter thoughts with hearts greater than or equal to the specified value
  }

  try {
    const filteredThoughts = await Thought.find(query).sort({ createdAt: -1 }); // Sort by createdAt in descending order
    
    if (filteredThoughts.length === 0) {
      return res.status(404).json({
        success: false,
        response: [],
        message: "No thoughts found for that query. Try another one!",
      });
    }
    return res.status(200).json({
      success: true,
      response: filteredThoughts,
      message: "Success",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      response: [],
      message: "Failed to fetch thoughts",
    });
  }
});

// get one thought based on id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        response: null,
        message: "Invalid ID format",
      });
    }

    const thought = await Thought.findById(id);

    if (!thought) {
      return res.status(404).json({
        success: false,
        response: null,
        message: "Thought not found",
      });
    }

    res.status(200).json({
      success: true,
      response: thought,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Thought couldn't be found",
    });
  }
});

//create new thought and save to db
router.post("/", authenticateUser, async (req, res) => {
  const body = req.body;

  try {
    const newThought = {
      message: body.message,
    };

    const createdThought = await new Thought(newThought).save();

    return res.status(201).json({
      success: true,
      response: createdThought,
      message: "Thought created successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        response: null,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      response: null,
      message: "Error creating thought",
    });
  }
});

// delete a thought by id (DELETE)
router.delete("/:id", authenticateUser, async (req, res) => {
  const id = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        response: null,
        message: "Invalid ID format",
      });
    }
    const deletedThought = await Thought.findByIdAndDelete(id);

    if (!deletedThought) {
      return res.status(404).json({
        success: false,
        response: null,
        message: "Thought not found",
      });
    }

    return res.status(200).json({
      success: true,
      response: deletedThought,
      message: "Thought deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      response: null,
      message: "Error deleting thought",
    });
  }
});

// Like a thought by id (PATCH)
router.patch("/:id/like", async (req, res) => {
  const id = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        response: null,
        message: "Invalid ID format",
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
        message: "Thought not found",
      });
    }

    return res.status(200).json({
      success: true,
      response: updatedThought,
      message: "Thought liked successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      response: null,
      message: "Error liking thought",
    });
  }
});

// Update a thought by id (PATCH)
router.patch("/:id", authenticateUser, async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        response: null,
        message: "Invalid ID format",
      });
    }

    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      { message: body.message },
      { new: true, runValidators: true }
    );

    if (!updatedThought) {
      return res.status(404).json({
        success: false,
        response: null,
        message: "Thought not found",
      });
    }

    return res.status(200).json({
      success: true,
      response: updatedThought,
      message: "Thought updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
      message: "Error editing thought",
    });
  }
});

export default router;
