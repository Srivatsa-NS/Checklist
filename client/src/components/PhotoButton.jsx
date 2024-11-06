import React, { useState } from "react";

function PhotoButton({ questionId, setPhotos, photos }) {
  const [isPhotoPresent, setIsPhotoPresent] = useState(false);

  const handlePhotoChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhotos({
        ...photos,
        [questionId]:file,
      });
      setIsPhotoPresent(true);
    }
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-white py-2 rounded-lg px-5 hover:bg-white hover:text-blue-500 hover:shadow-xl duration-500"
        onClick={() =>
          document.getElementById(`photoInput-${questionId}`).click()
        }
      >
        {isPhotoPresent ? "Photo uploaded" : "Upload photo"}
      </button>

      <input
        type="file"
        id={`photoInput-${questionId}`}
        style={{ display: "none" }}
        onChange={(event) => handlePhotoChange(event)}
      />
    </div>
  );
}

export default PhotoButton;
