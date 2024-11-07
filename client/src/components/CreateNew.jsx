import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/userContexts.js";

const CreateNew = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);

  const [question, setQuestion] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Context for getting the userID (assignedBy)
  const { userID, setUserID } = useUser();

  const navigate = useNavigate();

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

  // Handle category selection change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Handle new category input change
  const handleNewCategoryChange = (event) => {
    setNewCategoryName(event.target.value);
  };

  // Handle creating a new category
  const handleCreateNewCategory = async () => {
    if (!newCategoryName) return; // Don't submit if input is empty

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

  // Handle input changes for question and assignedTo
  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleAssignedToChange = (event) => {
    setAssignedTo(event.target.value);
  };

  // Handle submit to create a new question
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate that all required fields are filled
    if (!selectedCategory || !question || !assignedTo) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      // Fetch userID for the assignedTo person based on name
      const userResponse = await axios.get(
        `http://localhost:3000/api/users/getID`,
        {
          params: {
            name: assignedTo,
          },
        }
      );

      if (userResponse.data.userId === 0) {
        // If no user is found with that name
        setErrorMessage("Invalid Assignee");
        return;
      }

      const assignedToUserID = userResponse.data.userId;
      // If user is trying to assign to himself
      if (parseInt(userID) === assignedToUserID) {
        setErrorMessage("Cannot assign to yourself");
        return;
      }

      // Prepare data for question creation
      const questionData = {
        question,
        categoryName: categories.find(
          (category) => category.categoryid === parseInt(selectedCategory)
        ).name,
        assignedBy: parseInt(userID),
        assignedTo: assignedToUserID,
      };

      // Call the createQuestion API to submit the new question
      const response = await axios.post(
        "http://localhost:3000/api/checklist/create",
        questionData
      );

      if (response.status === 201) {
        setErrorMessage("");
        setSuccessMessage("Question created successfully");

        // Redirect to the Checklist page
        setTimeout(() => {
          navigate("/checklist");
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating question:", error);
      setSuccessMessage("");
      setErrorMessage("There was an error submitting the question.");
    }
  };

  return (
    <form
      className="p-4 border rounded-lg max-w-md mx-auto mt-10"
      onSubmit={handleSubmit}
    >
      <label className="block text-lg font-semibold mb-2" htmlFor="category">
        Select Category
      </label>
      <select
        id="category"
        name="category"
        value={selectedCategory}
        onChange={handleCategoryChange}
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

      {selectedCategory && (
        <div className="mt-6">
          <label
            className="block text-lg font-semibold mb-2"
            htmlFor="question"
          >
            Question
          </label>
          <textarea
            id="question"
            value={question}
            onChange={handleQuestionChange}
            className="w-full p-2 border rounded"
            maxLength="500"
            placeholder="Enter your question here"
            rows="4"
            required
          />

          <label
            className="block text-lg font-semibold mt-4 mb-2"
            htmlFor="assignedTo"
          >
            Assigned To
          </label>
          <input
            id="assignedTo"
            type="text"
            value={assignedTo}
            onChange={handleAssignedToChange}
            className="w-full p-2 border rounded"
            placeholder="Enter person assigned to"
            required
          />

          {errorMessage && (
            <div className="text-red-500 mt-2 text-center mt-8">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="text-green-500 mt-2 text-center mt-8">
              {successMessage}
            </div>
          )}
        </div>
      )}

      {selectedCategory && (
        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:text-blue-500 hover:bg-white hover:shadow-xl duration-500"
          >
            Submit Question
          </button>
        </div>
      )}
    </form>
  );
};

export default CreateNew;
