import { Inbox } from 'lucide-react';

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Inbox
}) {
  return (
    <div className="card-panel flex min-h-[320px] flex-col items-center justify-center px-6 py-10 text-center">
      <div className="rounded-[28px] border border-accent/20 bg-accent/10 p-5">
        <Icon className="h-8 w-8 text-accent" />
      </div>
      <h3 className="mt-6 font-display text-2xl font-bold text-primary">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-6 text-secondary">{description}</p>
      {actionLabel ? (
        <button type="button" onClick={onAction} className="accent-button mt-6">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
