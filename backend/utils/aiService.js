const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// Remove markdown code blocks if Gemini returns them
const cleanJson = (text) => {
  return text.replace(/```json|```/g, "").trim();
};

/**
 * Analyze a task and return:
 * priority, reason, subtasks
 */
async function analyzeTask({ title, description, dueDate }) {
  const prompt = `
You are a productivity assistant.

Analyze this task and return ONLY valid JSON.

{
  "priority": "low",
  "reason": "short reason",
  "subtasks": ["step1", "step2", "step3"]
}

Rules:
- priority must be one of: low, medium, high, urgent
- reason should be less than 20 words
- subtasks should contain 2-5 actionable steps

Task Title: ${title}
Description: ${description || "N/A"}
Due Date: ${dueDate || "Not set"}
`;

  const result = await model.generateContent(prompt);

  const text = result.response.text();

  return JSON.parse(cleanJson(text));
}

/**
 * Prioritize user tasks
 */
async function prioritizeTasks(tasks) {
  const taskList = tasks
    .map(
      (t, i) =>
        `${i + 1}. id=${t._id} | title="${t.title}" | status=${
          t.status
        } | dueDate=${t.dueDate || "none"} | currentPriority=${
          t.priority
        }`
    )
    .join("\n");

  const prompt = `
You are a productivity assistant.

Below is a user's task list:

${taskList}

Return ONLY valid JSON:

{
  "summary": "short summary",
  "orderedTaskIds": ["id1","id2","id3"]
}

Rules:
- orderedTaskIds must contain all task ids
- sort from most important to least important
- summary should be 1-2 sentences
`;

  const result = await model.generateContent(prompt);

  const text = result.response.text();

  return JSON.parse(cleanJson(text));
}

module.exports = {
  analyzeTask,
  prioritizeTasks,
};