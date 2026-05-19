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

  const prompt = `You are an academic study coach. Create a practical week-by-week study plan for a student with these upcoming academic tasks:

${taskList}

Return ONLY Markdown. Do not include code fences or JSON.

Formatting requirements:
- Start with "# Study Plan"
- Create at most 8 weekly sections.
- Each weekly section heading must be exactly "## Week N plan -- Short topic title" where N starts at 1.
- The short topic title must fit the actual work for that week, such as "React components and midterm prep".
- Under each week, include:
  - A short "Focus:" line explaining the main goal for that week.
  - 3 to 6 bullet points telling the student exactly what to study or complete.
  - Mention actual task names and due dates when they exist.
  - Reference the relevant tasks by name when a weekly action supports a task.
  - Include suggested time blocks, such as "45 minutes" or "2 hours".
  - Use bullet points by default.
  - Include a compact Markdown table only when it makes the weekly plan clearer, for example columns: Day, Work block, Task.
- End with a "## Priority notes" section with 2 to 5 bullets.
- Do not create more than 8 weeks even if there are many tasks.
- Do not invent assignments that are not in the task list.

Make the plan concrete, calm, and useful.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { extractTasksFromText, generateStudyPlan };
