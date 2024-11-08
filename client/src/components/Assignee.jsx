import React from "react";

function Assignee({ assignedTo, handleAssignedToChange}) {
  return (
    <div>
      <label
        className="block text-lg font-semibold mt-4 mb-2"
        htmlFor="assignedTo"
      >
        Assignee
      </label>
      <input
        id="assignedTo"
        type="text"
        value={assignedTo}
        onChange={handleAssignedToChange}
        className="w-full p-2 border rounded"
        placeholder="Enter asignee name"
        required
      />
    </div>
  );
}

export default Assignee;
