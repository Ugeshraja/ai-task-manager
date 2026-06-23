const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

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

  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

async function prioritizeTasks(tasks) {
  const taskList = tasks
    .map(
      (t, i) =>
        `${i + 1}. ${t.title} | Due: ${t.dueDate || "none"} | Priority: ${t.priority}`
    )
    .join("\n");

  const prompt = `
Prioritize these tasks and return ONLY valid JSON:

{
  "summary":"short summary",
  "orderedTaskIds":[]
}

Tasks:
${taskList}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

module.exports = { analyzeTask, prioritizeTasks };
