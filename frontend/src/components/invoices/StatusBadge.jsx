const statusConfig = {
  Paid:    { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0', dot: '#16A34A' },
  Unpaid:  { bg: '#FFFBEB', text: '#92400E', border: '#FDE68A', dot: '#F59E0B' },
  Overdue: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', dot: '#EF4444' },
  Sent:    { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE', dot: '#3B82F6' },
  Draft:   { bg: '#F9FAFB', text: '#374151', border: '#E5E7EB', dot: '#9CA3AF' },
  Void:    { bg: '#F9FAFB', text: '#9CA3AF', border: '#E5E7EB', dot: '#D1D5DB' },
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
