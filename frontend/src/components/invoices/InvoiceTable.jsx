import { ArrowDown, ArrowUp } from 'lucide-react';
import InvoiceRow from './InvoiceRow';

function SortButton({ active, direction, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-1 ${
        active ? 'text-[var(--accent)]' : 'text-[var(--gray-500)] hover:text-[var(--gray-700)]'
      }`}
    >
      <span className="group-hover:border-b group-hover:border-dotted group-hover:border-[var(--gray-400)]">
        {label}
      </span>
      {active ? (
        direction === 'asc' ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )
      ) : (
        <span className="flex flex-col opacity-30">
          <ArrowUp className="-mb-1 h-2.5 w-2.5" />
          <ArrowDown className="h-2.5 w-2.5" />
        </span>
      )}
    </button>
  );
}

export default function InvoiceTable({
  invoices,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onCustomerOpen
}) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--gray-200)] px-5 py-4">
        <div className="text-[13px] text-[var(--gray-500)]">
          Showing {invoices.length} invoices
        </div>
        <div className="rounded-full border border-[var(--gray-200)] bg-[var(--gray-50)] px-3 py-1 text-[12px] font-medium text-[var(--gray-700)]">
          Sorted by {sortBy === 'issueDate' ? 'latest issue date' : sortBy} {sortOrder === 'asc' ? '↑' : '↓'}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-[var(--gray-50)] shadow-[0_1px_0_var(--gray-200)]">
            <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--gray-500)]">
              <th className="h-10 px-5 align-middle">Invoice</th>
              <th className="h-10 px-5 align-middle">Customer</th>
              <th className="h-10 px-5 text-right align-middle">
                <SortButton
                  label="Amount"
                  active={sortBy === 'amount'}
                  direction={sortOrder}
                  onClick={() => onSort('amount')}
                />
              </th>
              <th className="h-10 px-5 text-center align-middle">Tax%</th>
              <th className="h-10 px-5 text-right align-middle">Total</th>
              <th className="h-10 px-5 align-middle">Status</th>
              <th className="h-10 px-5 align-middle">
                <SortButton
                  label="Due Date"
                  active={sortBy === 'dueDate'}
                  direction={sortOrder}
                  onClick={() => onSort('dueDate')}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <InvoiceRow
                key={invoice._id}
                invoice={invoice}
                onEdit={onEdit}
                onCustomerOpen={onCustomerOpen}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
