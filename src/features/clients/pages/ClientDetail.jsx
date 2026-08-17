import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import useClientStore from "../store/clients.store";
import useBillStore from "../../bills/store/bills.store";
import ClientModal from "../components/ClientModal";
import Loader from "../../../components/common/Loader";

import {
    Phone,
    Mail,
    FileText,
    ChevronLeft,
    Edit3,
    Trash2,
    Calendar,
    MapPin,
} from "lucide-react";

import toast from "react-hot-toast";

const ClientDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        activeClient,
        loading: clientLoading,
        fetchClientById,
        updateClient,
        deleteClient,
    } = useClientStore();

    const {
        bills,
        loading: billsLoading,
        fetchBills,
    } = useBillStore();

    const [isEditModalOpen, setIsEditModalOpen] =
        useState(false);

    useEffect(() => {
        fetchClientById(id);
    }, [id, fetchClientById]);

    useEffect(() => {
        if (activeClient) {
            fetchBills(
                1,
                100,
                activeClient.clientName
            );
        }
    }, [activeClient, fetchBills]);

    const handleSaveClient = async (data) => {
        const res = await updateClient(id, data);

        if (res.success) {
            toast.success(
                "Client profile updated successfully"
            );

            fetchClientById(id);
            setIsEditModalOpen(false);
        }
    };

    const handleDeleteClient = async () => {
        if (
            window.confirm(
                `Are you absolutely sure you want to delete "${activeClient?.clientName}"? This action cannot be undone.`
            )
        ) {
            try {
                const res =
                    await deleteClient(id);

                if (res.success) {
                    toast.success(
                        res.message ||
                            "Client profile deleted"
                    );

                    navigate("/clients");
                }
            } catch (err) {
                toast.error(
                    err.response?.data?.message ||
                        err.message ||
                        "Failed to delete client"
                );
            }
        }
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(val || 0);
    };

    const clientBills = bills.filter(
        (bill) =>
            bill.client?._id === id ||
            bill.client === id
    );

    const totalInvoiced =
        clientBills.reduce(
            (sum, bill) =>
                sum + (Number(bill.grandTotal) || 0),
            0
        );

    const totalPending =
        clientBills
            .filter(
                (bill) =>
                    bill.paymentStatus ===
                    "Pending"
            )
            .reduce(
                (sum, bill) =>
                    sum +
                    (Number(bill.grandTotal) || 0),
                0
            );

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
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader
                            size={40}
                            className="animate-spin text-indigo-600"
                        />

                        <p className="text-xs text-slate-500">
                            Loading client dossier...
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!activeClient) {
        return (
            <DashboardLayout>
                <div className="mx-auto max-w-md py-12 text-center">

                    <p className="mb-4 font-medium text-slate-500">
                        Client not found or was removed.
                    </p>

                    <Link
                        to="/clients"
                        className="inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                        Back to Directory
                    </Link>

                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            <div className="w-full min-w-0 space-y-4 sm:space-y-6">

                {/* Back */}
                <div>
                    <Link
                        to="/clients"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
                    >
                        <ChevronLeft size={16} />
                        Back to Customer Directory
                    </Link>
                </div>

                {/* ================= PROFILE ================= */}

                <div className="flex min-w-0 flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 md:flex-row md:items-center md:justify-between">

                    {/* Client identity */}
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-lg font-bold text-indigo-600 sm:h-14 sm:w-14 sm:text-xl">
                            {getInitials(
                                activeClient.clientName
                            )}
                        </div>

                        <div className="min-w-0">

                            <h2 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                                {
                                    activeClient.clientName
                                }
                            </h2>

                            <p className="mt-1 truncate text-xs font-medium text-slate-500">
                                Registered customer dossier
                            </p>

                        </div>

                    </div>

                    {/* Actions */}
                    <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">

                        <button
                            type="button"
                            onClick={() =>
                                setIsEditModalOpen(
                                    true
                                )
                            }
                            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
                        >
                            <Edit3 size={14} />
                            Edit Profile
                        </button>

                        <button
                            type="button"
                            onClick={
                                handleDeleteClient
                            }
                            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 text-xs font-semibold text-red-600 transition hover:bg-red-50 sm:w-auto"
                        >
                            <Trash2 size={14} />
                            Delete Account
                        </button>

                    </div>

                </div>

                {/* ================= MAIN ================= */}

                <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">

                    {/* ================= LEFT ================= */}

                    <div className="min-w-0 space-y-4 sm:space-y-6">

                        {/* Contact */}
                        <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">

                            <h3 className="border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wider text-slate-800">
                                Contact & Metadata
                            </h3>

                            <div className="mt-5 space-y-4 text-sm">

                                {/* Phone */}
                                <div className="flex min-w-0 items-start gap-3">

                                    <Phone
                                        size={16}
                                        className="mt-0.5 shrink-0 text-slate-400"
                                    />

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-slate-400">
                                            Phone Number
                                        </p>

                                        <p className="mt-1 break-words font-medium text-slate-800">
                                            {
                                                activeClient.phone
                                            }
                                        </p>
                                    </div>

                                </div>

                                {/* Email */}
                                <div className="flex min-w-0 items-start gap-3">

                                    <Mail
                                        size={16}
                                        className="mt-0.5 shrink-0 text-slate-400"
                                    />

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-slate-400">
                                            Email Address
                                        </p>

                                        <p className="mt-1 break-all font-medium text-slate-800">
                                            {
                                                activeClient.email ||
                                                "N/A"
                                            }
                                        </p>
                                    </div>

                                </div>

                                {/* GST */}
                                <div className="flex min-w-0 items-start gap-3">

                                    <FileText
                                        size={16}
                                        className="mt-0.5 shrink-0 text-slate-400"
                                    />

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-slate-400">
                                            GST Identification Number
                                        </p>

                                        <p className="mt-1 break-all font-mono text-xs font-semibold text-slate-800">
                                            {
                                                activeClient.gstNumber ||
                                                "Not Registered"
                                            }
                                        </p>
                                    </div>

                                </div>

                                {/* Address */}
                                <div className="flex min-w-0 items-start gap-3">

                                    <MapPin
                                        size={16}
                                        className="mt-0.5 shrink-0 text-slate-400"
                                    />

                                    <div className="min-w-0">

                                        <p className="text-xs font-medium text-slate-400">
                                            Billing Address
                                        </p>

                                        <p className="mt-1 break-words font-medium leading-relaxed text-slate-800">

                                            {
                                                activeClient.address
                                            }

                                            {activeClient.city && (
                                                <span className="block">
                                                    {
                                                        activeClient.city
                                                    }
                                                </span>
                                            )}

                                            {(activeClient.state ||
                                                activeClient.pincode) && (
                                                <span className="block">
                                                    {
                                                        activeClient.state
                                                    }{" "}
                                                    {activeClient.pincode &&
                                                        `- ${activeClient.pincode}`}
                                                </span>
                                            )}

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Financial Summary */}
                        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">

                            <h3 className="border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wider text-slate-800">
                                Financial Summary
                            </h3>

                            <div className="mt-4 grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-2">

                                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-center">

                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Total Billed
                                    </p>

                                    <p className="mt-1 break-words text-lg font-bold text-indigo-700">
                                        {formatCurrency(
                                            totalInvoiced
                                        )}
                                    </p>

                                </div>

                                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-center">

                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Total Pending
                                    </p>

                                    <p className="mt-1 break-words text-lg font-bold text-amber-700">
                                        {formatCurrency(
                                            totalPending
                                        )}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ================= RIGHT ================= */}

                    <div className="min-w-0 lg:col-span-2">

                        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

                            {/* Header */}
                            <div className="flex min-w-0 flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">

                                <div className="min-w-0">

                                    <h3 className="truncate text-base font-bold text-slate-800 sm:text-lg">
                                        Invoicing History
                                    </h3>

                                    <p className="mt-1 truncate text-xs font-medium text-slate-500">
                                        All invoices issued to this customer
                                    </p>

                                </div>

                                <Link
                                    to={`/bills/create?clientId=${id}`}
                                    className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
                                >
                                    <PlusIcon size={14} />
                                    New Invoice
                                </Link>

                            </div>

                            {/* Invoice history table */}
                            <div className="w-full max-w-full overflow-x-auto">

                                <table className="min-w-[620px] w-full text-sm">

                                    <thead>

                                        <tr className="border-b border-slate-100 text-left text-xs font-semibold text-slate-400">

                                            <th className="whitespace-nowrap px-4 py-4 sm:px-6">
                                                Invoice No
                                            </th>

                                            <th className="whitespace-nowrap px-4 py-4 sm:px-6">
                                                Date
                                            </th>

                                            <th className="whitespace-nowrap px-4 py-4 sm:px-6">
                                                Amount
                                            </th>

                                            <th className="whitespace-nowrap px-4 py-4 sm:px-6">
                                                Status
                                            </th>

                                            <th className="whitespace-nowrap px-4 py-4 text-right sm:px-6">
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-slate-50">

                                        {billsLoading ? (

                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="py-8 text-center"
                                                >
                                                    <Loader
                                                        size={20}
                                                        className="mx-auto animate-spin text-indigo-600"
                                                    />
                                                </td>
                                            </tr>

                                        ) : clientBills.length ===
                                          0 ? (

                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-4 py-8 text-center text-xs text-slate-400 sm:px-6"
                                                >
                                                    No invoices issued to this client yet.
                                                </td>
                                            </tr>

                                        ) : (

                                            clientBills.map(
                                                (bill) => (
                                                    <tr
                                                        key={
                                                            bill._id
                                                        }
                                                        className="transition hover:bg-slate-50"
                                                    >

                                                        <td className="whitespace-nowrap px-4 py-4 font-mono text-xs font-semibold text-slate-900 sm:px-6">
                                                            {
                                                                bill.billNumber
                                                            }
                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-600 sm:px-6">

                                                            <span className="flex items-center gap-1.5">

                                                                <Calendar
                                                                    size={
                                                                        12
                                                                    }
                                                                    className="shrink-0 text-slate-400"
                                                                />

                                                                {new Date(
                                                                    bill.billDate
                                                                ).toLocaleDateString(
                                                                    "en-IN",
                                                                    {
                                                                        day: "2-digit",
                                                                        month: "short",
                                                                        year: "numeric",
                                                                    }
                                                                )}

                                                            </span>

                                                        </td>

                                                        <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900 sm:px-6">
                                                            {formatCurrency(
                                                                bill.grandTotal
                                                            )}
                                                        </td>

                                                        <td className="px-4 py-4 sm:px-6">

                                                            <span
                                                                className={`
                                                                    inline-flex
                                                                    whitespace-nowrap
                                                                    items-center
                                                                    rounded-full
                                                                    border
                                                                    px-2.5
                                                                    py-1
                                                                    text-xs
                                                                    font-semibold
                                                                    ${
                                                                        bill.paymentStatus ===
                                                                        "Paid"
                                                                            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                                                                            : "border-amber-100 bg-amber-50 text-amber-700"
                                                                    }
                                                                `}
                                                            >
                                                                {
                                                                    bill.paymentStatus
                                                                }
                                                            </span>

                                                        </td>

                                                        <td className="px-4 py-4 text-right sm:px-6">

                                                            <Link
                                                                to={`/bills/view/${bill._id}`}
                                                                className="text-xs font-semibold text-indigo-600 hover:underline"
                                                            >
                                                                View
                                                            </Link>

                                                        </td>

                                                    </tr>
                                                )
                                            )

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Edit Modal */}
            <ClientModal
                isOpen={isEditModalOpen}
                onClose={() =>
                    setIsEditModalOpen(false)
                }
                onSave={handleSaveClient}
                client={activeClient}
            />

        </DashboardLayout>
    );
};

const PlusIcon = ({ size = 16 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
);

export default ClientDetail;