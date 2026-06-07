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
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
      <p className="text-[14px] font-semibold text-[#111827]">{entry.name}</p>
      <p className="text-[12px] text-[#6B7280]">{entry.company}</p>
      <p className="mono mt-3 text-[14px] font-semibold text-[#030712]">{formatCurrency(entry.totalBilled)}</p>
      <p className="text-[12px] text-[#6B7280]">{entry.invoiceCount} invoices</p>
    </div>
  );
}

export default function TopCustomersChart({ data }) {
  return (
    <div className="card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-[16px] font-bold text-[#111827]">Top Customers by Value</h3>
        </div>
        <span className="rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1 text-[12px] font-medium text-[#374151]">
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
            <CartesianGrid stroke="#F3F4F6" horizontal={false} />
            <XAxis
              type="number"
              stroke="#9CA3AF"
              tickFormatter={(value) => formatCurrency(value).replace('.00', '')}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              stroke="#9CA3AF"
              tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
            <Bar
              dataKey="totalBilled"
              radius={[0, 4, 4, 0]}
              barSize={32}
              fill="#16A34A"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill="#16A34A" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
