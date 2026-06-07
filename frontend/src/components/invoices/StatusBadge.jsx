const statusConfig = {
  Paid:    { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0', dot: 'var(--accent)' },
  Unpaid:  { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A', dot: '#F59E0B' },
  Overdue: { bg: 'var(--status-overdue-bg)', text: 'var(--status-overdue-text)', border: 'var(--status-overdue-border)', dot: '#EF4444' },
  Sent:    { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE', dot: '#3B82F6' },
  Draft:   { bg: 'var(--gray-50)', text: 'var(--gray-700)', border: 'var(--gray-200)', dot: 'var(--gray-400)' },
  Void:    { bg: 'var(--gray-50)', text: 'var(--gray-400)', border: 'var(--gray-200)', dot: 'var(--gray-300)' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Draft;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 8px',
        borderRadius: '6px',
        border: `1px solid ${config.border}`,
        background: config.bg,
        fontSize: '12px',
        fontWeight: '500',
        color: config.text,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: config.dot,
          flexShrink: 0
        }}
      />
      {status}
    </span>
  );
}
