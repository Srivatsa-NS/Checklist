import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import createTables from "./db.js";

import userRoutes from "./src/routes/user.js";
import checklistRoutes from "./src/routes/checklist.js";
import categoryRoutes from "./src/routes/category.js";
import downloadRoutes from "./src/routes/download.js"

// Load environment variables
dotenv.config();

const corsOptions = {
  origin: "http://localhost:3001",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// User routes
app.use("/api/users", userRoutes);

// Checklist routes
app.use("/api/checklist", checklistRoutes);

// Category routes
app.use("/api/categories", categoryRoutes);

// Download routes
app.use("/api/download", downloadRoutes);


// Start the server
app.listen(PORT, () => {
    createTables();
    console.log(`Server is running on http://localhost:${PORT}`);
});
