import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../contexts/userContexts";

function Category({
  categories,
  setCategories,
  selectedCategory,
  setSelectedCategory,
  setErrorMessage,
}) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);

  // Context for getting the userID (assignedBy)
  const { userID, setUserID } = useUser();

  // Handle category selection change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setErrorMessage("");
    setIsCreatingNewCategory(false);
  };

  // Handle new category input change
  const handleNewCategoryChange = (event) => {
    setNewCategoryName(event.target.value);
  };

  // Handle creating a new category
  const handleCreateNewCategory = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/categories",
        { name: newCategoryName }
      );

      // If the category is created successfully, add it to the dropdown
      if (response.status === 201) {
        const newCategory = {
          categoryid: Date.now(), // Temporarily use Date.now() for id
          name: newCategoryName,
        };

        setCategories((prevCategories) => [...prevCategories, newCategory]);
        setSelectedCategory(newCategory.categoryid); // Set the newly created category as selected
        setNewCategoryName("");
        setIsCreatingNewCategory(false);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (!userID) setUserID(localStorage.getItem("userID"));

    fetchCategories();
  }, [userID]);
  return (
    <div>
      <label className="block text-lg font-semibold mb-2" htmlFor="category">
        Select Category
      </label>
      <select
        id="category"
        name="category"
        value={selectedCategory}
        onChange={(event) => handleCategoryChange(event)}
        className="w-full p-2 border rounded"
        required
      >
        <option value="" disabled>
          Choose a category
        </option>
        {categories.map((category) => (
          <option key={category.categoryid} value={category.categoryid}>
            {category.name}
          </option>
        ))}
      </select>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsCreatingNewCategory(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-white hover:text-green-500 hover:shadow-xl duration-500"
        >
          Create new category
        </button>
      </div>

      {isCreatingNewCategory && (
        <div className="mt-4">
          <input
            type="text"
            value={newCategoryName}
            onChange={handleNewCategoryChange}
            className="w-full p-2 border rounded"
            placeholder="Enter new category name"
          />
          <button
            type="button"
            onClick={handleCreateNewCategory}
            className="mt-5 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-white hover:text-blue-500 hover:shadow-xl duration-500"
          >
            Create Category
          </button>
        </div>
      )}
    </div>
  );
}

export default Category;
