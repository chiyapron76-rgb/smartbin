// 🟢 1. URL สำหรับ Backend หลัก (Admin / Tasks / Bins / Dashboard)
// อันนี้ต้องชี้ไปที่ Port 3001 (หรือตาม env ของคุณ)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// 🟢 2. URL สำหรับ Next.js API (Citizen Reports / Mock Data)
// อันนี้ใช้ค่าว่าง เพื่อยิงเข้าหาไฟล์ pages/api/reports.ts ในโปรเจกต์นี้เอง
const NEXT_API_URL = "";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

/* ---------------- Dashboard ---------------- */

export async function fetchDashboardSummary() {
  return handleResponse(await fetch(`${API_URL}/api/dashboard/summary`));
}

export async function fetchZoneStats() {
  return handleResponse(await fetch(`${API_URL}/api/dashboard/zones`));
}

export async function fetchTrends() {
  return handleResponse(await fetch(`${API_URL}/api/dashboard/trends`));
}

export async function fetchDeviceHealth() {
  return handleResponse(await fetch(`${API_URL}/api/dashboard/devices`));
}

export async function fetchRecentAlerts() {
  return handleResponse(await fetch(`${API_URL}/api/dashboard/alerts/recent`));
}

/* ---------------- Bins ---------------- */

export async function fetchBins() {
  return handleResponse(await fetch(`${API_URL}/api/bins`));
}

export async function fetchPublicBins() {
  return handleResponse(await fetch(`${API_URL}/api/bins/public`));
}

export async function fetchAlertsForBin(id: string) {
  return handleResponse(await fetch(`${API_URL}/api/alerts/bin/${id}`));
}
// 🟢 1. ดึงข้อมูลถังขยะแค่ 1 ถัง (ตาม ID)
export async function getBin(id: string) {
  return handleResponse(await fetch(`${API_URL}/api/bins/${id}`));
}

// 🟢 2. อัปเดตข้อมูลถังขยะ
export async function updateBin(id: string, payload: any) {
  return handleResponse(
    await fetch(`${API_URL}/api/bins/${id}`, {
      method: "PATCH", // หรือ PUT แล้วแต่ Backend
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}

// 🟢 เพิ่มฟังก์ชันลบ
export async function deleteBin(id: string) {
  return handleResponse(
    await fetch(`${API_URL}/api/bins/${id}`, {
      method: "DELETE",
    })
  );
}
/* ---------------- Admin Create Bin ---------------- */

export async function createBin(payload: any) {
  return handleResponse(
    await fetch(`${API_URL}/api/bins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}

/* ---------------- Tasks ---------------- */

export async function getTasks() {
  return handleResponse(await fetch(`${API_URL}/api/tasks`));
}

export async function getTask(id: string) {
  return handleResponse(await fetch(`${API_URL}/api/tasks/${id}`));
}

export async function createTask(body: any) {
  return handleResponse(
    await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  );
}

export async function startTask(id: string) {
  return handleResponse(
    await fetch(`${API_URL}/api/tasks/${id}/start`, { method: "POST" })
  );
}

export async function assignTask(id: string, assigned_to: string) {
  return handleResponse(
    await fetch(`${API_URL}/api/tasks/${id}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assigned_to }),
    })
  );
}

