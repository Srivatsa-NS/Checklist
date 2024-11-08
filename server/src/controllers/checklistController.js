import pg from "pg";
import dotenv from "dotenv";
import multer from "multer";

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

export const getQuestionsByUserId = async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    // Query to fetch questions along with responses based on the logged-in user
    const query = `
        SELECT 
            c.name AS categoryName,
            q.questionID, 
            q.question, 
            q.assignedBY,
            u.name, 
            r.response, 
            r.comment
        FROM 
            questions q
        LEFT JOIN 
            responses r ON r.questionID = q.questionID AND r.assignedTo = $1
        LEFT JOIN 
            categories c ON q.categoryID = c.categoryID
        LEFT JOIN
            users u ON q.assignedBY = u.userID
        WHERE 
            r.assignedTo = $1
            AND (r.submitted = FALSE OR r.submitted IS NULL);
      `;

    const result = await client.query(query, [userId]);
    const questions = result.rows;

    if (questions.length > 0) {
      return res.status(200).json(questions);
    } else {
      return res
        .status(404)
        .json({ message: "No questions found for this user." });
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createQuestion = async (req, res) => {
  const { questions } = req.body; // Expecting an array of questions in the request body

  // Validate input: Ensure questions is an array and contains at least one question
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: "Questions must be an array and cannot be empty" });
  }

  try {
    const createdQuestions = [];

    for (const questionData of questions) {
      const { question, categoryName, assignedBy, assignedTo } = questionData;

      // Fetch the category ID based on the category name
      const categoryResult = await client.query(
        "SELECT categoryID FROM categories WHERE name = $1",
        [categoryName]
      );

      if (categoryResult.rows.length === 0) {
        return res.status(404).json({ message: `Category ${categoryName} not found` });
      }

      const categoryID = categoryResult.rows[0].categoryid;

      // Insert the new question into the questions table
      const questionResult = await client.query(
        "INSERT INTO questions (question, categoryID, assignedBY) VALUES ($1, $2, $3) RETURNING questionID",
        [question, categoryID, assignedBy]
      );

      const questionID = questionResult.rows[0].questionid;

      // Insert a corresponding response into the responses table
      await client.query(
        "INSERT INTO responses (questionID, assignedTo) VALUES ($1, $2)",
        [questionID, assignedTo]
      );

      createdQuestions.push({ questionID, message: "Question created successfully" });
    }

    res.status(201).json({ message: "Questions created successfully", createdQuestions });
  } catch (error) {
    console.error("Error creating questions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const storage = multer.memoryStorage();
const upload = multer({ storage }).single("picture");

// API for updating responses
export const updateResponses = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "Error uploading picture", error: err });
    }

    const { userID, responses, comments } = req.body;

    // Parse the responses and comments to objects from JSON strings
    const parsedResponses = responses ? JSON.parse(responses) : {};
    const parsedComments = comments ? JSON.parse(comments) : {};

    const picture = req.file ? req.file.buffer : null;

    if (!userID || !parsedResponses || !parsedComments) {
      return res
        .status(400)
        .json({ message: "User ID, responses, and comments are required" });
    }

    try {
      for (const [questionID, response] of Object.entries(parsedResponses)) {
        const comment = parsedComments[questionID] || null;

        const query = `
          UPDATE responses
          SET response = $1, comment = $2, picture = $3, submitted = TRUE
          WHERE questionID = $4 AND assignedTo = $5
        `;
        const values = [response, comment, picture, questionID, userID];
        await client.query(query, values);
      }

      res.status(200).json({ message: "Responses updated successfully" });
    } catch (error) {
      console.error("Error updating responses:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};
