export function SectorChart({ data }: { data: Array<{ sector: string; count: number }> }) {
  const max = Math.max(...data.map((item) => item.count), 1);
  return (
    <div className="grid">
      {data.map((item) => (
        <div key={item.sector}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <strong>{item.sector}</strong>
            <span>{item.count}</span>
          </div>
          <div className="bar" aria-label={`${item.sector}: ${item.count}`}>
            <span style={{ width: `${(item.count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
