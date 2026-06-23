const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

function cleanJson(text) {
  return text.replace(/```json|```/g, "").trim();
}

async function analyzeTask({ title, description, dueDate }) {
  const prompt = `
Analyze this task and return ONLY valid JSON:

{
  "priority":"low|medium|high|urgent",
  "reason":"short reason",
  "subtasks":["step1","step2","step3"]
}

Title: ${title}
Description: ${description || ""}
Due Date: ${dueDate || ""}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(cleanJson(text));
}

async function prioritizeTasks(tasks) {
  const taskList = tasks
    .map(
      (t, i) =>
        `${i + 1}. id=${t._id} | title="${t.title}" | dueDate=${
          t.dueDate || "none"
        } | priority=${t.priority}`
    )
    .join("\n");

  const prompt = `
Prioritize these tasks and return ONLY valid JSON:

{
  "summary":"short summary",
  "orderedTaskIds":["id1","id2"]
}

Tasks:
${taskList}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(cleanJson(text));
}

module.exports = {
  analyzeTask,
  prioritizeTasks,
};