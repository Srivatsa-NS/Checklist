import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/userContexts.js";
import Category from "./Category.jsx";
import Question from "./Question.jsx";
import Assignee from "./Assignee.jsx";

const CreateNew = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [question, setQuestion] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { userID, setUserID } = useUser();

  const navigate = useNavigate();

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

  useEffect(() => {
    if (!userID) setUserID(localStorage.getItem("userID"));
  }, [userID]);

  return (
    <form
      className="p-4 border rounded-lg max-w-md mx-auto mt-10"
      onSubmit={handleSubmit}
    >
      <Category
        categories={categories}
        setCategories={setCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setErrorMessage={setErrorMessage}
      />

      {selectedCategory && (
        <div className="mt-6">
          <Question
            question={question}
            handleQuestionChange={handleQuestionChange}
          />

          <Assignee
            assignedTo={assignedTo}
            handleAssignedToChange={handleAssignedToChange}
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

      {!selectedCategory && errorMessage && (
        <div className="text-red-500 mt-2 text-center mt-8">{errorMessage}</div>
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
