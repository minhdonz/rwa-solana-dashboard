export default function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-paper p-4">
      <div className="eyebrow">{label}</div>
      <div className="text-xl font-semibold text-navy mt-1.5 tnum">{value}</div>
      {sub && <div className="text-xs text-neutral mt-0.5">{sub}</div>}
    </div>
  );
}
