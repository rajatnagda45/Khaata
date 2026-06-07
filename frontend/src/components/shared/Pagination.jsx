import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

function buildPages(currentPage, totalPages) {
  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  if (start > 1) {
    pages.push(1);
    if (start > 2) {
      pages.push('start-ellipsis');
    }
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) {
      pages.push('end-ellipsis');
    }
    pages.push(totalPages);
  }

  return pages;
}

export default function Pagination({ page, limit, total, totalPages, onPageChange }) {
  const pages = buildPages(page, totalPages);
  const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="text-[13px] text-[var(--gray-500)]">
        Showing <span className="font-semibold text-[var(--gray-950)]">{rangeStart}</span> to{' '}
        <span className="font-semibold text-[var(--gray-950)]">{rangeEnd}</span> of{' '}
        <span className="font-semibold text-[var(--gray-950)]">{total}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="btn-secondary mr-2 !h-[30px] !px-2.5 !text-[12px]"
        >
          <ChevronLeft className="mr-1 h-3.5 w-3.5" />
          Prev
        </button>

        {pages.map((item) =>
          typeof item === 'number' ? (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={`flex h-7 min-w-[28px] items-center justify-center px-1.5 text-[13px] font-medium transition-colors ${
                item === page
                  ? 'rounded-md bg-[var(--gray-950)] text-white'
                  : 'text-[var(--gray-700)] hover:underline'
              }`}
            >
              {item}
            </button>
          ) : (
            <span
              key={item}
              className="flex h-7 w-7 items-center justify-center text-[var(--gray-400)]"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="btn-secondary ml-2 !h-[30px] !px-2.5 !text-[12px]"
        >
          Next
          <ChevronRight className="ml-1 h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
