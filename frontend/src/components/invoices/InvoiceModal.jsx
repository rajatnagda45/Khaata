import { Search, X } from 'lucide-react';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  computeInvoicePreview,
  formatCurrency,
  formatInputDate
} from '../../utils/formatters';

const taxRates = [0, 3, 5, 18, 28];
const statuses = ['Draft', 'Sent', 'Unpaid', 'Overdue', 'Paid', 'Void'];

function buildInitialState(invoice) {
  if (!invoice) {
    const today = new Date().toISOString().slice(0, 10);
    return {
      customerId: '',
      company: '',
      amount: '',
      taxRate: '18',
      issueDate: today,
      dueDate: today,
      status: 'Draft'
    };
  }

  return {
    customerId: invoice.customerId || '',
    company: invoice.company || '',
    amount: String(invoice.amount ?? ''),
    taxRate: String(invoice.taxRate ?? 18),
    issueDate: formatInputDate(invoice.issueDate),
    dueDate: formatInputDate(invoice.dueDate),
    status: invoice.status || 'Draft'
  };
}

function validate(values) {
  const nextErrors = {};

  if (!values.customerId) nextErrors.customerId = 'Select a customer.';
  if (!values.amount || Number(values.amount) <= 0) nextErrors.amount = 'Amount must be greater than 0.';
  if (!values.issueDate) nextErrors.issueDate = 'Issue date is required.';
  if (!values.dueDate) nextErrors.dueDate = 'Due date is required.';
  if (values.issueDate && values.dueDate && values.dueDate < values.issueDate) {
    nextErrors.dueDate = 'Due date must be on or after issue date.';
  }

  return nextErrors;
}

