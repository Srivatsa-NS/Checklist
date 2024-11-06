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

// API to create new Category
export const createCategory = async (req, res) => {
  const { name } = req.body; // Get category name from request body

  try {
    // Check if the category already exists
    const existingCategory = await client.query(
      "SELECT * FROM categories WHERE name = $1",
      [name]
    );
    if (existingCategory.rows.length > 0) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Insert the new category into the database
    await client.query("INSERT INTO categories (name) VALUES ($1)", [name]);

    res.status(201).json({ message: "Category created successfully" });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// API to fetch all category
export const fetchAllCategories = async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM categories");
    const categories = result.rows;

    if (categories.length > 0) {
      return res.status(200).json(categories);
    } else {
      return res.status(404).json({ message: "No categories found." });
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
