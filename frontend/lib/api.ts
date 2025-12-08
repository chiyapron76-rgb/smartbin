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

export async function reportIssue(taskItemId: string, payload: any) {
  return handleResponse(
    await fetch(`${API_URL}/api/tasks/items/${taskItemId}/issue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}

/* ---------------- Issue Reports (Admin) ---------------- */

export async function fetchIssues() {
  return handleResponse(await fetch(`${API_URL}/api/issues`));
}

export async function resolveIssue(id: string) {
  return handleResponse(
    await fetch(`${API_URL}/api/issues/${id}/resolve`, { method: "POST" })
  );
}

/* ---------------- Citizen Reports ---------------- */

export async function createCitizenReport(body: any) {
  return handleResponse(
    await fetch(`${API_URL}/api/citizen-reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  );
}

export async function fetchCitizenReports(device_uuid: string) {
  return handleResponse(
    await fetch(`${API_URL}/api/citizen-reports?device_uuid=${device_uuid}`)
  );
}

export async function fetchAllCitizenReports() {
  return handleResponse(await fetch(`${API_URL}/api/citizen-reports`));
}

export async function updateCitizenReportStatus(id: string, status: string) {
  return handleResponse(
    await fetch(`${API_URL}/api/citizen-reports/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
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
