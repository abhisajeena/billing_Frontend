import { TrendingUp } from "lucide-react";

const RevenueChart = ({ totalRevenue = 0 }) => {
  const formatRevenue = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const bars = [
    { month: "Mar", value: 42 },
    { month: "Apr", value: 55 },
    { month: "May", value: 48 },
    { month: "Jun", value: 70 },
    { month: "Jul", value: 63 },
    { month: "Aug", value: 82 },
  ];

  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

        <div>
          <h3 className="text-base font-bold text-slate-900">
            Revenue Overview
          </h3>

          <p className="mt-0.5 text-xs text-slate-500">
            Monthly revenue performance
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <TrendingUp size={17} />
        </div>

      </div>

      <div className="p-5">

        <div className="flex items-end justify-between">

          <div>
            <p className="text-xs font-medium text-slate-400">
              Total Revenue
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatRevenue(totalRevenue)}
            </p>
          </div>

          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
            +12.5%
          </span>

        </div>

        <div className="mt-8 flex h-44 items-end gap-3">

          {bars.map((bar) => (
            <div
              key={bar.month}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <div className="flex h-full w-full items-end">

                <div
                  className="w-full rounded-t-lg bg-indigo-500/80 transition hover:bg-indigo-600"
                  style={{
                    height: `${bar.value}%`,
                  }}
                />

              </div>

              <span className="text-[10px] font-semibold text-slate-400">
                {bar.month}
              </span>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default RevenueChart;