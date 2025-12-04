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


export async function fetchAlertsForBin(id: string) {
  return handleResponse(await fetch(`${API_URL}/api/alerts/bin/${id}`));
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
  const r = await fetch(`${API_URL}/api/tasks/items/${taskItemId}/issue`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(r);
}

export async function fetchIssues() {
  const res = await fetch(`${API_URL}/api/issues`);
  return handleResponse(res);
}

export async function resolveIssue(id: string) {
  const res = await fetch(`${API_URL}/api/issues/${id}/resolve`, {
    method: "POST",
  });
  return handleResponse(res);
}

export async function createBin(payload: any) {
  const res = await fetch(`${API_URL}/api/bins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}