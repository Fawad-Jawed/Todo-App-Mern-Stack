const express = require("express");
const TodoModel = require("../Model/TodoModel"); // Import the Todo model
const Route = express.Router();

/**
 * @route GET /
 * @desc Get all todos
 */
Route.get("/", async (req, res) => {
  try {
    const result = await TodoModel.find({});
    res.status(200).json({
      isSuccessful: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      isSuccessful: false,
      error: error.message,
    });
  }
});

/**
 * @route GET /:id
 * @desc Get a todo by ID
 */
Route.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await TodoModel.findById(id);
    if (!result) {
      return res.status(404).json({
        isSuccessful: false,
        message: "Todo not found",
      });
    }
    res.status(200).json({
      isSuccessful: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      isSuccessful: false,
      error: error.message,
    });
  }
});

/**
 * @route POST /
 * @desc Add a new todo
 */
Route.post("/", async (req, res) => {
  try {
    const { title, isCompleted } = req.body;

    const todoObj = new TodoModel({
      title,
      isCompleted: isCompleted || false, // Default to false if not provided
    });

    await todoObj.save();
    res.status(201).json({
      isSuccessful: true,
      message: "Todo added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      isSuccessful: false,
      error: error.message,
    });
  }
});

/**
 * @route PUT /:id
 * @desc Update a todo by ID
 */
Route.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const result = await TodoModel.findByIdAndUpdate(id, body, { new: true });

    if (!result) {
      return res.status(404).json({
        isSuccessful: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      isSuccessful: true,
      message: "Todo updated successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      isSuccessful: false,
      error: error.message,
    });
  }
});

/**
 * @route DELETE /:id
 * @desc Delete a todo by ID
 */
Route.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await TodoModel.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        isSuccessful: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      isSuccessful: true,
      message: "Todo deleted successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      isSuccessful: false,
      error: error.message,
    });
  }
});

module.exports = Route;
