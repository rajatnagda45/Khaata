export default function CustomerMetricCard({ label, value, accent }) {
  return (
    <div className="card p-5">
      <p className="text-[13px] font-medium text-[#6B7280]">{label}</p>
      <p className={`mono mt-2 text-[24px] font-semibold text-[#111827] ${accent || ''}`}>
        {value}
      </p>
    </div>
  );
}
