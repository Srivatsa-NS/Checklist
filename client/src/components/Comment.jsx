import React, { useState } from "react";

function Comment({ questionId, comments, setComments }) {
  const [showCommentBox, setShowCommentBox] = useState(false);

  const handleCommentChange = (questionId, comment) => {
    setComments({
      ...comments,
      [questionId]: comment,
    });
  };

  const handleCommentToggle = () => {
    setShowCommentBox(!showCommentBox);
  };

  return (
    <div>
      <button
        className="bg-green-500 text-white py-2 rounded-md px-5 hover:bg-white hover:text-green-500 hover:shadow-xl duration-500"
        onClick={() => handleCommentToggle()}
      >
        Comment
      </button>
      {showCommentBox && (
        <div className="mt-4">
          <textarea
            value={comments[questionId] || ""}
            onChange={(e) => handleCommentChange(questionId,e.target.value)}
            rows="4"
            maxLength="300"
            placeholder="Add your comment"
            className="mt-2 px-32 border w-full rounded-md text-center py-5"
          />
          <button
            onClick={() => handleCommentToggle()}
            className="mt-2 bg-yellow-500 text-white p-2 rounded-md"
          >
            Save & close
          </button>
        </div>
      )}
    </div>
  );
}

export default Comment;
