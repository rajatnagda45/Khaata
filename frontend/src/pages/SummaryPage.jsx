import SummaryCards from '../components/summary/SummaryCards';
import TopCustomersChart from '../components/summary/TopCustomersChart';
import EmptyState from '../components/shared/EmptyState';
import SkeletonRow from '../components/shared/SkeletonRow';
import useInvoices from '../hooks/useInvoices';
import { useEffect } from 'react';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function SummaryPage() {
  const {
    state: { summary, loading, error },
    fetchSummary
  } = useInvoices();

  useEffect(() => {
    fetchSummary().catch(() => {});
  }, [fetchSummary]);

  if (loading && !summary) {
    return (
      <div className="page">
        <SkeletonRow count={4} columns={4} />
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="page">
        <EmptyState
          title="Summary data unavailable"
          description={error}
          actionLabel="Retry"
          onAction={fetchSummary}
        />
      </div>
    );
  }

  if (!summary) return null;

  const cards = [
    { key: 'billed', label: 'Total Billed', value: formatCurrency(summary.totalBilled) },
    { key: 'tax', label: 'Total Tax', value: formatCurrency(summary.totalTax) },
    { key: 'invoices', label: 'Total Invoices', value: formatNumber(summary.invoiceCount) },
    { key: 'customers', label: 'Total Customers', value: formatNumber(summary.customerCount) }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="text-section">SUMMARY</p>
          <h1 className="text-title">Portfolio Analytics</h1>
        </div>
      </div>

      <div className="mb-6">
        <SummaryCards cards={cards} />
      </div>

      <div className="card mb-6 p-6">
        <div className="mb-4">
          <h3 className="text-[16px] font-bold text-[#111827]">Invoice Status Distribution</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(summary.statusBreakdown).map(([status, count]) => (
            <div
              key={status}
              className="rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1 text-[13px] text-[#6B7280]"
            >
              <span className="font-semibold text-[#374151]">{status}</span>: {count}
            </div>
          ))}
        </div>
      </div>

      <TopCustomersChart data={summary.topCustomers} />
    </div>
  );
}
