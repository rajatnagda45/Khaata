import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload;
  return (
    <div className="rounded-lg border border-[var(--gray-200)] bg-[var(--white)] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
      <p className="text-[14px] font-semibold text-[var(--gray-900)]">{entry.name}</p>
      <p className="text-[12px] text-[var(--gray-500)]">{entry.company}</p>
      <p className="mono mt-3 text-[14px] font-semibold text-[var(--gray-950)]">{formatCurrency(entry.totalBilled)}</p>
      <p className="text-[12px] text-[var(--gray-500)]">{entry.invoiceCount} invoices</p>
    </div>
  );
}

export default function TopCustomersChart({ data }) {
  return (
    <div className="card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-[var(--gray-900)]">Top Customers by Value</h3>
        </div>
        <span className="rounded-full border border-[var(--gray-200)] bg-[var(--gray-50)] px-3 py-1 text-[12px] font-medium text-[var(--gray-700)]">
          Highest billed first
        </span>
      </div>
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 24, left: 12, bottom: 8 }}
          >
            <CartesianGrid stroke="var(--gray-100)" horizontal={false} />
            <XAxis
              type="number"
              stroke="var(--gray-400)"
              tickFormatter={(value) => formatCurrency(value).replace('.00', '')}
              tick={{ fontSize: 12, fill: 'var(--gray-500)' }}
              axisLine={{ stroke: 'var(--gray-200)' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              stroke="var(--gray-400)"
              tick={{ fontSize: 12, fill: 'var(--gray-700)', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--gray-50)' }} />
            <Bar
              dataKey="totalBilled"
              radius={[0, 4, 4, 0]}
              barSize={32}
              fill="var(--accent)"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill="var(--accent)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
