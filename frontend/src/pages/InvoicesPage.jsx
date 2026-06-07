import { Plus } from 'lucide-react';
import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceFilters from '../components/invoices/InvoiceFilters';
import InvoiceModal from '../components/invoices/InvoiceModal';
import InvoiceTable from '../components/invoices/InvoiceTable';
import EmptyState from '../components/shared/EmptyState';
import Pagination from '../components/shared/Pagination';
import SkeletonRow from '../components/shared/SkeletonRow';
import useInvoices from '../hooks/useInvoices';

function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-slide-up flex items-center gap-3 rounded-lg px-4 py-3 text-[13px] font-medium shadow-[0_4px_12px_rgba(0,0,0,0.15)] ${
            toast.variant === 'success'
              ? 'bg-[#030712] text-white'
              : 'border border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]'
          }`}
        >
          <div className="flex-1">
            {toast.title}
            {toast.description && <span className="ml-1 opacity-80">- {toast.description}</span>}
          </div>
          <button type="button" onClick={() => onDismiss(toast.id)} className="opacity-80 hover:opacity-100">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default function InvoicesPage() {
  const navigate = useNavigate();
  const {
    state: { invoices, pagination, filters, customers, loading, error },
    activeFilterCount,
    fetchInvoices,
    fetchCustomers,
    setFilters,
    resetFilters,
    setPage,
    createInvoice,
    updateInvoice
  } = useInvoices();

  const [modalState, setModalState] = useState({ open: false, mode: 'create', invoice: null });
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);

  const deferredSearch = useDeferredValue(filters.search);

  const queryParams = useMemo(
    () => ({
      page: pagination.page,
      limit: pagination.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      search: deferredSearch,
      status: filters.status,
      taxRate: filters.taxRate,
      issueDateFrom: filters.issueDateFrom,
      issueDateTo: filters.issueDateTo,
      dueDateFrom: filters.dueDateFrom,
      dueDateTo: filters.dueDateTo
    }),
    [deferredSearch, filters, pagination.limit, pagination.page]
  );

  useEffect(() => {
    fetchInvoices(queryParams).catch(() => {});
  }, [fetchInvoices, queryParams]);

  useEffect(() => {
    if (!customers.length) {
      fetchCustomers().catch(() => {});
    }
  }, [customers.length, fetchCustomers]);

  useEffect(() => {
    const handleOpenModal = () => setModalState({ open: true, mode: 'create', invoice: null });
    window.addEventListener('open-new-invoice', handleOpenModal);
    return () => window.removeEventListener('open-new-invoice', handleOpenModal);
  }, []);

  const pushToast = useCallback((variant, title, description) => {
    const toastId = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id: toastId, variant, title, description }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== toastId));
    }, 3000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const targetTag = event.target.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag)) return;
      if (event.key.toLowerCase() === 'n') {
        setModalState({ open: true, mode: 'create', invoice: null });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSort = (field) => {
    const nextOrder = filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    setFilters({ sortBy: field, sortOrder: nextOrder });
  };

  const handleModalSave = async (payload) => {
    setSaving(true);
    try {
      if (modalState.mode === 'create') {
        await createInvoice(payload);
        pushToast('success', 'Invoice created', '');
      } else if (modalState.invoice?._id) {
        await updateInvoice(modalState.invoice._id, payload);
        pushToast('success', 'Invoice updated', '');
      }
      setModalState({ open: false, mode: 'create', invoice: null });
      await fetchInvoices(queryParams);
    } catch (saveError) {
      pushToast('error', 'Unable to save invoice', saveError.response?.data?.message || 'Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="text-section">INVOICES</p>
          <h1 className="text-title">Invoices</h1>
        </div>
        <button
          type="button"
          onClick={() => setModalState({ open: true, mode: 'create', invoice: null })}
          className="btn-primary group"
        >
          <Plus className="h-4 w-4" />
          <span>New Invoice</span>
          <kbd className="ml-1 hidden border-white/20 bg-black/20 text-white/80 group-hover:inline-block">
            N
          </kbd>
        </button>
      </div>

      <InvoiceFilters
        filters={filters}
        activeFilterCount={activeFilterCount}
        onFilterChange={setFilters}
        onClear={resetFilters}
      />

      {loading ? <SkeletonRow count={8} columns={7} /> : null}

      {!loading && error ? (
        <EmptyState
          title="Couldn’t load invoices"
          description={error}
          actionLabel="Try again"
          onAction={() => fetchInvoices(queryParams)}
        />
      ) : null}

      {!loading && !error && !invoices.length ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3F4F6] text-[22px]">
            🔍
          </div>
          <p className="mb-1 text-[15px] font-semibold text-[#111827]">No invoices found</p>
          <p className="mb-5 text-[13px] text-[#9CA3AF]">Try adjusting your filters or search terms</p>
          <button type="button" onClick={() => startTransition(() => resetFilters())} className="btn-secondary">
            Clear all filters
          </button>
        </div>
      ) : null}

      {!loading && !error && invoices.length ? (
        <>
          <InvoiceTable
            invoices={invoices}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSort={handleSort}
            onEdit={(invoice) => setModalState({ open: true, mode: 'edit', invoice })}
            onCustomerOpen={(invoice) => navigate(`/customers/${invoice.customerId}`)}
          />
          <Pagination
            page={pagination.page}
            limit={pagination.limit}
            total={pagination.total}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      ) : null}

      <InvoiceModal
        open={modalState.open}
        mode={modalState.mode}
        invoice={modalState.invoice}
        customers={customers}
        busy={saving}
        onClose={() => setModalState({ open: false, mode: 'create', invoice: null })}
        onSave={handleModalSave}
      />

      <ToastStack
        toasts={toasts}
        onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))}
      />
    </div>
  );
}
