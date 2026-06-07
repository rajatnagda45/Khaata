import { useInvoiceContext } from '../context/InvoiceContext';

export default function useInvoices() {
  const context = useInvoiceContext();
  const { filters } = context.state;

  const activeFilterCount = [
    filters.search,
    filters.status,
    filters.taxRate,
    filters.issueDateFrom,
    filters.issueDateTo,
    filters.dueDateFrom,
    filters.dueDateTo
  ].filter(Boolean).length;

  return {
    ...context,
    activeFilterCount
  };
}
