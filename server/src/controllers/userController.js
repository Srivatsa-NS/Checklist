import pg from "pg";
import bcrypt from "bcrypt";
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

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database
    await client.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const userQuery = await client.query(
      "SELECT * FROM users WHERE email = $1 AND name = $2",
      [email, username]
    );
    const user = userQuery.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful", userID: user.userid });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserByName = async (req, res) => {
  const name = req.query.name;

  try {
    const query = "SELECT userid FROM users WHERE name = $1";
    const result = await client.query(query, [name]);

    const requestedId = result.rows[0].userid;
    console.log(requestedId);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({userId : requestedId});
  } catch (error) {
    console.error("Error fetching user by name:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};