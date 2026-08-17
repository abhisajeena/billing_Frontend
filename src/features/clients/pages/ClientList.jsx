import { useEffect, useState } from "react";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import useClientStore from "../store/clients.store";
import ClientModal from "../components/ClientModal";

import Loader from "../../../components/common/Loader";

import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Phone,
    MapPin,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

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
        deleteClient,
    } = useClientStore();

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const [editingClient, setEditingClient] =
        useState(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchClients(
                page,
                10,
                search
            );
        }, 300);

        return () =>
            clearTimeout(delayDebounceFn);
    }, [
        page,
        search,
        fetchClients,
    ]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleAddClick = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (
        e,
        client
    ) => {
        e.stopPropagation();

        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (
        e,
        client
    ) => {
        e.stopPropagation();

        if (
            window.confirm(
                `Are you sure you want to remove client "${client.clientName}"?`
            )
        ) {
            try {
                const res =
                    await deleteClient(
                        client._id
                    );

                if (res.success) {
                    toast.success(
                        res.message ||
                            "Client removed successfully"
                    );

                    fetchClients(
                        page,
                        10,
                        search
                    );
                }
            } catch (err) {
                toast.error(
                    err.response?.data
                        ?.message ||
                        err.message ||
                        "Failed to delete client"
                );
            }
        }
    };

    const handleSaveClient = async (
        data
    ) => {
        if (editingClient) {
            const res =
                await updateClient(
                    editingClient._id,
                    data
                );

            if (res.success) {
                toast.success(
                    res.message ||
                        "Client profile updated"
                );

                fetchClients(
                    page,
                    10,
                    search
                );
            }
        } else {
            const res =
                await createClient(data);

            if (res.success) {
                toast.success(
                    res.message ||
                        "New client registered"
                );

                fetchClients(
                    1,
                    10,
                    ""
                );

                setSearch("");
                setPage(1);
            }
        }

        setIsModalOpen(false);
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

            <div className="w-full min-w-0 space-y-4 sm:space-y-6">

                {/* ================= HEADER ================= */}

                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="min-w-0">

                        <h2 className="truncate text-lg font-bold text-slate-800 sm:text-xl">
                            Customer Directory
                        </h2>

                        <p className="mt-1 truncate text-xs font-medium text-slate-500">
                            Add, update, and manage your billing accounts
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={
                            handleAddClick
                        }
                        className="
                            flex
                            h-11
                            w-full
                            shrink-0
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-indigo-600
                            px-5
                            text-sm
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-indigo-600/20
                            transition-all
                            hover:bg-indigo-700
                            sm:w-auto
                        "
                    >
                        <Plus size={18} />
                        Add New Client
                    </button>

                </div>

                {/* ================= SEARCH ================= */}

                <div className="w-full min-w-0 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4">

                    <div className="relative w-full min-w-0">

                        <Search
                            size={18}
                            className="
                                absolute
                                left-4
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={
                                handleSearchChange
                            }
                            placeholder="Search by client name, phone number, GSTIN..."
                            className="
                                h-11
                                w-full
                                min-w-0
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                pl-11
                                pr-4
                                text-sm
                                text-slate-800
                                outline-none
                                transition
                                focus:bg-white
                                focus:ring-2
                                focus:ring-indigo-500
                            "
                        />

                    </div>

                </div>

                {/* ================= CLIENT TABLE ================= */}

                <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

                    <div className="w-full max-w-full overflow-x-auto">

                        <table className="min-w-[950px] w-full text-sm">

                            <thead>

                                <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-xs font-semibold text-slate-500">

                                    <th className="whitespace-nowrap px-5 py-4">
                                        Client Name
                                    </th>

                                    <th className="whitespace-nowrap px-5 py-4">
                                        Contact Info
                                    </th>

                                    <th className="whitespace-nowrap px-5 py-4">
                                        GSTIN
                                    </th>

                                    <th className="whitespace-nowrap px-5 py-4">
                                        Address / Location
                                    </th>

                                    <th className="whitespace-nowrap px-5 py-4 text-right">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-slate-50">

                                {loading &&
                                clients.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="px-6 py-12 text-center"
                                        >

                                            <Loader
                                                size={32}
                                                className="mx-auto animate-spin text-indigo-600"
                                            />

                                            <p className="mt-2 text-xs text-slate-500">
                                                Fetching client list...
                                            </p>

                                        </td>

                                    </tr>

                                ) : clients.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="px-6 py-12 text-center text-xs text-slate-500"
                                        >
                                            No clients matched
                                            your criteria.
                                            Add a client to
                                            get started.
                                        </td>

                                    </tr>

                                ) : (

                                    clients.map(
                                        (client) => (

                                            <tr
                                                key={
                                                    client._id
                                                }
                                                className="group transition hover:bg-slate-50"
                                            >

                                                {/* Client */}
                                                <td className="px-5 py-4">

                                                    <Link
                                                        to={`/clients/${client._id}`}
                                                        className="flex min-w-0 items-center gap-3"
                                                    >

                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700 transition group-hover:bg-indigo-50 group-hover:text-indigo-600">
                                                            {getInitials(
                                                                client.clientName
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">

                                                            <h4 className="max-w-[180px] truncate font-bold text-slate-800 transition group-hover:text-indigo-600">
                                                                {
                                                                    client.clientName
                                                                }
                                                            </h4>

                                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">
                                                                ID:{" "}
                                                                {client._id.substring(
                                                                    18
                                                                )}
                                                            </span>

                                                        </div>

                                                    </Link>

                                                </td>

                                                {/* Contact */}
                                                <td className="px-5 py-4">

                                                    <div className="min-w-[180px] space-y-1">

                                                        <div className="flex items-center gap-1.5 text-xs text-slate-600">

                                                            <Phone
                                                                size={12}
                                                                className="shrink-0 text-slate-400"
                                                            />

                                                            <span className="whitespace-nowrap">
                                                                {
                                                                    client.phone
                                                                }
                                                            </span>

                                                        </div>

                                                        {client.email && (
                                                            <span className="block max-w-[190px] truncate text-xs text-slate-500">
                                                                {
                                                                    client.email
                                                                }
                                                            </span>
                                                        )}

                                                    </div>

                                                </td>

                                                {/* GST */}
                                                <td className="px-5 py-4">

                                                    <span className="whitespace-nowrap font-mono text-xs font-semibold text-slate-800">
                                                        {client.gstNumber ||
                                                            "N/A"}
                                                    </span>

                                                </td>

                                                {/* Address */}
                                                <td className="px-5 py-4">

                                                    <div className="flex max-w-[250px] items-start gap-1.5 text-xs text-slate-600">

                                                        <MapPin
                                                            size={12}
                                                            className="mt-0.5 shrink-0 text-slate-400"
                                                        />

                                                        <span className="truncate">
                                                            {
                                                                client.address
                                                            }

                                                            {client.city &&
                                                                `, ${client.city}`}

                                                            {client.state &&
                                                                `, ${client.state}`}
                                                        </span>

                                                    </div>

                                                </td>

                                                {/* Actions */}
                                                <td className="px-5 py-4">

                                                    <div className="flex items-center justify-end gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={(
                                                                e
                                                            ) =>
                                                                handleEditClick(
                                                                    e,
                                                                    client
                                                                )
                                                            }
                                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
                                                            title="Edit Client"
                                                        >
                                                            <Edit2
                                                                size={
                                                                    14
                                                                }
                                                            />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={(
                                                                e
                                                            ) =>
                                                                handleDeleteClick(
                                                                    e,
                                                                    client
                                                                )
                                                            }
                                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-red-600"
                                                            title="Delete Client"
                                                        >
                                                            <Trash2
                                                                size={
                                                                    14
                                                                }
                                                            />
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* ================= PAGINATION ================= */}

                    {pagination &&
                        pagination.totalPages >
                            1 && (

                            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">

                                <span className="text-slate-500">
                                    Showing page{" "}
                                    {
                                        pagination.page
                                    }{" "}
                                    of{" "}
                                    {
                                        pagination.totalPages
                                    }{" "}
                                    (
                                    {
                                        pagination.total
                                    }{" "}
                                    total records)
                                </span>

                                <div className="flex items-center gap-2">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPage(
                                                (
                                                    p
                                                ) =>
                                                    Math.max(
                                                        1,
                                                        p -
                                                            1
                                                    )
                                            )
                                        }
                                        disabled={
                                            pagination.page ===
                                            1
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronLeft
                                            size={
                                                16
                                            }
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPage(
                                                (
                                                    p
                                                ) =>
                                                    Math.min(
                                                        pagination.totalPages,
                                                        p +
                                                            1
                                                    )
                                            )
                                        }
                                        disabled={
                                            pagination.page ===
                                            pagination.totalPages
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronRight
                                            size={
                                                16
                                            }
                                        />
                                    </button>

                                </div>

                            </div>

                        )}

                </div>

            </div>

            {/* Modal */}

            <ClientModal
                isOpen={isModalOpen}
                onClose={() =>
                    setIsModalOpen(false)
                }
                onSave={handleSaveClient}
                client={editingClient}
            />

        </DashboardLayout>
    );
};

export default ClientList;