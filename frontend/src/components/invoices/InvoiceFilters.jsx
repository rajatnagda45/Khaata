import { startTransition } from 'react';

const statusOptions = ['', 'Sent', 'Unpaid', 'Overdue', 'Paid', 'Void', 'Draft'];
const taxRateOptions = ['', '0', '3', '5', '18', '28'];

export default function InvoiceFilters({
  filters,
  activeFilterCount,
  onFilterChange,
  onClear
}) {
  const handleChange = (field) => (event) => {
    const { value } = event.target;
    startTransition(() => {
      onFilterChange({ [field]: value });
    });
  };

  return (
    <div className="card mb-6 p-5">
      <div className="mb-4">
        <label className="relative flex w-full items-center">
          <span className="absolute left-3 text-[14px]">🔍</span>
          <input
            value={filters.search}
            onChange={handleChange('search')}
            className="input !pl-9"
            placeholder="Search invoice ID, customer or company..."
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[140px]">
          <span className="input-label">Status</span>
          <select value={filters.status} onChange={handleChange('status')} className="select">
            {statusOptions.map((status) => (
              <option key={status || 'all-statuses'} value={status}>
                {status ? status : 'All Statuses'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <span className="input-label">Tax Rate</span>
          <select value={filters.taxRate} onChange={handleChange('taxRate')} className="select">
            {taxRateOptions.map((taxRate) => (
              <option key={taxRate || 'all-rates'} value={taxRate}>
                {taxRate ? `${taxRate}%` : 'All Rates'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <span className="input-label">Issue From</span>
          <input
            type="date"
            value={filters.issueDateFrom}
            onChange={handleChange('issueDateFrom')}
            className="input mono"
          />
        </div>

        <div className="flex-1 min-w-[140px]">
          <span className="input-label">Issue To</span>
          <input
            type="date"
            value={filters.issueDateTo}
            onChange={handleChange('issueDateTo')}
            className="input mono"
          />
        </div>

        <div className="flex-1 min-w-[140px]">
          <span className="input-label">Due From</span>
          <input
            type="date"
            value={filters.dueDateFrom}
            onChange={handleChange('dueDateFrom')}
            className="input mono"
          />
        </div>

        <div className="flex-1 min-w-[140px]">
          <span className="input-label">Due To</span>
          <input
            type="date"
            value={filters.dueDateTo}
            onChange={handleChange('dueDateTo')}
            className="input mono"
          />
        </div>
      </div>

      {activeFilterCount > 0 && (
        <div className="mt-4 flex items-center justify-end gap-3">
          <span className="text-[13px] font-medium text-[var(--gray-500)]">
            ● {activeFilterCount} active
          </span>
          <button type="button" onClick={onClear} className="btn-ghost">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
