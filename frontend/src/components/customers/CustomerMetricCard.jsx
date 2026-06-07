export default function CustomerMetricCard({ label, value, accent }) {
  return (
    <div className="card p-5">
      <p className="text-[13px] font-medium text-[var(--gray-500)]">{label}</p>
      <p className={`mono mt-2 text-[24px] font-semibold text-[var(--gray-900)] ${accent || ''}`}>
        {value}
      </p>
    </div>
  );
}
