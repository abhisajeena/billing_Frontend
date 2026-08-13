import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import useBillStore from "../store/bills.store";
import Loader from "../../../components/common/Loader";
import { Plus, Search, Eye, Edit2, Trash2, Calendar, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import toast from "react-hot-toast";

const BillList = () => {
    const {
        bills,
        loading,
        pagination,
        fetchBills,
        deleteBill
    } = useBillStore();

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchBills(page, 10, search);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [page, search, fetchBills]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset page to 1
    };

    const handleDeleteClick = async (e, billId, billNo) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete invoice "${billNo}"? This action cannot be undone.`)) {
            try {
                const res = await deleteBill(billId);
                if (res.success) {
                    toast.success(res.message || "Invoice deleted successfully.");
                    fetchBills(page, 10, search);
                }
            } catch (err) {
                toast.error(err.response?.data?.message || err.message || "Failed to delete invoice.");
            }
        }
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR"
        }).format(val || 0);
    };

    // Filter bills client-side if status filter is selected (in case API doesn't support status param)
    const filteredBills = statusFilter === "All"
        ? bills
        : bills.filter(bill => bill.paymentStatus === statusFilter);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Invoices & Billing</h2>
                        <p className="text-xs text-slate-500 font-medium">Draft, print, and track all sales invoices</p>
                    </div>
                    <Link
                        to="/bills/create"
                       className="h-11 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:scale-[1.01] transition-all cursor-pointer"
                    >
                        <Plus size={18} />
                        New Invoice
                    </Link>
                </div>

                {/* Filters Row */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Search by Invoice number, client name, status..."
                            className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
                        <Filter size={16} className="text-slate-400" />
                        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Filter Status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition"
                        >
                            <option value="All">All Invoices</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                </div>

                {/* Invoices Table Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-slate-650">
                            <thead>
                                <tr className="text-left text-slate-450 font-semibold border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-6 py-4 font-semibold">Invoice No</th>
                                    <th className="px-6 py-4 font-semibold">Client Name</th>
                                    <th className="px-6 py-4 font-semibold">Bill Date</th>
                                    <th className="px-6 py-4 font-semibold">Grand Total</th>
                                    <th className="px-6 py-4 font-semibold">Payment Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading && bills.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <Loader size={32} className="mx-auto text-indigo-600 animate-spin" />
                                            <p className="text-xs text-slate-500 mt-2">Loading bills ledger...</p>
                                        </td>
                                    </tr>
                                ) : filteredBills.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-450 text-xs">
                                            No invoices found. Generate a new invoice above.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBills.map((bill) => (
                                        <tr
                                            key={bill._id}
                                            className="hover:bg-slate-50/40 cursor-pointer transition-colors"
                                        >
                                            <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-900">
                                                {bill.billNumber}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-800">
                                                <Link to={`/clients/${bill.client?._id || bill.client}`} className="hover:text-indigo-650 transition">
                                                    {bill.client?.clientName || "Unknown Client"}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-xs">
                                                <span className="flex items-center gap-1.5 text-slate-500">
                                                    <Calendar size={13} className="text-slate-400" />
                                                    {new Date(bill.billDate).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-900 font-mono text-xs">
                                                {formatCurrency(bill.grandTotal)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold leading-5 ${
                                                        bill.paymentStatus === "Paid"
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                                            : "bg-amber-50 text-amber-700 border border-amber-100"
                                                    }`}
                                                >
                                                    {bill.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2.5">
                                                    <Link
                                                        to={`/bills/view/${bill._id}`}
                                                        className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-650 hover:bg-slate-50 flex items-center justify-center transition"
                                                        title="View/Print Invoice"
                                                    >
                                                        <Eye size={14} />
                                                    </Link>
                                                    <Link
                                                        to={`/bills/edit/${bill._id}`}
                                                        className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-650 hover:bg-slate-50 flex items-center justify-center transition"
                                                        title="Edit Invoice"
                                                    >
                                                        <Edit2 size={14} />
                                                    </Link>
                                                    <button
                                                        onClick={(e) => handleDeleteClick(e, bill._id, bill.billNumber)}
                                                        className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:text-red-650 hover:bg-slate-50 flex items-center justify-center transition cursor-pointer"
                                                        title="Delete Invoice"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-xs">
                            <span className="text-slate-500 font-medium">
                                Page {pagination.page} of {pagination.totalPages} ({pagination.total} invoices total)
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={pagination.page === 1}
                                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BillList;
