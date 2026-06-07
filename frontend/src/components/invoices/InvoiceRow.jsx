import { AlertTriangle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatCurrency, formatDate, isOverdue } from '../../utils/formatters';

export default function InvoiceRow({ invoice, onEdit, onCustomerOpen }) {
  const overdue = isOverdue(invoice.dueDate, invoice.status);

  return (
    <tr 
      className="invoice-row group cursor-pointer bg-[var(--white)] transition-colors duration-150 hover:bg-[var(--gray-50)]"
    >
      <td className="h-[56px] border-b border-[var(--gray-100)] border-l-[2px] border-l-transparent px-5 align-middle group-hover:border-l-[var(--accent)]">
        <button
          type="button"
          onClick={() => onEdit(invoice)}
          className="mono text-[13px] font-medium text-[var(--gray-950)] hover:underline"
        >
          {invoice.invoiceId}
        </button>
      </td>
      <td className="h-[56px] border-b border-[var(--gray-100)] px-5 align-middle">
        <button
          type="button"
          onClick={() => onCustomerOpen(invoice)}
          className="text-left hover:text-[var(--accent)]"
        >
          <span className="block text-[14px] font-medium text-[var(--gray-900)] transition-colors hover:text-[var(--accent)]">
            {invoice.customer}
          </span>
          <span className="block text-[12px] text-[var(--gray-400)]">{invoice.company}</span>
        </button>
      </td>
      <td className="mono h-[56px] border-b border-[var(--gray-100)] px-5 text-right align-middle text-[13px] font-medium text-[var(--gray-700)]">
        {formatCurrency(invoice.amount)}
      </td>
      <td className="h-[56px] border-b border-[var(--gray-100)] px-5 text-center align-middle">
        <span className="inline-flex rounded-full border border-[var(--gray-300)] px-2 py-0.5 text-[11px] font-medium text-[var(--gray-500)]">
          {invoice.taxRate}%
        </span>
      </td>
      <td className="mono h-[56px] border-b border-[var(--gray-100)] px-5 text-right align-middle text-[14px] font-semibold text-[var(--gray-950)]">
        {formatCurrency(invoice.total)}
      </td>
      <td className="h-[56px] border-b border-[var(--gray-100)] px-5 align-middle">
        <StatusBadge status={invoice.status} />
      </td>
      <td className="h-[56px] border-b border-[var(--gray-100)] px-5 align-middle">
        <div
          className={`mono flex items-center gap-1.5 text-[13px] ${
            overdue && invoice.status !== 'Paid' && invoice.status !== 'Void'
              ? 'font-medium text-[var(--status-overdue-text)]'
              : 'text-[var(--gray-700)]'
          }`}
        >
          {overdue && invoice.status !== 'Paid' && invoice.status !== 'Void' ? (
            <AlertTriangle className="h-3 w-3" />
          ) : null}
          {formatDate(invoice.dueDate)}
        </div>
      </td>
    </tr>
  );
}
