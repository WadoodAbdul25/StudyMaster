const fs = require("fs");

async function extractText(filePath, fileType) {
  if (fileType === "pdf") {
    const pdfParse = require("pdf-parse");
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (fileType === "docx") {
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}

module.exports = { extractText };
