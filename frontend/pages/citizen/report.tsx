import { useRouter } from "next/router";
import { useState } from "react";
import { createCitizenReport } from "../../lib/api";

const issueTypes = [
  "full",
  "dirty",
  "smelly",
  "broken",
  "misplaced",
  "others",
];

export default function CitizenReportForm() {
  const router = useRouter();
  const bin_id = router.query.bin_id as string;

  const [issue_type, setIssueType] = useState("full");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    const device_uuid =
      localStorage.getItem("device_uuid") || "guest-device";

    await createCitizenReport({
      bin_id,
      issue_type,
      description,
      device_uuid,
    });

    alert("ส่งเรื่องเรียบร้อยแล้ว!");

    // >>> Redirect ไปหน้าให้ดาวทันที
    router.push(`/citizen/rate?device_uuid=${device_uuid}`);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">แจ้งปัญหา</h1>

      <label>ประเภทปัญหา</label>
      <select
        className="block w-full border p-2 mb-3"
        value={issue_type}
        onChange={(e) => setIssueType(e.target.value)}
      >
        {issueTypes.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <label>รายละเอียดเพิ่มเติม</label>
      <textarea
        className="block w-full border p-2 mb-3"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        className="px-4 py-2 bg-green-600 text-white rounded"
        onClick={handleSubmit}
      >
        ส่งเรื่อง
      </button>
    </div>
  );
}
