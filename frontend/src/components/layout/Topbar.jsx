import { Search, Plus, Moon, Sun } from 'lucide-react';
import { startTransition, useState, useLayoutEffect } from 'react';
import { NavLink } from 'react-router-dom';
import useInvoices from '../../hooks/useInvoices';

export default function Topbar() {
  const { state: { filters }, setFilters } = useInvoices();
  const [theme, setTheme] = useState('light');

  useLayoutEffect(() => {
    const saved = localStorage.getItem('app-theme') || 'light';
    setTheme(saved);
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-[56px] items-center border-b border-[var(--border-default)] bg-[var(--white)] px-6">
      <div className="flex w-full max-w-[1200px] mx-auto items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo mark */}
          <a href="/landing.html" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--gray-950)] text-xs font-extrabold tracking-[-0.5px] text-[var(--white)]">
              ₹
            </div>
            <span className="text-base font-extrabold tracking-[-0.5px] text-[var(--gray-950)]">
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
                    ? 'border-[var(--accent)] font-semibold text-[var(--gray-950)]'
                    : 'border-transparent font-medium text-[var(--gray-500)] hover:text-[var(--gray-900)]'
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
                    ? 'border-[var(--accent)] font-semibold text-[var(--gray-950)]'
                    : 'border-transparent font-medium text-[var(--gray-500)] hover:text-[var(--gray-900)]'
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
                    ? 'border-[var(--accent)] font-semibold text-[var(--gray-950)]'
                    : 'border-transparent font-medium text-[var(--gray-500)] hover:text-[var(--gray-900)]'
                }`
              }
            >
              Summary
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <label className="relative flex h-9 w-[240px] items-center">
            <Search className="absolute left-3 h-4 w-4 text-[var(--gray-400)]" />
            <input
              value={filters.search}
              onChange={(event) =>
                startTransition(() => {
                  setFilters({ search: event.target.value });
                })
              }
              className="h-full w-full rounded-lg border border-[var(--border-strong)] bg-[var(--white)] pl-9 pr-3 text-[13px] text-[var(--gray-900)] outline-none transition-colors placeholder:text-[var(--gray-400)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(22,163,74,0.1)]"
              placeholder="Search invoices..."
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2">⌘K</kbd>
          </label>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--gray-300)] text-[var(--gray-500)] transition-colors hover:bg-[var(--gray-100)] dark:border-[var(--gray-700)] dark:text-[var(--gray-400)] dark:hover:bg-[var(--gray-800)]"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
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
