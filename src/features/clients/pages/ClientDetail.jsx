import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import useClientStore from "../store/clients.store";
import useBillStore from "../../bills/store/bills.store";
import ClientModal from "../components/ClientModal";
import Loader from "../../../components/common/Loader";
import { Phone, Mail, FileText, ChevronLeft, Edit3, Trash2, Calendar, MapPin } from "lucide-react";
import toast from "react-hot-toast";

const ClientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const { activeClient, loading: clientLoading, fetchClientById, updateClient, deleteClient } = useClientStore();
    const { bills, loading: billsLoading, fetchBills } = useBillStore();
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchClientById(id);
    }, [id, fetchClientById]);

    // Once the client is loaded, fetch their invoices using the search parameters (searching the clientName)
    useEffect(() => {
        if (activeClient) {
            // Retrieve all invoices matching the client's name
            fetchBills(1, 100, activeClient.clientName);
        }
    }, [activeClient, fetchBills]);

    const handleSaveClient = async (data) => {
        const res = await updateClient(id, data);
        if (res.success) {
            toast.success("Client profile updated successfully");
            fetchClientById(id);
        }
    };

    const handleDeleteClient = async () => {
        if (window.confirm(`Are you absolutely sure you want to delete "${activeClient?.clientName}"? This action cannot be undone.`)) {
            try {
                const res = await deleteClient(id);
                if (res.success) {
                    toast.success(res.message || "Client profile deleted");
                    navigate("/clients");
                }
            } catch (err) {
                toast.error(err.response?.data?.message || err.message || "Failed to delete client");
            }
        }
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR"
        }).format(val || 0);
    };

    // Filter bills strictly by the client's ID (just in case multiple clients share part of the name)
    const clientBills = bills.filter(bill => bill.client?._id === id || bill.client === id);

    const totalInvoiced = clientBills.reduce((sum, bill) => sum + bill.grandTotal, 0);
    const totalPending = clientBills
        .filter(bill => bill.paymentStatus === "Pending")
        .reduce((sum, bill) => sum + bill.grandTotal, 0);

    const getInitials = (name) => {
        if (!name) return "C";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    if (clientLoading && !activeClient) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader size={40} className="text-indigo-600 animate-spin" />
                    <p className="text-xs text-slate-500 mt-2">Loading client dossier...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!activeClient) {
        return (
            <DashboardLayout>
                <div className="text-center py-12 max-w-md mx-auto">
                    <p className="text-slate-500 font-medium mb-4">Client not found or was removed.</p>
                    <Link to="/clients" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
                        Back to Directory
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Back bar */}
                <div>
                    <Link to="/clients" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
                        <ChevronLeft size={16} />
                        Back to Customer Directory
                    </Link>
                </div>

                {/* Profile Banner */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold flex items-center justify-center text-xl shrink-0">
                            {getInitials(activeClient.clientName)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{activeClient.clientName}</h2>
                            <p className="text-xs text-slate-500 font-medium">Registered customer dossier</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="h-10 px-4 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
                        >
                            <Edit3 size={14} />
                            Edit Profile
                        </button>
                        <button
                            onClick={handleDeleteClient}
                            className="h-10 px-4 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
                        >
                            <Trash2 size={14} />
                            Delete Account
                        </button>
                    </div>
                </div>

                {/* Grid Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Metadata */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
                            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 uppercase tracking-wider">
                                Contact & Metadata
                            </h3>
                            
                            <div className="space-y-4 text-sm text-slate-650">
                                <div className="flex items-start gap-3">
                                    <Phone size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">Phone Number</p>
                                        <p className="font-medium text-slate-800">{activeClient.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Mail size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">Email Address</p>
                                        <p className="font-medium text-slate-800 truncate">{activeClient.email || "N/A"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <FileText size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">GST Identification Number</p>
                                        <p className="font-mono text-xs font-semibold text-slate-800">
                                            {activeClient.gstNumber || "Not Registered"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium">Billing Address</p>
                                        <p className="font-medium text-slate-800 leading-relaxed">
                                            {activeClient.address}
                                            {activeClient.city && <span className="block">{activeClient.city}</span>}
                                            {(activeClient.state || activeClient.pincode) && (
                                                <span className="block">
                                                    {activeClient.state} {activeClient.pincode && `- ${activeClient.pincode}`}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Financial Summaries */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 uppercase tracking-wider">
                                Financial Summary
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 text-center">
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Billed</p>
                                    <p className="text-lg font-bold text-indigo-700 mt-1">{formatCurrency(totalInvoiced)}</p>
                                </div>
                                <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 text-center">
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Pending</p>
                                    <p className="text-lg font-bold text-amber-700 mt-1">{formatCurrency(totalPending)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Billing Ledger */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Invoicing History</h3>
                                    <p className="text-xs text-slate-500 font-medium">All invoices issued to this customer</p>
                                </div>
                                <Link 
                                    to={`/bills/create?clientId=${id}`}
                                    className="h-9 px-3.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                                >
                                    <PlusIcon size={14} />
                                    New Invoice
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-slate-650">
                                    <thead>
                                        <tr className="text-left text-slate-400 font-semibold border-b border-slate-100">
                                            <th className="pb-3 font-semibold">Invoice No</th>
                                            <th className="pb-3 font-semibold">Date</th>
                                            <th className="pb-3 font-semibold">Amount</th>
                                            <th className="pb-3 font-semibold">Status</th>
                                            <th className="pb-3 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {billsLoading ? (
                                            <tr>
                                                <td colSpan="5" className="py-6 text-center">
                                                    <Loader size={20} className="mx-auto text-indigo-600 animate-spin" />
                                                </td>
                                            </tr>
                                        ) : clientBills.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-8 text-center text-slate-450 text-xs">
                                                    No invoices issued to this client yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            clientBills.map((bill) => (
                                                <tr key={bill._id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-3.5 font-mono text-xs font-semibold text-slate-900">
                                                        {bill.billNumber}
                                                    </td>
                                                    <td className="py-3.5 text-slate-600 text-xs">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={12} className="text-slate-400" />
                                                            {new Date(bill.billDate).toLocaleDateString("en-IN", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric"
                                                            })}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 font-semibold text-slate-900">
                                                        {formatCurrency(bill.grandTotal)}
                                                    </td>
                                                    <td className="py-3.5">
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
                                                    <td className="py-3.5 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <Link
                                                                to={`/bills/view/${bill._id}`}
                                                                className="text-xs font-semibold text-indigo-650 hover:underline"
                                                            >
                                                                View
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ClientModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveClient}
                client={activeClient}
            />
        </DashboardLayout>
    );
};

// Internal icon proxy
const PlusIcon = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

export default ClientDetail;
