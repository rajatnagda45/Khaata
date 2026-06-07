import { AlertTriangle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatCurrency, formatDate, isOverdue } from '../../utils/formatters';

export default function InvoiceRow({ invoice, onEdit, onCustomerOpen }) {
  const overdue = isOverdue(invoice.dueDate, invoice.status);

  return (
    <tr 
      className="invoice-row group cursor-pointer bg-white transition-colors duration-150 hover:bg-[#F9FAFB]"
    >
      <td className="h-[56px] border-b border-[#F3F4F6] border-l-[2px] border-l-transparent px-5 align-middle group-hover:border-l-[#16A34A]">
        <button
          type="button"
          onClick={() => onEdit(invoice)}
          className="mono text-[13px] font-medium text-[#030712] hover:underline"
        >
          {invoice.invoiceId}
        </button>
      </td>
      <td className="h-[56px] border-b border-[#F3F4F6] px-5 align-middle">
        <button
          type="button"
          onClick={() => onCustomerOpen(invoice)}
          className="text-left hover:text-[#16A34A]"
        >
          <span className="block text-[14px] font-medium text-[#111827] transition-colors hover:text-[#16A34A]">
            {invoice.customer}
          </span>
          <span className="block text-[12px] text-[#9CA3AF]">{invoice.company}</span>
        </button>
      </td>
      <td className="mono h-[56px] border-b border-[#F3F4F6] px-5 text-right align-middle text-[13px] font-medium text-[#374151]">
        {formatCurrency(invoice.amount)}
      </td>
      <td className="h-[56px] border-b border-[#F3F4F6] px-5 text-center align-middle">
        <span className="inline-flex rounded-full border border-[#D1D5DB] px-2 py-0.5 text-[11px] font-medium text-[#6B7280]">
          {invoice.taxRate}%
        </span>
      </td>
      <td className="mono h-[56px] border-b border-[#F3F4F6] px-5 text-right align-middle text-[14px] font-semibold text-[#030712]">
        {formatCurrency(invoice.total)}
      </td>
      <td className="h-[56px] border-b border-[#F3F4F6] px-5 align-middle">
        <StatusBadge status={invoice.status} />
      </td>
      <td className="h-[56px] border-b border-[#F3F4F6] px-5 align-middle">
        <div
          className={`mono flex items-center gap-1.5 text-[13px] ${
            overdue && invoice.status !== 'Paid' && invoice.status !== 'Void'
              ? 'font-medium text-[#991B1B]'
              : 'text-[#374151]'
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
