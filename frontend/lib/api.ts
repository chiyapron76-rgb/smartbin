const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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

// --- Citizen Reports ---
export async function fetchCitizenReports() {
  // สมมติว่ามี Endpoint นี้ (ถ้ายังไม่มี เดี๋ยวผมมีโค้ด Backend แถมให้ด้านล่างครับ)
  return handleResponse(await fetch(`${API_URL}/api/reports/citizen`)); 
}

export async function updateCitizenReportStatus(id: string, status: string) {
  return handleResponse(
    await fetch(`${API_URL}/api/reports/citizen/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
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
