const { GoogleGenerativeAI } = require("@google/generative-ai");

// Debug logs
console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
console.log("Key length:", process.env.GEMINI_API_KEY?.length);
console.log(
  "Key prefix:",
  process.env.GEMINI_API_KEY
    ? process.env.GEMINI_API_KEY.substring(0, 10)
    : "NOT_FOUND"
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

function cleanJson(text) {
  return text.replace(/```json|```/g, "").trim();
}

async function analyzeTask({ title, description, dueDate }) {
  try {
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

    console.log("Gemini Analyze Response:", text);

    return JSON.parse(cleanJson(text));
  } catch (error) {
    console.error("AnalyzeTask Error:", error);
    throw error;
  }
}

async function prioritizeTasks(tasks) {
  try {
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

    console.log("Gemini Prioritize Response:", text);

    return JSON.parse(cleanJson(text));
  } catch (error) {
    console.error("PrioritizeTasks Error:", error);
    throw error;
  }
}

module.exports = {
  analyzeTask,
  prioritizeTasks,
};