const StatCard = ({
    title,
    value,
    icon,
    iconClass = "bg-indigo-50 text-indigo-600",
    trend,
    trendClass = "text-emerald-600",
}) => {
    return (
        <div
            className="
                w-full
                min-w-0
                rounded-2xl
                border border-slate-200
                bg-white
                p-4
                sm:p-5
                shadow-sm
                transition
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
            "
        >

            {/* Top Section */}
            <div className="flex min-w-0 items-start justify-between gap-3">

                {/* Content */}
                <div className="min-w-0 flex-1">

                    <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">
                        {title}
                    </p>

                    <h3
                        className="
                            mt-2
                            break-words
                            text-xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            sm:text-2xl
                        "
                    >
                        {value}
                    </h3>

                </div>

                {/* Icon */}
                <div
                    className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        sm:h-11
                        sm:w-11
                        ${iconClass}
                    `}
                >
                    {icon}
                </div>

            </div>

            {/* Trend */}
            {trend && (
                <p
                    className={`
                        mt-3
                        truncate
                        text-[11px]
                        font-semibold
                        sm:mt-4
                        sm:text-xs
                        ${trendClass}
                    `}
                >
                    {trend}
                </p>
            )}

        </div>
    );
};

export default StatCard;