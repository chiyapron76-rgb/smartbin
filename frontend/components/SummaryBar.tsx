// frontend/components/SummaryBar.tsx
import React from 'react';

type Props = {
  total_bins: number;
  counts_by_device_status: Record<string, number>;
  avg_fill: number | null;
  avg_battery: number | null;
  alerts_today: number;
};

export default function SummaryBar(props: Props) {
  const { total_bins, counts_by_device_status, avg_fill, avg_battery, alerts_today } = props;

  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
      <div style={{ padding: 12, borderRadius: 8, background: '#f3f4f6', minWidth: 160 }}>
        <div style={{ fontSize: 12, color: '#374151' }}>Total bins</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{total_bins}</div>
      </div>

      <div style={{ padding: 12, borderRadius: 8, background: '#ecfdf5', minWidth: 160 }}>
        <div style={{ fontSize: 12, color: '#065f46' }}>Active</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{counts_by_device_status.active ?? 0}</div>
      </div>

      <div style={{ padding: 12, borderRadius: 8, background: '#fff7ed', minWidth: 160 }}>
        <div style={{ fontSize: 12, color: '#92400e' }}>Maintenance</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{counts_by_device_status.maintenance ?? 0}</div>
      </div>

      <div style={{ padding: 12, borderRadius: 8, background: '#fff1f2', minWidth: 160 }}>
        <div style={{ fontSize: 12, color: '#7f1d1d' }}>Offline</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{counts_by_device_status.offline ?? 0}</div>
      </div>

      <div style={{ padding: 12, borderRadius: 8, background: '#eef2ff', minWidth: 160 }}>
        <div style={{ fontSize: 12, color: '#3730a3' }}>Avg Fill (%)</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{avg_fill !== null ? `${avg_fill}%` : '—'}</div>
      </div>

      <div style={{ padding: 12, borderRadius: 8, background: '#f8fafc', minWidth: 160 }}>
        <div style={{ fontSize: 12, color: '#0f172a' }}>Avg Battery (V)</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{avg_battery !== null ? `${avg_battery}V` : '—'}</div>
      </div>

      <div style={{ padding: 12, borderRadius: 8, background: '#fef3c7', minWidth: 160 }}>
        <div style={{ fontSize: 12, color: '#92400e' }}>Alerts (today)</div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{alerts_today}</div>
      </div>
    </div>
  );
}
