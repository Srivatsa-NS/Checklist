import express from "express";
import { downloadQuestionsPdf, downloadQuestionsExcel } from "../controllers/downloadController.js";

const downloadRouter = express.Router();

// Route to download questions as PDF by user ID
downloadRouter.get("/pdf/:userId", downloadQuestionsPdf);

// Route to download questions as Excel by user ID
downloadRouter.get("/excel/:userId", downloadQuestionsExcel);

export default downloadRouter;