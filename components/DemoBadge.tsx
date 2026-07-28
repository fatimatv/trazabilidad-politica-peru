export function DemoBadge({ label = "DEMO" }: { label?: string }) {
  return <span className="tag warn">{label}</span>;
}
