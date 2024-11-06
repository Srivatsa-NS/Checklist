import express from "express";
import {
  loginUser,
  registerUser,
  getUserByName,
} from "../controllers/userController.js";

const userRouter = express.Router();

// Login route
userRouter.post("/login", loginUser);

// Register route
userRouter.post("/register", registerUser);

// Get userID using name
userRouter.get("/getID", getUserByName);

export default userRouter;
