import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { fetchIssues, resolveIssue } from '../../lib/api';

export default function ReportsPage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchIssues();
      setIssues(data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleResolve(id: string) {
    if (!confirm('Mark this issue as resolved?')) return;
    setResolvingId(id);
    try {
      await resolveIssue(id);
      alert('Resolved');
      await load();
    } finally {
      setResolvingId(null);
    }
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Issue Reports</h1>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="bg-white rounded shadow p-4">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-2">Bin</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Created At</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((it) => (
                  <tr key={it.id} className="border-t">
                    <td className="p-2">{it.bin?.bin_code ?? it.bin_id}</td>
                    <td className="p-2">{it.issue_type}</td>
                    <td className="p-2">{it.description ?? '-'}</td>
                    <td className="p-2">
                      {new Date(it.created_at).toLocaleString()}
                    </td>
                    <td className="p-2">
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded"
                        onClick={() => handleResolve(it.id)}
                        disabled={resolvingId === it.id}
                      >
                        {resolvingId === it.id ? 'Resolving...' : 'Resolve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