export default function InvoiceModal({
  open,
  mode,
  invoice,
  customers,
  busy,
  onClose,
  onSave
}) {
  const [formValues, setFormValues] = useState(buildInitialState(invoice));
  const [customerQuery, setCustomerQuery] = useState(invoice?.customer || '');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setFormValues(buildInitialState(invoice));
    setCustomerQuery(invoice?.customer || '');
  }, [open, invoice]);

  useEffect(() => {
    if (!open) return undefined;
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  const deferredQuery = useDeferredValue(customerQuery);
  const filteredCustomers = useMemo(() => {
    if (!deferredQuery.trim()) return customers;
    const query = deferredQuery.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) || customer.company.toLowerCase().includes(query)
    );
  }, [customers, deferredQuery]);

  const errors = validate(formValues);
  const preview = computeInvoicePreview(formValues.amount, formValues.taxRate);
  const isValid = Object.keys(errors).length === 0;

  const handleCustomerSelect = (customer) => {
    setFormValues((current) => ({
      ...current,
      customerId: customer._id,
      company: customer.company
    }));
    setCustomerQuery(customer.name);
    setMenuOpen(false);
  };

  const handleFieldChange = (field) => (event) => {
    const { value } = event.target;
    setFormValues((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid) return;

    await onSave({
      customerId: formValues.customerId,
      amount: Number(formValues.amount),
      taxRate: Number(formValues.taxRate),
      issueDate: formValues.issueDate,
      dueDate: formValues.dueDate,
      status: formValues.status
    });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div className="animate-modal-in flex max-h-[90vh] w-full max-w-[480px] flex-col overflow-y-auto rounded-[16px] bg-[var(--white)] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        <div className="mb-6 flex items-center justify-between border-b border-[var(--gray-100)] pb-4">
          <h2 className="text-[18px] font-bold text-[var(--gray-950)]">
            {mode === 'create' ? 'New Invoice' : 'Edit Invoice'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--gray-500)] transition-colors hover:bg-[var(--gray-100)] hover:text-[var(--gray-900)]"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="input-label">
              Customer <span className="text-[var(--status-overdue-text)]">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-[var(--gray-400)]" />
              </div>
              <input
                value={customerQuery}
                onChange={(event) => {
                  setCustomerQuery(event.target.value);
                  setMenuOpen(true);
                  setFormValues((current) => ({
                    ...current,
                    customerId: '',
                    company: ''
                  }));
                }}
                onFocus={() => setMenuOpen(true)}
                onBlur={() => window.setTimeout(() => setMenuOpen(false), 150)}
                placeholder="Search customer..."
                className="input pl-9"
              />
              {menuOpen ? (
                <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-[var(--gray-200)] bg-[var(--white)] py-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                  {filteredCustomers.length ? (
                    filteredCustomers.map((customer) => (
                      <button
                        key={customer._id}
                        type="button"
                        onClick={() => handleCustomerSelect(customer)}
                        className="flex w-full flex-col px-3 py-2 text-left hover:bg-[var(--gray-50)]"
                      >
                        <span className="text-[14px] font-semibold text-[var(--gray-900)]">{customer.name}</span>
                        <span className="text-[12px] text-[var(--gray-500)]">{customer.company}</span>
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-[13px] text-[var(--gray-500)]">No matching customers.</p>
                  )}
                </div>
              ) : null}
            </div>
            {errors.customerId ? <p className="text-[12px] text-[var(--status-overdue-text)]">{errors.customerId}</p> : null}
          </div>

          <div className="space-y-1.5">
            <label className="input-label">Company</label>
            <input value={formValues.company} readOnly className="input bg-[var(--gray-50)] text-[var(--gray-500)]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="input-label">
                Amount <span className="text-[var(--status-overdue-text)]">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formValues.amount}
                onChange={handleFieldChange('amount')}
                className="input mono"
                placeholder="0.00"
              />
              {errors.amount ? <p className="text-[12px] text-[var(--status-overdue-text)]">{errors.amount}</p> : null}
            </div>

            <div className="space-y-1.5">
              <label className="input-label">
                Tax Rate <span className="text-[var(--status-overdue-text)]">*</span>
              </label>
              <div className="flex flex-wrap gap-[6px]">
                {taxRates.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setFormValues((c) => ({ ...c, taxRate: String(rate) }))}
                    className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                      String(rate) === formValues.taxRate
                        ? 'border-[1.5px] border-[var(--accent)] bg-[#F0FDF4] text-[#166534]'
                        : 'border border-[var(--gray-300)] bg-[var(--white)] text-[var(--gray-700)] hover:bg-[var(--gray-50)]'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="input-label">
                Issue Date <span className="text-[var(--status-overdue-text)]">*</span>
              </label>
              <input
                type="date"
                value={formValues.issueDate}
                onChange={handleFieldChange('issueDate')}
                className="input mono"
              />
              {errors.issueDate ? <p className="text-[12px] text-[var(--status-overdue-text)]">{errors.issueDate}</p> : null}
            </div>

            <div className="space-y-1.5">
              <label className="input-label">
                Due Date <span className="text-[var(--status-overdue-text)]">*</span>
              </label>
              <input
                type="date"
                value={formValues.dueDate}
                onChange={handleFieldChange('dueDate')}
                className="input mono"
              />
              {errors.dueDate ? <p className="text-[12px] text-[var(--status-overdue-text)]">{errors.dueDate}</p> : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="input-label">
              Status <span className="text-[var(--status-overdue-text)]">*</span>
            </label>
            <select value={formValues.status} onChange={handleFieldChange('status')} className="select">
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex gap-6 rounded-lg border border-[var(--gray-200)] bg-[var(--gray-50)] px-4 py-3.5">
            <span className="mono text-[14px] font-semibold text-[var(--gray-950)]">
              Tax: {formatCurrency(preview.tax)}
            </span>
            <span className="mono text-[14px] font-semibold text-[var(--gray-950)]">
              Total: {formatCurrency(preview.total)}
            </span>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={!isValid || busy} className="btn-primary">
              {busy ? 'Saving...' : 'Save Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
