import {
    Filter,
    Search,
} from "lucide-react";

const BillFilters = ({
    search,
    onSearchChange,
    statusFilter,
    setStatusFilter,
}) => {
    return (
        <div className="w-full min-w-0 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4">

            <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center">

                {/* Search */}
                <div className="relative min-w-0 flex-1">

                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={onSearchChange}
                        placeholder="Search invoices, clients, status..."
                        className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    />

                </div>

                {/* Status */}
                <div className="flex w-full min-w-0 items-center gap-2 md:w-auto">

                    <Filter
                        size={16}
                        className="shrink-0 text-slate-400"
                    />

                    <span className="hidden whitespace-nowrap text-xs font-medium text-slate-500 sm:block">
                        Filter:
                    </span>

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                        className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 md:w-auto md:flex-none"
                    >
                        <option value="All">
                            All Invoices
                        </option>

                        <option value="Paid">
                            Paid
                        </option>

                        <option value="Pending">
                            Pending
                        </option>
                    </select>

                </div>

            </div>

        </div>
    );
};

export default BillFilters;