import express from "express";
import {
  getQuestionsByUserId,
  createQuestion,
  updateResponses,
} from "../controllers/checklistController.js";

const checklistRouter = express.Router();

// Route to fetch questions by user ID
checklistRouter.get("/:userId", getQuestionsByUserId);

// Route to create question
checklistRouter.post("/create", createQuestion);

// Route to update responses
checklistRouter.put("/update-responses", updateResponses)

export default checklistRouter;
