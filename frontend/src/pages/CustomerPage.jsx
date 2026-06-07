import { ChevronRight, Search } from 'lucide-react';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import client from '../api/client';
import CustomerMetricCard from '../components/customers/CustomerMetricCard';
import CustomerProfile from '../components/customers/CustomerProfile';
import StatusBadge from '../components/invoices/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import SkeletonRow from '../components/shared/SkeletonRow';
import useCustomers from '../hooks/useCustomers';
import { formatCurrency, formatDate } from '../utils/formatters';

function StatusPills({ statusBreakdown }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(statusBreakdown).map(([status, count]) => (
        <div
          key={status}
          className="rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1 text-[13px] text-[#6B7280]"
        >
          <span className="font-semibold text-[#374151]">{status}</span>: {count}
        </div>
      ))}
    </div>
  );
}

export function CustomersListPage() {
  const {
    state: { customers, loading, error },
    fetchCustomers
  } = useCustomers();
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    if (!customers.length) {
      fetchCustomers().catch(() => {});
    }
  }, [customers.length, fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    if (!deferredSearch.trim()) return customers;
    const query = deferredSearch.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) || customer.company.toLowerCase().includes(query)
    );
  }, [customers, deferredSearch]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="text-section">CUSTOMERS</p>
          <h1 className="text-title">Customer Directory</h1>
        </div>
        <label className="relative flex h-9 w-[280px] items-center">
          <Search className="absolute left-3 h-4 w-4 text-[#9CA3AF]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input !pl-9"
            placeholder="Search customers..."
          />
        </label>
      </div>

      {loading ? <SkeletonRow count={4} columns={3} /> : null}

      {!loading && error ? (
        <EmptyState title="Couldn’t load customers" description={error} actionLabel="Try again" onAction={fetchCustomers} />
      ) : null}

      {!loading && !error ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <Link
              key={customer._id}
              to={`/customers/${customer._id}`}
              className="group rounded-xl border border-[#E5E7EB] bg-white p-5 transition-all duration-200 hover:border-[#D1D5DB] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 inline-flex items-center justify-center rounded-lg bg-[#F3F4F6] px-2.5 py-1 text-[11px] font-bold tracking-[0.05em] text-[#374151]">
                    {customer.initials}
                  </div>
                  <h3 className="text-[16px] font-bold text-[#111827] group-hover:text-[#16A34A] transition-colors">
                    {customer.name}
                  </h3>
                  <p className="mt-1 text-[13px] text-[#6B7280]">{customer.company}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CustomerPage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadCustomer() {
      setLoading(true);
      setError('');

      try {
        const [{ data: profileData }, { data: invoiceData }] = await Promise.all([
          client.get(`/customers/${id}`),
          client.get(`/customers/${id}/invoices`, { params: { limit: 50 } })
        ]);

        if (!cancelled) {
          setProfile(profileData);
          setInvoices(invoiceData.data);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(requestError.response?.data?.message || 'Unable to load customer details.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCustomer();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <SkeletonRow count={5} columns={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <EmptyState
          title="Customer details unavailable"
          description={error}
          actionLabel="Back to customers"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  const metricCards = [
    {
      label: 'Total Billed',
      value: formatCurrency(profile.metrics.totalBilled),
    },
    {
      label: 'Total Tax',
      value: formatCurrency(profile.metrics.totalTax),
    },
    {
      label: 'Outstanding',
      value: formatCurrency(profile.metrics.outstanding),
      accent: 'text-[#991B1B]' // If there is outstanding, maybe red? Or just dark. Let's keep it default if none.
    },
    {
      label: 'Total Invoices',
      value: profile.metrics.invoiceCount,
    }
  ];

  return (
    <div className="page">
      <div className="mb-6 flex items-center gap-2 text-[12px] font-medium text-[#6B7280]">
        <Link to="/customers" className="hover:text-[#111827]">
          Customers
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-[#D1D5DB]" />
        <span className="text-[#111827]">{profile.customer.name}</span>
      </div>

      <CustomerProfile customer={profile.customer} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <CustomerMetricCard
            key={card.label}
            label={card.label}
            value={card.value}
            accent={card.value !== '0' && card.label === 'Outstanding' ? card.accent : ''}
          />
        ))}
      </div>

      <div className="card mb-6 p-5">
        <div className="mb-4">
          <p className="text-[14px] font-semibold text-[#111827]">Invoice Status</p>
        </div>
        <StatusPills statusBreakdown={profile.metrics.statusBreakdown} />
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-[#E5E7EB] px-5 py-4">
          <h3 className="text-[15px] font-semibold text-[#111827]">Invoice History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-[#F9FAFB]">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6B7280]">
                <th className="h-10 px-5 align-middle">Invoice</th>
                <th className="h-10 px-5 text-right align-middle">Total</th>
                <th className="h-10 px-5 align-middle">Status</th>
                <th className="h-10 px-5 align-middle">Issue Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id} className="border-b border-[#F3F4F6] last:border-0 hover:bg-[#F9FAFB] transition-colors">
                  <td className="mono h-[52px] px-5 align-middle text-[13px] font-medium text-[#111827]">{invoice.invoiceId}</td>
                  <td className="mono h-[52px] px-5 text-right align-middle text-[13px] font-medium text-[#111827]">{formatCurrency(invoice.total)}</td>
                  <td className="h-[52px] px-5 align-middle">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="mono h-[52px] px-5 align-middle text-[13px] text-[#6B7280]">{formatDate(invoice.issueDate)}</td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={4} className="h-20 text-center text-[13px] text-[#6B7280]">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomerPage;
