export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(amount || 0));

export const formatNumber = (value) =>
  new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(Number(value || 0));

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

export const formatInputDate = (dateStr) => {
  if (!dateStr) {
    return '';
  }

  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export const isOverdue = (dueDate, status) =>
  status !== 'Paid' && status !== 'Void' && new Date(dueDate) < new Date();

export const computeInvoicePreview = (amount, taxRate) => {
  const parsedAmount = Number(amount || 0);
  const parsedTaxRate = Number(taxRate || 0);
  const tax = Number.parseFloat(((parsedAmount * parsedTaxRate) / 100).toFixed(2));
  const total = Number.parseFloat((parsedAmount + tax).toFixed(2));

  return { tax, total };
};
