export default function SkeletonRow({ count = 8, columns = 6 }) {
  return (
    <div className="card w-full overflow-hidden">
      <div className="flex h-10 items-center border-b border-[#E5E7EB] bg-[#F9FAFB] px-5">
        <div className="skeleton h-3 w-24"></div>
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={`skeleton-${i}`}
          className="flex h-14 items-center gap-4 border-b border-[#F3F4F6] px-5 last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, j) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={`col-${j}`}
              className="flex-1"
            >
              <div
                className="skeleton h-4"
                style={{ width: `${Math.random() * 40 + 40}%` }}
              ></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
