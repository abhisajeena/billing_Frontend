import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import useClientStore from "../store/clients.store";
import ClientModal from "../components/ClientModal";
import Loader from "../../../components/common/Loader";
import { Plus, Search, Edit2, Trash2, Phone, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ClientList = () => {
    const {
        clients,
        loading,
        pagination,
        fetchClients,
        createClient,
        updateClient,
        deleteClient
    } = useClientStore();

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchClients(page, 10, search);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [page, search, fetchClients]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset page to 1 when search term changes
    };

    const handleAddClick = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (e, client) => {
        e.stopPropagation(); // Stop row click navigation
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (e, client) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to remove client "${client.clientName}"?`)) {
            try {
                const res = await deleteClient(client._id);
                if (res.success) {
                    toast.success(res.message || "Client removed successfully");
                    fetchClients(page, 10, search);
                }
            } catch (err) {
                toast.error(err.response?.data?.message || err.message || "Failed to delete client");
            }
        }
    };

    const handleSaveClient = async (data) => {
        if (editingClient) {
            const res = await updateClient(editingClient._id, data);
            if (res.success) {
                toast.success(res.message || "Client profile updated");
                fetchClients(page, 10, search);
            }
        } else {
            const res = await createClient(data);
            if (res.success) {
                toast.success(res.message || "New client registered");
                fetchClients(1, 10, ""); // Reset search and return to page 1
                setSearch("");
                setPage(1);
            }
        }
    };

    const getInitials = (name) => {
        if (!name) return "C";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header Action Block */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Customer Directory</h2>
                        <p className="text-xs text-slate-500 font-medium">Add, update, and manage your billing accounts</p>
                    </div>
                    <button
                        onClick={handleAddClick}
                       className="h-11 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:scale-[1.01] transition-all cursor-pointer"
                    >
                        <Plus size={18} />
                        Add New Client
                    </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Search by client name, phone number, GSTIN..."
                            className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                {/* Clients Table Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-slate-650">
                            <thead>
                                <tr className="text-left text-slate-450 font-semibold border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-6 py-4 font-semibold">Client Name</th>
                                    <th className="px-6 py-4 font-semibold">Contact Info</th>
                                    <th className="px-6 py-4 font-semibold">GSTIN</th>
                                    <th className="px-6 py-4 font-semibold">Address / Location</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading && clients.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <Loader size={32} className="mx-auto text-indigo-600 animate-spin" />
                                            <p className="text-xs text-slate-500 mt-2">Fetching client list...</p>
                                        </td>
                                    </tr>
                                ) : clients.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-450 text-xs">
                                            No clients matched your criteria. Add a client to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    clients.map((client) => (
                                        <tr
                                            key={client._id}
                                            className="hover:bg-slate-50/40 cursor-pointer transition-colors group"
                                        >
                                            <td className="px-6 py-4 font-medium text-slate-800">
                                                <Link to={`/clients/${client._id}`} className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-sm group-hover:bg-indigo-50 group-hover:text-indigo-650 transition">
                                                        {getInitials(client.clientName)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 group-hover:text-indigo-650 transition">
                                                            {client.clientName}
                                                        </h4>
                                                        <span className="text-[10px] text-indigo-500 font-semibold uppercase tracking-wider">
                                                            ID: {client._id.substring(18)}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                        <Phone size={12} className="text-slate-400" />
                                                        {client.phone}
                                                    </div>
                                                    {client.email && (
                                                        <span className="text-xs text-slate-500 block">
                                                            {client.email}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-800">
                                                {client.gstNumber || <span className="text-slate-400 font-sans">N/A</span>}
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate">
                                                <div className="flex items-start gap-1.5 text-xs">
                                                    <MapPin size={12} className="text-slate-400 mt-0.5 shrink-0" />
                                                    <span className="truncate">
                                                        {client.address}
                                                        {client.city && `, ${client.city}`}
                                                        {client.state && `, ${client.state}`}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2.5">
                                                    <button
                                                        onClick={(e) => handleEditClick(e, client)}
                                                        className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-650 hover:bg-slate-50 flex items-center justify-center transition"
                                                        title="Edit Client"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDeleteClick(e, client)}
                                                        className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:text-red-650 hover:bg-slate-50 flex items-center justify-center transition"
                                                        title="Delete Client"
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
                                Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total records)
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

            {/* Client Setup Modal */}
            <ClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveClient}
                client={editingClient}
            />
        </DashboardLayout>
    );
};

export default ClientList;
