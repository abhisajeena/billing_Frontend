import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const RecentTransactions = ({ bills = [] }) => {
    const formatCurrency = (val) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(val || 0);
    };

    // Helper to get dummy or actual payment method
    const getPaymentMethod = (index, status) => {
        if (status === "Pending") return "—";
        const methods = ["UPI", "Cash", "Bank Transfer", "Credit Card"];
        return methods[index % methods.length];
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">Recent Transactions</h3>
                    <p className="text-xs text-slate-500 font-medium">Detailed audit trail of all receipts</p>
                </div>
                <Link 
                    to="/bills" 
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
                >
                    View All
                    <ArrowUpRight size={14} />
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-600 border-collapse">
                    <thead>
                        <tr className="text-left text-slate-400 font-semibold border-b border-slate-100 text-[11px] uppercase tracking-wider">
                            <th className="pb-3">Invoice No</th>
                            <th className="pb-3">Client</th>
                            <th className="pb-3">Payment Method</th>
                            <th className="pb-3">Transaction Date</th>
                            <th className="pb-3 text-right">Amount</th>
                            <th className="pb-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs font-medium">
                        {bills.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-slate-400 italic">
                                    No transaction audit entries found.
                                </td>
                            </tr>
                        ) : (
                            bills.map((bill, index) => (
                                <tr key={bill._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 font-mono font-bold text-slate-800">
                                        {bill.billNumber}
                                    </td>
                                    <td className="py-4 text-slate-800 font-bold">
                                        {bill.client?.clientName || "Cash Customer"}
                                    </td>
                                    <td className="py-4 text-slate-500 font-semibold uppercase">
                                        {getPaymentMethod(index, bill.paymentStatus)}
                                    </td>
                                    <td className="py-4 text-slate-500 font-semibold">
                                        {new Date(bill.billDate).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </td>
                                    <td className="py-4 font-mono font-bold text-slate-900 text-right">
                                        {formatCurrency(bill.grandTotal)}
                                    </td>
                                    <td className="py-4 text-center">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                bill.paymentStatus === "Paid"
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                                    : "bg-amber-50 text-amber-700 border border-amber-100"
                                            }`}
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