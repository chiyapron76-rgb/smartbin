import React from "react";

export default function TaskItemRow({ item, onComplete, onReport }) {
  return (
    <tr className="border-t">
      <td className="p-2">{item.order}</td>
      <td className="p-2">{item.bin?.bin_code}</td>
      <td className="p-2 capitalize">{item.status}</td>
      <td className="p-2">
        {item.completed_at
          ? new Date(item.completed_at).toLocaleString()
          : "-"}
      </td>

      <td className="p-2 flex gap-2">
        {item.status !== "completed" && (
          <button
            className="px-2 py-1 bg-green-600 text-white rounded text-xs"
            onClick={() => onComplete(item.id)}
          >
            Complete
          </button>
        )}

        <button
          className="px-3 py-1 bg-red-600 text-white rounded"
          onClick={() =>
            onReport({
              itemId: item.id,
              binId: item.bin_id,     // ✔ FIX ตรงนี้
            })
          }
        >
          Report Issue
        </button>
      </td>
    </tr>
  );
}
