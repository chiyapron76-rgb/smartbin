import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { fetchBins, createTask } from "../../lib/api";

export default function CreateTaskPage() {
  const [bins, setBins] = useState([]);
  const [selectedBins, setSelectedBins] = useState<string[]>([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("medium");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchBins().then(setBins);
  }, []);

  const toggleBin = (binCode: string) => {
    setSelectedBins((prev) =>
      prev.includes(binCode)
        ? prev.filter((b) => b !== binCode)
        : [...prev, binCode]
    );
  };

  const submit = async () => {
    if (selectedBins.length === 0) {
      alert("Please select at least 1 bin");
      return;
    }

    const payload = {
      created_by: "admin",
      assigned_to: assignedTo || null,
      priority,
      notes,
      bin_ids: selectedBins,   // ส่ง bin_code ไม่ใช่ id
    };

    await createTask(payload);
    alert("Task created!");
    window.location.href = "/tasks";
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Create Task</h1>

      <div className="space-y-4 max-w-xl">
        <div>
          <label className="font-semibold">Assigned To</label>
          <input
            className="border p-2 w-full"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="collector01"
          />
        </div>

        <div>
          <label className="font-semibold">Priority</label>
          <select
            className="border p-2 w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="font-semibold">Notes</label>
          <textarea
            className="border p-2 w-full"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold block mb-2">Select Bins</label>
          <div className="max-h-64 overflow-y-auto border p-2">
            {bins.map((bin: any) => (
              <div key={bin.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBins.includes(bin.bin_code)}
                  onChange={() => toggleBin(bin.bin_code)}
                />
                <span>{bin.bin_code} — Zone {bin.area}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={submit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Task
        </button>
      </div>
    </Layout>
  );
}
