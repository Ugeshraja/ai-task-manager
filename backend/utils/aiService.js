const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = "claude-sonnet-4-6";

// Strips markdown code fences if the model wraps JSON in them
const cleanJson = (text) => {
  return text.replace(/```json|```/g, "").trim();
};

/**
 * Analyze a task and return suggested priority + reasoning + a breakdown
 * of subtasks. Returns a parsed JS object.
 */
async function analyzeTask({ title, description, dueDate }) {
  const prompt = `You are a productivity assistant inside a task manager app.
Analyze the following task and respond with ONLY a JSON object (no preamble,
no markdown fences) matching this exact shape:

{
  "priority": "low" | "medium" | "high" | "urgent",
  "reason": "one short sentence explaining the priority",
  "subtasks": ["subtask 1", "subtask 2", "subtask 3"]
}

Task title: "${title}"
Task description: "${description || "N/A"}"
Due date: "${dueDate || "Not set"}"

Rules:
- "subtasks" should be 2-5 concrete, actionable steps to complete the task.
- Base priority on urgency (due date) and apparent importance of the task.
- Keep "reason" under 20 words.`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  const parsed = JSON.parse(cleanJson(textBlock.text));
  return parsed;
}

/**
 * Given a list of tasks, ask Claude to rank/sort them and give a short
 * daily-focus summary.
 */
async function prioritizeTasks(tasks) {
  const taskList = tasks
    .map(
      (t, i) =>
        `${i + 1}. id=${t._id} | title="${t.title}" | status=${t.status} | dueDate=${
          t.dueDate || "none"
        } | currentPriority=${t.priority}`
    )
    .join("\n");

  const prompt = `You are a productivity assistant. Here is a user's current task list:

${taskList}

Respond with ONLY a JSON object (no preamble, no markdown fences) of this shape:

{
  "summary": "a short 1-2 sentence overview of what the user should focus on today",
  "orderedTaskIds": ["id1", "id2", "id3"]
}

"orderedTaskIds" must contain every id from the list above, ordered from most
to least important to work on right now, considering due dates and status.`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  const parsed = JSON.parse(cleanJson(textBlock.text));
  return parsed;
}

module.exports = { analyzeTask, prioritizeTasks };
