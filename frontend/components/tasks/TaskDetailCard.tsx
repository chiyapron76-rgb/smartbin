import React, { useState } from "react";

interface TaskDetailProps {
  task: any;
  // onAssign: (collector: string) => void;
  onStart: () => void;
  onComplete: () => void;
  actionLoading: boolean;
}

export default function TaskDetailCard({
  task,
  // onAssign,
  onStart,
  onComplete,
  actionLoading
}: TaskDetailProps) {

  const [assignTo, setAssignTo] = useState("");

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex justify-between items-start">
        
        {/* LEFT SIDE */}
        <div>
          <h2 className="text-xl font-bold mb-1">{task.id}</h2>

          <div className="text-sm text-gray-600 mb-2">
            Status: <strong>{task.status}</strong>
          </div>

          {/* <div className="text-sm text-gray-700 mb-1">
            Assigned to: <strong>{task.assigned_to || "-"}</strong>
          </div> */}

          <div className="text-sm text-gray-700 mb-1">
            Priority: <strong>{task.priority}</strong>
          </div>

          <div className="text-sm text-gray-700 mb-1">
            Notes: {task.notes || "-"}
          </div>
        </div>

        {/* RIGHT SIDE BUTTONS */}
        <div className="flex flex-col gap-2">

          {/* ASSIGN */}
          {/* <div className="flex gap-2">
            <input
              className="border p-1 rounded"
              placeholder="collector id"
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
            />

            <button
              className="px-3 py-1 bg-indigo-600 text-white rounded"
              onClick={() => onAssign(assignTo)}
              disabled={actionLoading}
            >
              Assign
            </button>
          </div> */}

          {/* START + COMPLETE */}
          <div className="flex gap-2">

            {/* Start Task */}
            <button
              className="px-3 py-1 bg-green-600 text-white rounded disabled:bg-gray-400"
              onClick={onStart}
              disabled={actionLoading || task.status !== "pending"}
            >
              Start Task
            </button>

            {/* Complete Task */}
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400"
              onClick={onComplete}
              disabled={actionLoading || task.status !== "in_progress"}
            >
              Complete Task
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
