import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import useBillStore from "../store/bills.store";
import Loader from "../../../components/common/Loader";
import { ChevronLeft, Printer, CreditCard, Calendar } from "lucide-react";

const BillView = () => {
    const { id } = useParams();
    const { activeBill, loading, fetchBillById } = useBillStore();

    useEffect(() => {
        fetchBillById(id);
    }, [id, fetchBillById]);

    const handlePrint = () => {
        window.print();
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR"
        }).format(val || 0);
    };

    if (loading && !activeBill) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] print:hidden">
                    <Loader size={40} className="text-indigo-600 animate-spin" />
                    <p className="text-xs text-slate-500 mt-2">Loading invoice layout...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!activeBill) {
        return (
            <DashboardLayout>
                <div className="text-center py-12 max-w-md mx-auto print:hidden">
                    <p className="text-slate-500 font-medium mb-4">Invoice not found or deleted.</p>
                    <Link to="/bills" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
                        Back to Ledger
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    const { company, client, items = [] } = activeBill;

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Control bar (Hidden during Print) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                    <div className="flex items-center gap-2">
                        <Link to="/bills" className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition mr-1">
                            <ChevronLeft size={16} />
                        </Link>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Invoice Draft</h2>
                            <p className="text-xs text-slate-500 font-medium">Verify terms and print or save invoice</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="h-10 px-4 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-650/15 transition cursor-pointer"
                        >
                            <Printer size={15} />
                            Print / Save as PDF
                        </button>
                    </div>
                </div>

                {/* Printable Invoice Boardroom Layout */}
                <div className="bg-white rounded-2xl border border-slate-100 p-8 sm:p-12 shadow-sm relative overflow-hidden print:p-0 print:border-0 print:shadow-none print:w-full">
                    {/* Corner decorative banner (Hidden during Print) */}
                    <div className={`absolute top-0 right-0 px-6 py-1.5 text-[10px] uppercase font-extrabold tracking-widest border-b border-l rounded-bl-xl print:hidden ${
                        activeBill.paymentStatus === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-amber-50 text-amber-700 border-amber-100"
                    }`}>
                        {activeBill.paymentStatus}
                    </div>

                    {/* Invoice Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-slate-150">
                        {/* Company coordinates */}
                        <div className="space-y-2.5">
                            {company?.logo ? (
                                <img src={company.logo} alt="Company Logo" className="h-12 w-auto object-contain mb-3" />
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-lg font-extrabold text-white mb-3">
                                    {company?.companyName?.charAt(0) || "B"}
                                </div>
                            )}
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                                    {company?.companyName || "Issuer Company"}
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mt-1">
                                    {company?.address}
                                </p>
                            </div>
                            <div className="text-xs text-slate-500 space-y-0.5">
                                {company?.phone && <p>Phone: {company.phone}</p>}
                                {company?.email && <p>Email: {company.email}</p>}
                                {company?.gstNumber && <p className="font-semibold text-slate-700 mt-1">GSTIN: {company.gstNumber}</p>}
                            </div>
                        </div>

                        {/* Invoice Metadata */}
                        <div className="sm:text-right space-y-4">
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-indigo-700">INVOICE</h1>
                                <p className="font-mono text-xs font-bold text-slate-600 mt-1">
                                    No: {activeBill.billNumber}
                                </p>
                            </div>

                            <div className="text-xs text-slate-500 space-y-1">
                                <p className="flex sm:justify-end items-center gap-1.5">
                                    <Calendar size={13} className="text-slate-400" />
                                    <span>Date:</span>
                                    <span className="font-bold text-slate-800">
                                        {new Date(activeBill.billDate).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </span>
                                </p>
                                <p className="flex sm:justify-end items-center gap-1.5">
                                    <CreditCard size={13} className="text-slate-400" />
                                    <span>Status:</span>
                                    <span className={`font-bold ${activeBill.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-500"}`}>
                                        {activeBill.paymentStatus}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Parties Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-slate-150">
                        {/* Billed To Details */}
                        <div className="space-y-2">
                            <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Billed To</h4>
                            <div className="space-y-1 text-xs">
                                <p className="font-bold text-sm text-slate-900">{client?.clientName}</p>
                                <p className="text-slate-500 leading-relaxed max-w-xs">{client?.address}</p>
                                {client?.city && <p className="text-slate-500">{client.city}, {client.state} {client.pincode}</p>}
                                {client?.phone && <p className="text-slate-500 pt-1">Phone: {client.phone}</p>}
                                {client?.gstNumber && <p className="font-semibold text-slate-700 pt-1">GSTIN: {client.gstNumber}</p>}
                            </div>
                        </div>

                        {/* Payment Settlement Information */}
                        <div className="space-y-2">
                            <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Bank Settlement Details</h4>
                            <div className="space-y-1 text-xs">
                                {company?.bankName ? (
                                    <>
                                        <p className="font-bold text-slate-800">{company.bankName}</p>
                                        <p className="text-slate-500">A/C: <span className="font-mono font-semibold text-slate-800">{company.accountNumber}</span></p>
                                        <p className="text-slate-500">IFSC: <span className="font-mono font-semibold text-slate-800">{company.ifscCode}</span></p>
                                        {company.branch && <p className="text-slate-500">Branch: {company.branch}</p>}
                                    </>
                                ) : (
                                    <p className="text-slate-400 italic">No settlement bank profile configured.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="py-8">
                        <table className="w-full text-xs text-slate-600">
                            <thead>
                                <tr className="text-left text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200">
                                    <th className="pb-3 w-12 text-center">#</th>
                                    <th className="pb-3 w-1/2">Item Description</th>
                                    <th className="pb-3 text-center">Qty</th>
                                    <th className="pb-3 text-right">Unit Price</th>
                                    <th className="pb-3 text-center">GST %</th>
                                    <th className="pb-3 text-right pr-2">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {items.map((item, index) => {
                                    const qty = Number(item.quantity) || 0;
                                    const price = Number(item.unitPrice) || 0;
                                    const gst = Number(item.gst) || 0;
                                    const total = qty * price * (1 + gst / 100);

                                    return (
                                        <tr key={index}>
                                            <td className="py-3 text-center font-medium text-slate-400">
                                                {index + 1}
                                            </td>
                                            <td className="py-3 font-semibold text-slate-800">
                                                {item.itemName}
                                            </td>
                                            <td className="py-3 text-center">
                                                {qty}
                                            </td>
                                            <td className="py-3 text-right">
                                                {formatCurrency(price)}
                                            </td>
                                            <td className="py-3 text-center">
                                                {gst}%
                                            </td>
                                            <td className="py-3 text-right font-mono font-semibold text-slate-900 pr-2">
                                                {formatCurrency(total)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary and Calculations Block */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-150">
                        {/* Summary & Word representation */}
                        <div className="space-y-4">
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                                    Total Amount in Words
                                </span>
                                <p className="text-xs text-slate-700 italic font-semibold leading-relaxed">
                                    {activeBill.amountInWords}
                                </p>
                            </div>

                            {activeBill.notes && (
                                <div className="pt-2">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                                        Terms & Conditions
                                    </span>
                                    <p className="text-[10px] text-slate-500 leading-relaxed max-w-sm whitespace-pre-line">
                                        {activeBill.notes}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Financial figures */}
                        <div className="space-y-2 text-sm text-slate-650 md:text-right">
                            <div className="flex md:justify-end gap-12 py-0.5">
                                <span className="text-slate-400 font-medium">Subtotal:</span>
                                <span className="font-semibold text-slate-850 font-mono w-28">{formatCurrency(activeBill.subTotal)}</span>
                            </div>

                            <div className="flex md:justify-end gap-12 py-0.5">
                                <span className="text-slate-400 font-medium">Tax Total (GST):</span>
                                <span className="font-semibold text-slate-850 font-mono w-28">{formatCurrency(activeBill.gstTotal)}</span>
                            </div>

                            {activeBill.discount > 0 && (
                                <div className="flex md:justify-end gap-12 py-0.5 text-red-650">
                                    <span className="text-red-400 font-medium">Discount Applied:</span>
                                    <span className="font-semibold font-mono w-28">-{formatCurrency(activeBill.discount)}</span>
                                </div>
                            )}

                            <div className="flex md:justify-end gap-12 pt-3 border-t border-slate-100 text-slate-900">
                                <span className="font-bold text-sm">Grand Total (INR):</span>
                                <span className="font-extrabold text-indigo-700 text-lg font-mono w-28">
                                    {formatCurrency(activeBill.grandTotal)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Corporate Footer terms */}
                    <div className="mt-16 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-6">
                        <p>Thank you for your business. Please settle outstanding dues within standard timelines.</p>
                        <p className="mt-1 font-medium">Generated via Billing ERP Enterprise Portal</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BillView;
