import { useInvoiceContext } from '../context/InvoiceContext';

export default function useCustomers() {
  return useInvoiceContext();
}
