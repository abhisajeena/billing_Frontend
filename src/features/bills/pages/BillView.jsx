import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import useBillStore from "../store/bills.store";
import Loader from "../../../components/common/Loader";

import {
    ChevronLeft,
    Printer,
    CreditCard,
    Calendar,
    Share2,
} from "lucide-react";

import toast from "react-hot-toast";

const BillView = () => {
    const { id } = useParams();

    const {
        activeBill,
        loading,
        fetchBillById,
    } = useBillStore();

    useEffect(() => {
        fetchBillById(id);
    }, [id, fetchBillById]);

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        if (!activeBill) return;

        const shareUrl = window.location.href;

        const shareData = {
            title: `Invoice ${activeBill.billNumber || ""}`,
            text: `Invoice ${activeBill.billNumber || ""} from Billing ERP`,
            url: shareUrl,
        };

        try {
            if (
                navigator.share &&
                (!navigator.canShare ||
                    navigator.canShare(shareData))
            ) {
                await navigator.share(shareData);
                return;
            }

            await navigator.clipboard.writeText(
                shareUrl
            );

            toast.success("Invoice link copied!");
        } catch (error) {
            if (error?.name === "AbortError") {
                return;
            }

            try {
                await navigator.clipboard.writeText(
                    shareUrl
                );

                toast.success("Invoice link copied!");
            } catch {
                toast.error(
                    "Unable to share invoice link."
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

    /* Loading */
    if (loading && !activeBill) {
        return (
            <DashboardLayout>
                <div className="flex min-h-[60vh] items-center justify-center print:hidden">

                    <div className="flex flex-col items-center">

                        <Loader
                            size={40}
                            className="animate-spin text-indigo-600"
                        />

                        <p className="mt-2 text-xs text-slate-500">
                            Loading invoice layout...
                        </p>

                    </div>

                </div>
            </DashboardLayout>
        );
    }

    /* Not found */
    if (!activeBill) {
        return (
            <DashboardLayout>

                <div className="mx-auto max-w-md py-12 text-center print:hidden">

                    <p className="mb-4 font-medium text-slate-500">
                        Invoice not found or deleted.
                    </p>

                    <Link
                        to="/bills"
                        className="inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                        Back to Ledger
                    </Link>

                </div>

            </DashboardLayout>
        );
    }

    const {
        company,
        client,
        items = [],
    } = activeBill;

    return (
        <DashboardLayout>

            <div className="mx-auto w-full min-w-0 max-w-4xl space-y-4 sm:space-y-6">

                {/* ================= CONTROL BAR ================= */}

                <div className="flex min-w-0 flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">

                    {/* Back / Title */}

                    <div className="flex min-w-0 items-center gap-2">

                        <Link
                            to="/bills"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                        >
                            <ChevronLeft size={16} />
                        </Link>

                        <div className="min-w-0">

                            <h2 className="truncate text-base font-bold text-slate-800 sm:text-lg">
                                Invoice Draft
                            </h2>

                            <p className="truncate text-[11px] font-medium text-slate-500 sm:text-xs">
                                Verify terms and print or share invoice
                            </p>

                        </div>

                    </div>

                    {/* Actions */}

                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">

                        {/* Share */}

                        <button
                            type="button"
                            onClick={handleShare}
                            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 sm:w-auto"
                        >
                            <Share2 size={15} />
                            Share Invoice
                        </button>

                        {/* Print */}

                        <button
                            type="button"
                            onClick={handlePrint}
                            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 sm:w-auto"
                        >
                            <Printer size={15} />
                            Print / Save as PDF
                        </button>

                    </div>

                </div>

                {/* ================= INVOICE ================= */}

                <div className="relative w-full min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-8 lg:p-12 print:rounded-none print:border-0 print:p-0 print:shadow-none">

                    {/* Status */}

                    <div
                        className={`
                            absolute
                            right-0
                            top-0
                            rounded-bl-xl
                            border-b
                            border-l
                            px-4
                            py-1.5
                            text-[9px]
                            font-extrabold
                            uppercase
                            tracking-widest
                            print:hidden
                            sm:px-6
                            sm:text-[10px]
                            ${
                                activeBill.paymentStatus ===
                                "Paid"
                                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                                    : "border-amber-100 bg-amber-50 text-amber-700"
                            }
                        `}
                    >
                        {activeBill.paymentStatus}
                    </div>

                    {/* ================= INVOICE HEADER ================= */}

                    <div className="flex min-w-0 flex-col gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between sm:pb-8">

                        {/* Company */}

                        <div className="min-w-0 space-y-2.5">

                            {company?.logo ? (
                                <img
                                    src={company.logo}
                                    alt="Company Logo"
                                    className="mb-3 h-10 max-w-[160px] object-contain sm:h-12"
                                />
                            ) : (
                                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-lg font-extrabold text-white sm:h-12 sm:w-12">
                                    {company?.companyName?.charAt(0) ||
                                        "B"}
                                </div>
                            )}

                            <div className="min-w-0">

                                <h3 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                                    {company?.companyName ||
                                        "Issuer Company"}
                                </h3>

                                <p className="mt-1 max-w-sm break-words text-xs leading-relaxed text-slate-500">
                                    {company?.address}
                                </p>

                            </div>

                            <div className="space-y-0.5 text-xs text-slate-500">

                                {company?.phone && (
                                    <p>
                                        Phone: {company.phone}
                                    </p>
                                )}

                                {company?.email && (
                                    <p className="break-all">
                                        Email: {company.email}
                                    </p>
                                )}

                                {company?.gstNumber && (
                                    <p className="mt-1 break-all font-semibold text-slate-700">
                                        GSTIN: {company.gstNumber}
                                    </p>
                                )}

                            </div>

                        </div>

                        {/* Invoice Metadata */}

                        <div className="min-w-0 space-y-3 sm:shrink-0 sm:text-right">

                            <div>

                                <h1 className="text-2xl font-extrabold tracking-tight text-indigo-700 sm:text-3xl">
                                    INVOICE
                                </h1>

                                <p className="mt-1 font-mono text-xs font-bold text-slate-600">
                                    No: {activeBill.billNumber}
                                </p>

                            </div>

                            <div className="space-y-1 text-xs text-slate-500">

                                <p className="flex items-center gap-1.5 sm:justify-end">

                                    <Calendar
                                        size={13}
                                        className="shrink-0 text-slate-400"
                                    />

                                    <span>Date:</span>

                                    <span className="font-bold text-slate-800">
                                        {new Date(
                                            activeBill.billDate
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )}
                                    </span>

                                </p>

                                <p className="flex items-center gap-1.5 sm:justify-end">

                                    <CreditCard
                                        size={13}
                                        className="shrink-0 text-slate-400"
                                    />

                                    <span>Status:</span>

                                    <span
                                        className={`font-bold ${
                                            activeBill.paymentStatus ===
                                            "Paid"
                                                ? "text-emerald-600"
                                                : "text-amber-500"
                                        }`}
                                    >
                                        {activeBill.paymentStatus}
                                    </span>

                                </p>

                            </div>

                        </div>

                    </div>

                    {/* ================= PARTIES ================= */}

                    <div className="grid min-w-0 grid-cols-1 gap-6 border-b border-slate-200 py-6 sm:grid-cols-2 sm:gap-8 sm:py-8">

                        {/* Billed To */}

                        <div className="min-w-0 space-y-2">

                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Billed To
                            </h4>

                            <div className="space-y-1 text-xs">

                                <p className="break-words text-sm font-bold text-slate-900">
                                    {client?.clientName}
                                </p>

                                <p className="max-w-xs break-words leading-relaxed text-slate-500">
                                    {client?.address}
                                </p>

                                {client?.city && (
                                    <p className="break-words text-slate-500">
                                        {client.city},{" "}
                                        {client.state}{" "}
                                        {client.pincode}
                                    </p>
                                )}

                                {client?.phone && (
                                    <p className="pt-1 text-slate-500">
                                        Phone: {client.phone}
                                    </p>
                                )}

                                {client?.gstNumber && (
                                    <p className="break-all pt-1 font-semibold text-slate-700">
                                        GSTIN: {client.gstNumber}
                                    </p>
                                )}

                            </div>

                        </div>

                        {/* Bank Details */}

                        <div className="min-w-0 space-y-2">

                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Bank Settlement Details
                            </h4>

                            <div className="space-y-1 text-xs">

                                {company?.bankName ? (
                                    <>
                                        <p className="font-bold text-slate-800">
                                            {company.bankName}
                                        </p>

                                        <p className="break-all text-slate-500">
                                            A/C:{" "}
                                            <span className="font-mono font-semibold text-slate-800">
                                                {company.accountNumber}
                                            </span>
                                        </p>

                                        <p className="break-all text-slate-500">
                                            IFSC:{" "}
                                            <span className="font-mono font-semibold text-slate-800">
                                                {company.ifscCode}
                                            </span>
                                        </p>

                                        {company.branch && (
                                            <p className="text-slate-500">
                                                Branch:{" "}
                                                {company.branch}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p className="italic text-slate-400">
                                        No settlement bank profile configured.
                                    </p>
                                )}

                            </div>

                        </div>

                    </div>

                    {/* ================= LINE ITEMS ================= */}

                    <div className="w-full max-w-full overflow-x-auto py-6 sm:py-8">

                        <table className="min-w-[640px] w-full text-xs text-slate-600">

                            <thead>

                                <tr className="border-b border-slate-200 text-left font-bold uppercase tracking-wider text-slate-400">

                                    <th className="w-10 pb-3 text-center">
                                        #
                                    </th>

                                    <th className="min-w-[180px] pb-3">
                                        Item Description
                                    </th>

                                    <th className="w-16 pb-3 text-center">
                                        Qty
                                    </th>

                                    <th className="w-28 pb-3 text-right">
                                        Unit Price
                                    </th>

                                    <th className="w-20 pb-3 text-center">
                                        GST %
                                    </th>

                                    <th className="w-28 pb-3 pr-2 text-right">
                                        Amount
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {items.map(
                                    (item, index) => {

                                        const qty =
                                            Number(
                                                item.quantity
                                            ) || 0;

                                        const price =
                                            Number(
                                                item.unitPrice
                                            ) || 0;

                                        const gst =
                                            Number(
                                                item.gst
                                            ) || 0;

                                        const total =
                                            qty *
                                            price *
                                            (1 +
                                                gst / 100);

                                        return (
                                            <tr key={index}>

                                                <td className="py-3 text-center font-medium text-slate-400">
                                                    {index + 1}
                                                </td>

                                                <td className="py-3 break-words font-semibold text-slate-800">
                                                    {item.itemName}
                                                </td>

                                                <td className="py-3 text-center">
                                                    {qty}
                                                </td>

                                                <td className="whitespace-nowrap py-3 text-right">
                                                    {formatCurrency(
                                                        price
                                                    )}
                                                </td>

                                                <td className="py-3 text-center">
                                                    {gst}%
                                                </td>

                                                <td className="whitespace-nowrap py-3 pr-2 text-right font-mono font-semibold text-slate-900">
                                                    {formatCurrency(
                                                        total
                                                    )}
                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                    {/* ================= SUMMARY ================= */}

                    <div className="grid min-w-0 grid-cols-1 gap-6 border-t border-slate-200 pt-6 sm:grid-cols-2 sm:gap-8">

                        {/* Notes */}

                        <div className="min-w-0 space-y-4">

                            <div>

                                <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    Total Amount in Words
                                </span>

                                <p className="break-words text-xs font-semibold italic leading-relaxed text-slate-700">
                                    {activeBill.amountInWords}
                                </p>

                            </div>

                            {activeBill.notes && (
                                <div className="pt-2">

                                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        Terms & Conditions
                                    </span>

                                    <p className="whitespace-pre-line break-words text-[10px] leading-relaxed text-slate-500">
                                        {activeBill.notes}
                                    </p>

                                </div>
                            )}

                        </div>

                        {/* Totals */}

                        <div className="min-w-0 space-y-2 text-sm text-slate-600 sm:text-right">

                            <div className="flex items-center justify-between gap-4 sm:justify-end">

                                <span className="shrink-0 text-slate-400">
                                    Subtotal:
                                </span>

                                <span className="w-28 shrink-0 whitespace-nowrap font-mono font-semibold text-slate-800">
                                    {formatCurrency(
                                        activeBill.subTotal
                                    )}
                                </span>

                            </div>

                            <div className="flex items-center justify-between gap-4 sm:justify-end">

                                <span className="shrink-0 text-slate-400">
                                    Tax Total (GST):
                                </span>

                                <span className="w-28 shrink-0 whitespace-nowrap font-mono font-semibold text-slate-800">
                                    {formatCurrency(
                                        activeBill.gstTotal
                                    )}
                                </span>

                            </div>

                            {activeBill.discount > 0 && (
                                <div className="flex items-center justify-between gap-4 text-red-600 sm:justify-end">

                                    <span className="shrink-0 text-red-400">
                                        Discount Applied:
                                    </span>

                                    <span className="w-28 shrink-0 whitespace-nowrap font-mono font-semibold">
                                        -
                                        {formatCurrency(
                                            activeBill.discount
                                        )}
                                    </span>

                                </div>
                            )}

                            <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 text-slate-900 sm:justify-end">

                                <span className="shrink-0 text-sm font-bold">
                                    Grand Total (INR):
                                </span>

                                <span className="w-28 shrink-0 whitespace-nowrap font-mono text-lg font-extrabold text-indigo-700">
                                    {formatCurrency(
                                        activeBill.grandTotal
                                    )}
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* ================= FOOTER ================= */}

                    <div className="mt-10 border-t border-slate-100 pt-5 text-center text-[10px] text-slate-400 sm:mt-16 sm:pt-6">

                        <p>
                            Thank you for your business. Please settle outstanding dues within standard timelines.
                        </p>

                        <p className="mt-1 font-medium">
                            Generated via Billing ERP Enterprise Portal
                        </p>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
};

export default BillView;