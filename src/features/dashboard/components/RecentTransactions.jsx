import { Link } from "react-router-dom";
import { ArrowUpRight, ReceiptText } from "lucide-react";

const RecentTransactions = ({ bills = [] }) => {
    const formatCurrency = (val) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(val || 0);
    };

    const getPaymentMethod = (index, status) => {
        if (status === "Pending") return "—";

        const methods = [
            "UPI",
            "Cash",
            "Bank Transfer",
            "Credit Card",
        ];

        return methods[index % methods.length];
    };

    const getStatusClass = (status) => {
        if (status === "Paid") {
            return "bg-emerald-50 text-emerald-700 border-emerald-100";
        }

        return "bg-amber-50 text-amber-700 border-amber-100";
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}
            <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-5">

                <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-slate-800 sm:text-lg">
                        Recent Transactions
                    </h3>

                    <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500 sm:text-xs">
                        Detailed audit trail of all receipts
                    </p>
                </div>

                <Link
                    to="/bills"
                    className="flex shrink-0 items-center gap-1 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                    <span>View All</span>
                    <ArrowUpRight size={14} />
                </Link>

            </div>

            {/* ================= MOBILE ================= */}
            <div className="block sm:hidden">

                {bills.length === 0 ? (

                    <div className="px-5 py-10 text-center">

                        <ReceiptText
                            size={28}
                            className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 text-sm text-slate-400">
                            No transaction audit entries found.
                        </p>

                    </div>

                ) : (

                    <div className="divide-y divide-slate-100">

                        {bills.slice(0, 5).map((bill, index) => (

                            <div
                                key={bill._id}
                                className="p-4"
                            >

                                {/* Top */}
                                <div className="flex items-start justify-between gap-3">

                                    <div className="min-w-0">

                                        <p className="truncate font-mono text-xs font-bold text-slate-800">
                                            {bill.billNumber}
                                        </p>

                                        <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                                            {bill.client?.clientName ||
                                                "Cash Customer"}
                                        </p>

                                    </div>

                                    <span
                                        className={`
                                            shrink-0
                                            rounded-full
                                            border
                                            px-2
                                            py-1
                                            text-[9px]
                                            font-bold
                                            uppercase
                                            tracking-wide
                                            ${getStatusClass(
                                                bill.paymentStatus
                                            )}
                                        `}
                                    >
                                        {bill.paymentStatus}
                                    </span>

                                </div>

                                {/* Details */}
                                <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">

                                    <div>
                                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                            Payment
                                        </p>

                                        <p className="mt-1 truncate text-xs font-semibold text-slate-600">
                                            {getPaymentMethod(
                                                index,
                                                bill.paymentStatus
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                            Date
                                        </p>

                                        <p className="mt-1 truncate text-xs font-semibold text-slate-600">
                                            {formatDate(bill.billDate)}
                                        </p>
                                    </div>

                                </div>

                                {/* Amount */}
                                <div className="mt-3 flex items-center justify-between">

                                    <span className="text-xs font-medium text-slate-400">
                                        Amount
                                    </span>

                                    <span className="text-sm font-bold text-slate-900">
                                        {formatCurrency(
                                            bill.grandTotal
                                        )}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

            {/* ================= TABLE — TABLET / DESKTOP ================= */}
            <div className="hidden overflow-x-auto sm:block">

                <table className="w-full min-w-[700px] border-collapse text-sm text-slate-600">

                    <thead>
                        <tr className="border-b border-slate-100 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">

                            <th className="px-5 py-3">
                                Invoice No
                            </th>

                            <th className="px-5 py-3">
                                Client
                            </th>

                            <th className="px-5 py-3">
                                Payment Method
                            </th>

                            <th className="px-5 py-3">
                                Transaction Date
                            </th>

                            <th className="px-5 py-3 text-right">
                                Amount
                            </th>

                            <th className="px-5 py-3 text-center">
                                Status
                            </th>

                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-50 text-xs font-medium">

                        {bills.length === 0 ? (

                            <tr>
                                <td
                                    colSpan="6"
                                    className="py-8 text-center italic text-slate-400"
                                >
                                    No transaction audit entries found.
                                </td>
                            </tr>

                        ) : (

                            bills.map((bill, index) => (

                                <tr
                                    key={bill._id}
                                    className="transition-colors hover:bg-slate-50/50"
                                >

                                    <td className="px-5 py-4 font-mono font-bold text-slate-800">
                                        {bill.billNumber}
                                    </td>

                                    <td className="px-5 py-4 font-bold text-slate-800">
                                        {bill.client?.clientName ||
                                            "Cash Customer"}
                                    </td>

                                    <td className="px-5 py-4 font-semibold uppercase text-slate-500">
                                        {getPaymentMethod(
                                            index,
                                            bill.paymentStatus
                                        )}
                                    </td>

                                    <td className="px-5 py-4 font-semibold text-slate-500">
                                        {formatDate(
                                            bill.billDate
                                        )}
                                    </td>

                                    <td className="px-5 py-4 text-right font-mono font-bold text-slate-900">
                                        {formatCurrency(
                                            bill.grandTotal
                                        )}
                                    </td>

                                    <td className="px-5 py-4 text-center">

                                        <span
                                            className={`
                                                inline-flex
                                                items-center
                                                rounded-full
                                                border
                                                px-2.5
                                                py-0.5
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                ${getStatusClass(
                                                    bill.paymentStatus
                                                )}
                                            `}
                                        >
                                            {bill.paymentStatus}
                                        </span>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default RecentTransactions;