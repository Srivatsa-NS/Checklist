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
  const [questions, setQuestions] = useState([
    { questionNumber: 1, question: "" },
  ]);
  const [assignedTo, setAssignedTo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { userID, setUserID } = useUser();
  const navigate = useNavigate();

  // Handle input changes for question
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, question: value } : q
    );
    setQuestions(updatedQuestions);
  };

  // Handle new question addition
  const handleNewQuestion = () => {
    setQuestions([
      ...questions,
      { questionNumber: questions.length + 1, question: "" },
    ]);
    setErrorMessage(""); // Clear any existing error message
  };

  // Handle question deletion and reassign question numbers
  const handleDeleteQuestion = (index) => {
    if (questions.length === 1) {
      setErrorMessage("Add at least one question");
      return;
    }

    // Filter out the deleted question and reassign question numbers
    const updatedQuestions = questions
      .filter((_, i) => i !== index)
      .map((q, i) => ({ ...q, questionNumber: i + 1 })); // Reassign question numbers

    setQuestions(updatedQuestions);
    setErrorMessage(""); // Clear error message if deletion is successful
  };

  const handleAssignedToChange = (event) => {
    setAssignedTo(event.target.value);
  };

  // Handle submit to create new questions
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !selectedCategory ||
      questions.some((q) => !q.question) ||
      !assignedTo
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const userResponse = await axios.get(
        `http://localhost:3000/api/users/getID`,
        { params: { name: assignedTo } }
      );

      if (userResponse.data.userId === 0) {
        setErrorMessage("Invalid Assignee");
        return;
      }

      const assignedToUserID = userResponse.data.userId;
      if (parseInt(userID) === assignedToUserID) {
        setErrorMessage("Cannot assign to yourself");
        return;
      }

      const questionData = questions.map((q) => ({
        question: q.question,
        categoryName: categories.find(
          (category) => category.categoryid === parseInt(selectedCategory)
        ).name,
        assignedBy: parseInt(userID),
        assignedTo: assignedToUserID,
      }));

      const response = await axios.post(
        "http://localhost:3000/api/checklist/create",
        questionData
      );

      if (response.status === 201) {
        setErrorMessage("");
        setSuccessMessage("Questions created successfully");

        setTimeout(() => {
          navigate("/checklist");
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating questions:", error);
      setSuccessMessage("");
      setErrorMessage("There was an error submitting the questions.");
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
          {questions.map((q, index) => (
            <div key={index} className="mb-4">
              <Question
                questionNumber={q.questionNumber}
                question={q.question}
                handleQuestionChange={(e) =>
                  handleQuestionChange(index, e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => handleDeleteQuestion(index)}
                className="mt-2 px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-700"
              >
                Delete question
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleNewQuestion}
            className="mt-5 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-white hover:text-green-500 hover:shadow-xl duration-500"
          >
            Add question
          </button>

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
            Submit Questions
          </button>
        </div>
      )}
    </form>
  );
};

export default CreateNew;
