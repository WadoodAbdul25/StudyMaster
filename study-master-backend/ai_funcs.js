async function extractTasksFromText(rawText) {
  const model = require("./gemeniClient");
  const prompt = `You are a helpful assistant that extracts academic tasks from course syllabi.

Extract all assignments, exams, quizzes, and readings from the syllabus text below.
Return a JSON array of task objects. Each object must have exactly these fields:
- title: string (descriptive name of the task)
- type: one of "assignment", "exam", "quiz", "reading"
- dueDate: ISO date string (YYYY-MM-DD) or null if not specified
- description: string (brief description, empty string if none)
- priority: one of "low", "medium", "high" (exams=high, assignments=medium, readings=low)

Return ONLY valid JSON with no markdown, no code blocks, no explanation.
Example: [{"title":"Midterm Exam","type":"exam","dueDate":"2024-03-15","description":"Covers chapters 1-5","priority":"high"}]

Syllabus text:
${rawText.substring(0, 15000)}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // strip markdown code fences if Gemini wraps the response
  const cleaned = text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();

  return JSON.parse(cleaned);
}

async function generateStudyPlan(tasks) {
  const model = require("./gemeniClient");
  const taskList = tasks
    .map(
      (t) =>
        `- ${t.title} (${t.type}, due: ${t.dueDate ? new Date(t.dueDate).toDateString() : "TBD"}, priority: ${t.priority})`
    )
    .join("\n");

  const prompt = `You are an academic study coach. Create a detailed, practical study plan for a student with these upcoming tasks:

${taskList}

Your plan should include:
1. A week-by-week study timeline leading up to each deadline
2. How to prioritize tasks based on due dates and priority levels
3. Study strategies tailored to each task type (exams, assignments, quizzes, readings)
4. Specific time management tips for this exact workload

Reference the actual task names and dates. Be specific, actionable, and encouraging.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { extractTasksFromText, generateStudyPlan };
