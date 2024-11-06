import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChecklistItems from "./ChecklistItems";
import { useUser } from "../contexts/userContexts";

const ChecklistPage = () => {
  const [questions, setQuestions] = useState([]);
  const [photos, setPhotos] = useState({});
  const [responses, setResponses] = useState({});
  const [comments, setComments] = useState({});
  const { userID, setUserID } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const fetchQuestions = async () => {
    try {
      if (!userID) {
        const storedUserID = localStorage.getItem("userID");
        if (storedUserID) {
          setUserID(storedUserID);
        }
      }

      if (userID) {
        const response = await axios.get(
          `http://localhost:3000/api/checklist/${userID}`
        );
        setQuestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching checklist:", error);
    }
  };

  const handleSubmitCategory = async (category) => {
    const categoryQuestions = categorizedQuestions[category];

    const responsesToSubmit = categoryQuestions.map((question) => ({
      questionId: question.questionid,
      response: responses[question.questionid],
      comment: comments[question.questionid],
      photo: photos[question.questionid],
    }));

    const formData = new FormData();
    formData.append("userID", userID);

    formData.append(
      "responses",
      JSON.stringify(
        responsesToSubmit.reduce((acc, item) => {
          acc[item.questionId] = item.response;
          return acc;
        }, {})
      )
    );

    formData.append(
      "comments",
      JSON.stringify(
        responsesToSubmit.reduce((acc, item) => {
          acc[item.questionId] = item.comment;
          return acc;
        }, {})
      )
    );

    responsesToSubmit.forEach((item) => {
      if (item.photo) {
        formData.append("picture", item.photo);
      }
    });

    try {
      await axios.put(
        "http://localhost:3000/api/checklist/update-responses",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(`Responses for ${category} submitted successfully.`);
      await fetchQuestions();
    } catch (error) {
      console.error("Error submitting responses:", error);
      alert("Error submitting responses. Please try again.");
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/download/pdf/${userID}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `questions_${userID}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/download/excel/${userID}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `questions_${userID}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading Excel:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [userID]);

  // Organize questions by category
  const categorizedQuestions = questions.reduce((acc, question) => {
    const { categoryname } = question;
    if (!acc[categoryname]) acc[categoryname] = [];
    acc[categoryname].push(question);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-6 flex flex-col min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-6xl font-bold text-center mb-6">Your Checklist</h2>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg"
          >
            Download as
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-48">
              <button
                onClick={handleDownloadPdf}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                .pdf
              </button>
              <button
                onClick={handleDownloadExcel}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                .xlsx
              </button>
            </div>
          )}
        </div>
      </div>

      {Object.keys(categorizedQuestions).map((category, index) => (
        <div key={index} className="mb-6 mt-16">
          <h3 className="text-3xl text-center font-semibold mb-8">
            {category}
          </h3>
          <div className="space-y-4">
            {categorizedQuestions[category].map((question) => (
              <div key={question.questionid} className="p-4 border rounded-lg">
                <ChecklistItems
                  question={question.question}
                  questionId={question.questionid}
                  responses={responses}
                  setResponses={setResponses}
                  photos={photos}
                  setPhotos={setPhotos}
                  comments={comments}
                  setComments={setComments}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Assigned by: {question.name}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => handleSubmitCategory(category)}
              className="px-6 py-4 bg-blue-500 text-white text-lg rounded-xl hover:bg-white hover:text-blue-500 hover:shadow-xl duration-500"
            >
              Submit {category} responses
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-center text-lg mt-auto">
        <button
          onClick={() => navigate("/create")}
          className="px-6 py-4 bg-green-500 text-white rounded-xl hover:bg-white hover:text-green-500 hover:shadow-xl duration-500"
        >
          Create New Checklist
        </button>
      </div>
    </div>
  );
};

export default ChecklistPage;
