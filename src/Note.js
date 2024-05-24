// Note.js
import React from "react";

function Note({ title, content, onClick }) {
  const truncatedContent = content.length > 50 ? content.substring(0, 50) + "..." : content;

  return (
    <div className="bg-white p-4 shadow-md rounded-md cursor-pointer" onClick={onClick}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-gray-700">{truncatedContent}</p>
    </div>
  );
}

export default Note;
