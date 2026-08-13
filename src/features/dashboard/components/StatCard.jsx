const StatCard = ({
  title,
  value,
  icon,
  iconClass = "bg-indigo-50 text-indigo-600",
  trend,
  trendClass = "text-emerald-600",
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>

      {trend && (
        <p className={`mt-4 text-xs font-semibold ${trendClass}`}>
          {trend}
        </p>
      )}

    </div>
  );
};

export default StatCard;