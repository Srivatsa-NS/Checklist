import React from "react";
import Response from "./Response";
import PhotoButton from "./PhotoButton";
import Comment from "./Comment";

function ChecklistItems({
  question,
  questionId,
  responses,
  setResponses,
  comments,
  setComments,
  photos,
  setPhotos,
}) {
  return (
    <div>
      <div
        key={questionId}
        className="p-4 border border-gray-200 rounded-md space-y-8"
      >
        <p className="font-semibold text-xl">{question}</p>
        <Response
          questionId={questionId}
          responses={responses}
          setResponses={setResponses}
        />
        <div className="flex space-x-4 mt-4">
          <PhotoButton
            questionId={questionId}
            setPhotos={setPhotos}
            photos={photos}
          />
          <Comment
            questionId={questionId}
            comments={comments}
            setComments={setComments}
          />
        </div>
      </div>
    </div>
  );
}

export default ChecklistItems;
