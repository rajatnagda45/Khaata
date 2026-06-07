import { Search, Plus } from 'lucide-react';
import { startTransition } from 'react';
import { NavLink } from 'react-router-dom';
import useInvoices from '../../hooks/useInvoices';

export default function Topbar() {
  const { state: { filters }, setFilters } = useInvoices();

  return (
    <header className="sticky top-0 z-50 flex h-[56px] items-center border-b border-[#E5E7EB] bg-white px-6">
      <div className="flex w-full max-w-[1200px] mx-auto items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo mark */}
          <a href="/landing.html" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#030712] text-xs font-extrabold tracking-[-0.5px] text-white">
              ₹
            </div>
            <span className="text-base font-extrabold tracking-[-0.5px] text-[#030712]">
              Khaata
            </span>
          </a>

          {/* Tab navigation */}
          <nav className="flex h-[56px] gap-8">
            <NavLink
              to="/invoices"
              className={({ isActive }) =>
                `flex h-full items-center border-b-2 text-sm transition-colors ${
                  isActive
                    ? 'border-[#16A34A] font-semibold text-[#030712]'
                    : 'border-transparent font-medium text-[#6B7280] hover:text-[#111827]'
                }`
              }
            >
              Invoices
            </NavLink>
            <NavLink
              to="/customers"
              className={({ isActive }) =>
                `flex h-full items-center border-b-2 text-sm transition-colors ${
                  isActive
                    ? 'border-[#16A34A] font-semibold text-[#030712]'
                    : 'border-transparent font-medium text-[#6B7280] hover:text-[#111827]'
                }`
              }
            >
              Customers
            </NavLink>
            <NavLink
              to="/summary"
              className={({ isActive }) =>
                `flex h-full items-center border-b-2 text-sm transition-colors ${
                  isActive
                    ? 'border-[#16A34A] font-semibold text-[#030712]'
                    : 'border-transparent font-medium text-[#6B7280] hover:text-[#111827]'
                }`
              }
            >
              Summary
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <label className="relative flex h-9 w-[240px] items-center">
            <Search className="absolute left-3 h-4 w-4 text-[#9CA3AF]" />
            <input
              value={filters.search}
              onChange={(event) =>
                startTransition(() => {
                  setFilters({ search: event.target.value });
                })
              }
              className="h-full w-full rounded-lg border border-[#D1D5DB] bg-white pl-9 pr-3 text-[13px] text-[#111827] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#16A34A] focus:shadow-[0_0_0_3px_rgba(22,163,74,0.1)]"
              placeholder="Search invoices..."
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2">⌘K</kbd>
          </label>
          <button
            type="button"
            className="btn-primary"
            onClick={() => window.dispatchEvent(new CustomEvent('open-new-invoice'))}
          >
            <Plus className="h-4 w-4" />
            New Invoice
          </button>
        </div>
      </div>
    </header>
  );
}
