import { CircleDollarSign, Landmark, ReceiptText, UsersRound } from 'lucide-react';

const iconMap = {
  billed: CircleDollarSign,
  tax: Landmark,
  invoices: ReceiptText,
  customers: UsersRound
};

export default function SummaryCards({ cards }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = iconMap[card.key];
        return (
          <div key={card.label} className="card p-5">
            <div className="mb-3">
              <Icon className="h-5 w-5 text-[#9CA3AF]" />
            </div>
            <p className="text-[13px] font-medium text-[#6B7280]">{card.label}</p>
            <p className="mono mt-1 text-[24px] font-semibold tracking-tight text-[#111827]">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
