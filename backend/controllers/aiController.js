const Task = require("../models/Task");
const { analyzeTask, prioritizeTasks } = require("../utils/aiService");

// POST /api/ai/analyze
// body: { title, description, dueDate }
const analyze = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const result = await analyzeTask({ title, description, dueDate });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI analysis failed", error: error.message });
  }
};

// POST /api/ai/prioritize
// Reads the user's current incomplete tasks and returns a focus order
const prioritize = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id, status: { $ne: "done" } });

    if (tasks.length === 0) {
      return res.json({ summary: "No active tasks to prioritize.", orderedTaskIds: [] });
    }

    const result = await prioritizeTasks(tasks);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI prioritization failed", error: error.message });
  }
};

module.exports = { analyze, prioritize };
