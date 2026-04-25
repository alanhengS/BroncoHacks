export function Metric({ label, value, sublabel, tone }) {
  const className = `metric${tone ? ` metric-${tone}` : ''}`;
  return (
    <div className={className}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {sublabel && <div className="metric-sublabel">{sublabel}</div>}
    </div>
  );
}
