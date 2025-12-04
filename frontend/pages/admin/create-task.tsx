// pages/admin/create-task.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/shared/Layout";
import { fetchBins, createTask } from "../../lib/api";

export default function CreateTaskPage() {
  const [bins, setBins] = useState<any[]>([]);
  const [selectedBins, setSelectedBins] = useState<string[]>([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("medium");
  const [notes, setNotes] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchBins().then(setBins).catch(console.error);
  }, []);

  const toggleBin = (binCode: string) => {
    setSelectedBins((prev) => (prev.includes(binCode) ? prev.filter(b => b !== binCode) : [...prev, binCode]));
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
      bin_ids: selectedBins, // backend expects bin ids or bin_code depending on API — keep consistent
    };

    try {
      await createTask(payload);
      alert("Task created!");
      router.push("/admin/tasks");
    } catch (e) {
      console.error(e);
      alert("Failed to create task");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Create Task</h1>

      <div className="max-w-xl space-y-4">
        <div>s
          <label className="font-semibold">Assigned To</label>
          <input className="border p-2 w-full" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="collector01" />
        </div>

        <div>
          <label className="font-semibold">Priority</label>
          <select className="border p-2 w-full" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="font-semibold">Notes</label>
          <textarea className="border p-2 w-full" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div>
          <label className="font-semibold block mb-2">Select Bins</label>
          <div className="max-h-64 overflow-y-auto border p-2">
            {bins.map(b => (
              <div key={b.id} className="flex items-center gap-2">
                <input type="checkbox" checked={selectedBins.includes(b.bin_code)} onChange={() => toggleBin(b.bin_code)} />
                <span>{b.bin_code} — Zone {b.area}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={() => router.push("/admin/tasks")} className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded">Cancel</button>
          <button onClick={submit} className="flex-1 bg-green-600 text-white px-4 py-2 rounded">Create Task</button>
        </div>
      </div>
    </Layout>
  );
}