export async function completeTaskItem(taskId: string, itemId: string) {
  return handleResponse(
    await fetch(`${API_URL}/api/tasks/items/${itemId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
  );
}

export async function completeTask(id: string) {
  return handleResponse(
    await fetch(`${API_URL}/api/tasks/${id}/complete`, { method: "POST" })
  );
}
// 🟢 ฟังก์ชันลบงาน
export async function deleteTask(id: string) {
  return handleResponse(
    await fetch(`${API_URL}/api/tasks/${id}`, { method: "DELETE" })
  );
}

export async function reportIssue(taskItemId: string, payload: any) {
  return handleResponse(
    await fetch(`${API_URL}/api/tasks/items/${taskItemId}/issue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}

// --- Reports (Officer/Issue) ---
export async function fetchIssues() {
  return handleResponse(await fetch(`${API_URL}/api/reports/issues`));
}

export async function updateIssueStatus(id: string, status: string) {
  return handleResponse(
    await fetch(`${API_URL}/api/reports/issues/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  );
}

/* ---------------- ส่วน Citizen Reports (เชื่อมต่อ Backend จริง) ---------------- */

// 🟢 แก้ไขฟังก์ชันสร้างรายงานให้รองรับรูปภาพ
export async function createCitizenReport(data: any) {
  // หากมีการแนบไฟล์รูปภาพมาด้วย
  if (data.image instanceof File) {
    const formData = new FormData();
    formData.append('bin_id', data.bin_id);
    formData.append('issue_type', data.issue_type);
    formData.append('description', data.description || "");
    formData.append('device_uuid', data.device_uuid);
    formData.append('image', data.image); // 📸 ส่งไฟล์รูปภาพจริง
    
    // พิกัด
    if (data.location_lat) formData.append('location_lat', data.location_lat);
    if (data.location_lng) formData.append('location_lng', data.location_lng);

    return handleResponse(
      await fetch(`${API_URL}/api/citizen-reports`, {
        method: "POST",
        // ⚠️ ห้ามใส่ Content-Type เมื่อใช้ FormData
        body: formData,
      })
    );
  }

  // กรณีไม่มีรูป ให้ส่งแบบ JSON ปกติ (เพื่อความยืดหยุ่น)
  return handleResponse(
    await fetch(`${API_URL}/api/citizen-reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  );
}

// 🟢 2. ดึงประวัติของฉัน (ยิงเข้า Backend 3001)
export async function fetchMyReports(deviceUuid: string) {
  return handleResponse(
    await fetch(`${API_URL}/api/citizen-reports?device_uuid=${deviceUuid}`, {
      method: "GET",
    })
  );
}

// 🟢 3. แอดมินดึงรายงานประชาชน (ยิงเข้า Backend 3001)
export async function fetchCitizenReports() {
  return handleResponse(await fetch(`${API_URL}/api/citizen-reports`));
}

// 🟢 4. แอดมินกดจบงาน (ยิงเข้า Backend 3001)
export async function updateCitizenReportStatus(id: string, status: string) {
  return handleResponse(
    await fetch(`${API_URL}/api/citizen-reports/${id}/status`, { 
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  );
}

// 🟢 5. ลบรายงานของประชาชน (ยิงเข้า Backend 3001)
export async function deleteCitizenReport(id: string) {
  return handleResponse(
    // 🟢 ยิงเข้าหา /api/citizen-reports/ ตามชื่อ Controller หลัก
    await fetch(`${API_URL}/api/citizen-reports/${id}`, {
      method: "DELETE",
    })
  );
}

/* ---------------- App Rating ---------------- */

export async function createAppRating(body: any) {
  return handleResponse(
    await fetch(`${API_URL}/api/app-rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  );
}

export async function fetchAppRatings(device_uuid?: string) {
  const q = device_uuid ? `?device_uuid=${device_uuid}` : "";
  return handleResponse(await fetch(`${API_URL}/api/app-rating${q}`));
}

export async function fetchAppRatingSummary() {
  return handleResponse(await fetch(`${API_URL}/api/app-rating/summary`));
}
// 🟢 เพิ่มฟังก์ชันนี้เพื่อให้หน้าบ้านส่งผลประเมินไปหาหลังบ้านได้
export async function submitReportRating(reportId: string, data: { rating: number; comment?: string; device_uuid: string }) {
  return handleResponse(
    // ยิงไปที่ Path ที่เราตั้งไว้ใน Controller (POST /api/citizen-reports/:id/rate)
    await fetch(`${API_URL}/api/citizen-reports/${reportId}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  );
}
