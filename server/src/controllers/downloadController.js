import pdfkit from "pdfkit";
import ExcelJS from "exceljs";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

await client.connect();

export const downloadQuestionsPdf = async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    // Fetching questions based on userID and including question details
    const query = `
      SELECT 
        q.questionID, 
        q.question, 
        r.response, 
        r.comment, 
        r.picture, 
        u.name AS assignedByName
      FROM 
        questions q
      LEFT JOIN 
        responses r ON r.questionID = q.questionID AND r.assignedTo = $1
      LEFT JOIN 
        users u ON q.assignedBY = u.userID
      WHERE 
        r.assignedTo = $1;
    `;

    const result = await client.query(query, [userId]);

    if (!result.rows[0]) {
      return res.status(404).json({ message: "No questions found" });
    }
    const questions = result.rows;

    // Creating PDF
    const doc = new pdfkit();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="questions_${userId}.pdf"`
    );

    doc.pipe(res);

    // Write PDF content
    questions.forEach((question) => {
      doc
        .fontSize(12)
        .text(`Question ID: ${question.questionid}`)
        .text(`Question: ${question.question}`)
        .text(`Assigned By: ${question.assignedbyname}`)
        .text(`Response: ${question.response || "N/A"}`)
        .text(`Comment: ${question.comment || "N/A"}`)
        .moveDown();

      if (question.picture) {
        const imageBuffer = question.picture;
        doc.image(imageBuffer, { width: 100, height: 100 });
        doc.moveDown();
      }
    });

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const downloadQuestionsExcel = async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    // Fetching questions based on userID and including question details
    const query = `
      SELECT 
        q.questionID, 
        q.question, 
        r.response, 
        r.comment, 
        r.picture, 
        u.name AS assignedByName
      FROM 
        questions q
      LEFT JOIN 
        responses r ON r.questionID = q.questionID AND r.assignedTo = $1
      LEFT JOIN 
        users u ON q.assignedBY = u.userID
      WHERE 
        r.assignedTo = $1;
    `;

    const result = await client.query(query, [userId]);
    if (!result.rows[0]) {
      return res.status(404).json({ message: "No questions found" });
    }
    const questions = result.rows;

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Questions");

    // Add headers to the worksheet
    worksheet.columns = [
      { header: "Question ID", key: "questionID", width: 15 },
      { header: "Question", key: "question", width: 30 },
      { header: "Assigned By", key: "assignedByName", width: 20 },
      { header: "Response", key: "response", width: 30 },
      { header: "Comment", key: "comment", width: 30 },
      { header: "Picture", key: "picture", width: 15 },
    ];

    // Add rows to the worksheet
    questions.forEach((question) => {
      worksheet.addRow({
        questionID: question.questionid,
        question: question.question,
        assignedByName: question.assignedbyname,
        response: question.response || "N/A",
        comment: question.comment || "N/A",
        picture: question.picture ? "Included" : "N/A", // Placeholder for binary data
      });
    });

    // Set up response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=questions_${userId}.xlsx`
    );

    // Send the workbook as a response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
