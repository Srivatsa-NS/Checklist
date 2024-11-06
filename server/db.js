import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

// Set up database client
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

await client.connect();

const createTables = async () => {
  try {
    // User table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        userID SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    // Category table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        categoryID SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );
    `);

    // Question table
    await client.query(`
      CREATE TABLE IF NOT EXISTS questions (
        questionID SERIAL PRIMARY KEY,
        categoryID INTEGER NOT NULL,
        question TEXT NOT NULL,
        assignedBY INTEGER NOT NULL,
        FOREIGN KEY (categoryID) REFERENCES categories(categoryID) ON DELETE CASCADE,
        FOREIGN KEY (assignedBY) REFERENCES users(userID) ON DELETE SET NULL
      );
    `);

    // Response table
    await client.query(`
      CREATE TABLE IF NOT EXISTS responses (
        responseID SERIAL PRIMARY KEY,
        questionID INTEGER NOT NULL,
        response TEXT DEFAULT NULL,
        assignedTo INTEGER NOT NULL,
        comment TEXT,
        picture BYTEA,
        submitted BOOLEAN,
        FOREIGN KEY (questionID) REFERENCES questions(questionID) ON DELETE CASCADE,
        FOREIGN KEY (assignedTo) REFERENCES users(userID) ON DELETE SET NULL
      );
    `);

    console.log("Tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

export default createTables;
