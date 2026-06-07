export default function CustomerProfile({ customer }) {
  return (
    <div className="card mb-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-[16px] bg-[#F3F4F6] text-[20px] font-bold text-[#374151]">
          {customer.initials}
        </div>
        <div>
          <h2 className="text-[24px] font-bold tracking-[-0.5px] text-[#030712]">{customer.name}</h2>
          <p className="mt-1 text-[15px] text-[#6B7280]">{customer.company}</p>
        </div>
      </div>
    </div>
  );
}
