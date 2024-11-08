import React from "react";

function Question({ question, questionNumber, handleQuestionChange}) {
  return (
    <div>
      <label className="block text-lg font-semibold mb-2" htmlFor="question">
        Question {questionNumber}
      </label>
      <textarea
        id="question"
        value={question}
        onChange={handleQuestionChange}
        className="w-full p-2 border rounded"
        maxLength="300"
        placeholder="Enter your question here"
        rows="4"
        required
      />
    </div>
  );
}

export default Question;
