import { useState, useEffect } from "react";

type Props = {
  open: boolean;
  data: { itemId: string; binId: string } | null;
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
};

export default function IssueModal({ open, data, onClose, onSubmit }: Props) {
  const [issueType, setIssueType] = useState("broken");
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) {
      setIssueType("broken");
      setDescription("");
    }
  }, [open]);

  if (!open || !data) return null;

  async function submit() {
    setSending(true);
    try {
      await onSubmit({
        bin_id: data.binId,
        issue_type: issueType,
        description,
      });

      alert("Reported");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to report issue");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow max-w-md w-full">
        <div className="flex justify-between mb-3">
          <h2 className="text-lg font-semibold">Report Issue</h2>
          <button onClick={onClose}>Close</button>
        </div>

        <div className="mb-3 text-sm">
          <strong>Bin:</strong> {data.binId}
        </div>

        <label className="block mb-2">Issue Type</label>
        <select
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        >
          <option value="broken">Broken</option>
          <option value="blocked">Blocked</option>
          <option value="sensor_error">Sensor Error</option>
          <option value="location_wrong">Location Wrong</option>
          <option value="vandalized">Vandalized</option>
          <option value="others">Others</option>
        </select>

        <label className="block mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="border px-3 py-1 rounded">
            Cancel
          </button>
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-3 py-1 rounded"
            disabled={sending}
          >
            {sending ? "Sending..." : "Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
