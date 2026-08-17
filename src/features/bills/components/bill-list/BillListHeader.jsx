import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const BillListHeader = () => {
    return (
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-slate-800 sm:text-xl">
                    Invoices & Billing
                </h2>

                <p className="mt-1 truncate text-xs font-medium text-slate-500">
                    Draft, print, and track all sales invoices
                </p>
            </div>

            <Link
                to="/bills/create"
                className="flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 sm:w-auto"
            >
                <Plus size={18} />
                New Invoice
            </Link>

        </div>
    );
};

export default BillListHeader;