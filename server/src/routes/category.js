import express from "express";
import { createCategory, fetchAllCategories } from "../controllers/categoryController.js";

const categoryRouter = express.Router();

// Route to create a new category
categoryRouter.post("/", createCategory);

// Route to fetch all categories
categoryRouter.get("/", fetchAllCategories);

export default categoryRouter;
