export async function fetchBins(apiUrl: string) {
  const res = await fetch(`${apiUrl}/api/bins`);
  return res.json();
}
