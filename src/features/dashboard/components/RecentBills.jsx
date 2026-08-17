import { ReceiptText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecentBills = ({ bills = [] }) => {
    const navigate = useNavigate();

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(value || 0);
    };

    const getStatusClass = (status) => {
        if (status === "Paid") {
            return "bg-emerald-50 text-emerald-700 border-emerald-100";
        }

        if (status === "Pending") {
            return "bg-amber-50 text-amber-700 border-amber-100";
        }

        return "bg-rose-50 text-rose-700 border-rose-100";
    };

    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}
            <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">

                <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-slate-900">
                        Recent Invoices
                    </h3>

                    <p className="mt-0.5 truncate text-xs text-slate-500">
                        Latest billing activity
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/bills")}
                    className="flex shrink-0 items-center gap-1 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                    <span>View all</span>
                    <ArrowRight size={14} />
                </button>

            </div>

            {/* Invoice List */}
            <div className="divide-y divide-slate-100">

                {bills.length === 0 ? (

                    <div className="px-5 py-10 text-center">

                        <ReceiptText
                            size={28}
                            className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 text-sm font-medium text-slate-500">
                            No invoices found
                        </p>

                    </div>

                ) : (

                    bills.slice(0, 5).map((bill) => (

                        <div
                            key={bill._id}
                            className="flex min-w-0 items-center justify-between gap-3 px-4 py-4 transition hover:bg-slate-50 sm:gap-4 sm:px-5"
                        >

                            {/* Invoice Info */}
                            <div className="flex min-w-0 flex-1 items-center gap-3">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:h-10 sm:w-10">
                                    <ReceiptText size={16} />
                                </div>

                                <div className="min-w-0 flex-1">

                                    <p className="truncate text-sm font-semibold text-slate-800">
                                        {bill.billNumber}
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-slate-400">
                                        {bill.client?.clientName ||
                                            "Client Account"}
                                    </p>

                                </div>

                            </div>

                            {/* Amount + Status */}
                            <div className="flex w-auto shrink-0 flex-col items-end">

                                <p className="max-w-[110px] truncate text-right text-xs font-bold text-slate-800 sm:max-w-none sm:text-sm">
                                    {formatCurrency(
                                        bill.grandTotal
                                    )}
                                </p>

                                <span
                                    className={`
                                        mt-1
                                        inline-flex
                                        max-w-[90px]
                                        truncate
                                        rounded-full
                                        border
                                        px-2
                                        py-0.5
                                        text-[9px]
                                        font-bold
                                        sm:max-w-none
                                        sm:text-[10px]
                                        ${getStatusClass(
                                            bill.paymentStatus
                                        )}
                                    `}
                                >
                                    {bill.paymentStatus}
                                </span>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
};

export default RecentBills;