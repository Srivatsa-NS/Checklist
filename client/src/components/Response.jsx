import React from "react";

function Response({ questionId, responses, setResponses }) {
  const handleResponseChange = (questionId, response) => {
    setResponses({
      ...responses,
      [questionId]: response,
    });
  };

  return (
    <div>
      <div className="flex items-center mt-2">
        <label className="mr-2">Response:</label>
        <div className="flex space-x-7 ml-5">
          {["Yes", "No", "N/A"].map((response) => (
            <button
              key={response}
              onClick={() => handleResponseChange(questionId, response)}
              className={`py-2 px-6 border duration-500 rounded-md hover:bg-blue-500 hover:text-white shadow-xl ${
                responses[questionId] === response
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {response}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Response;
