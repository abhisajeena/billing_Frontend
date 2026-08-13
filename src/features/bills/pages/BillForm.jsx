import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import useCompanyStore from "../../company/store/company.store";
import useClientStore from "../../clients/store/clients.store";
import useBillStore from "../store/bills.store";
import Button from "../../../components/common/Button";
import toast from "react-hot-toast";
import { ChevronLeft, Plus, Trash2, Calendar, Search, CreditCard, Save, Printer, UserCheck } from "lucide-react";

// Number to Words pure JS converter matching backend format
const toWords = (s) => {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const scales = ['', 'thousand', 'million', 'billion'];

    const num = Math.round(Number(s));
    if (num === 0) return 'Zero';

    const formatGroup = (n) => {
        let str = '';
        if (n >= 100) {
            str += ones[Math.floor(n / 100)] + ' hundred ';
            n %= 100;
        }
        if (n >= 20) {
            str += tens[Math.floor(n / 10)] + ' ';
            n %= 10;
        }
        if (n > 0) {
            str += ones[n] + ' ';
        }
        return str.trim();
    };

    let parts = [];
    let scaleIndex = 0;
    let temp = num;
    while (temp > 0) {
        let group = temp % 1000;
        if (group > 0) {
            let groupStr = formatGroup(group);
            if (scales[scaleIndex]) {
                groupStr += ' ' + scales[scaleIndex];
            }
            parts.unshift(groupStr);
        }
        temp = Math.floor(temp / 1000);
        scaleIndex++;
    }

    return parts.join(' ')
        .replace(/\b\w/g, char => char.toUpperCase())
        .trim();
};

const GST_PRESETS = [0, 5, 12, 18, 28];

const BillForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    // Stores
    const { company, fetchCompany } = useCompanyStore();
    const { clients, fetchClients } = useClientStore();
    const { createBill, updateBill, fetchBillById, loading: billLoading } = useBillStore();

    // Form fields
    const [billDate, setBillDate] = useState(new Date().toISOString().substring(0, 10));
    const [selectedClient, setSelectedClient] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState("Pending");
    const [notes, setNotes] = useState("");
    const [billNumber, setBillNumber] = useState("INV-XXXX");

    // Line items state
    const [items, setItems] = useState([
        { itemName: "", quantity: 1, unitPrice: 0, gst: 18, total: 0 }
    ]);

    // UI States
    const [clientSearchText, setClientSearchText] = useState("");
    const [showClientDropdown, setShowClientDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Initial Loading
    useEffect(() => {
        const init = async () => {
            await fetchCompany();
            await fetchClients(1, 100, "");
            
            if (isEditMode) {
                const bill = await fetchBillById(id);
                if (bill) {
                    setBillNumber(bill.billNumber || "INV-XXXX");
                    setBillDate(new Date(bill.billDate).toISOString().substring(0, 10));
                    setSelectedClient(bill.client);
                    setDiscount(bill.discount || 0);
                    setPaymentStatus(bill.paymentStatus || "Pending");
                    setNotes(bill.notes || "");
                    
                    // Map items (converting string numbers if necessary)
                    const mappedItems = bill.items.map(item => ({
                        itemName: item.itemName,
                        quantity: Number(item.quantity) || 1,
                        unitPrice: Number(item.unitPrice) || 0,
                        gst: Number(item.gst) || 0,
                        total: Number(item.total) || 0
                    }));
                    setItems(mappedItems);
                }
            }
        };
        init();
    }, [id, fetchCompany, fetchClients, fetchBillById, isEditMode]);

    // Handle clicking outside client dropdown to close it
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowClientDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // live calculations
    let subTotal = 0;
    let gstTotal = 0;
    const computedItems = items.map(item => {
        const qty = Number(item.quantity) || 0;
        const rate = Number(item.unitPrice) || 0;
        const gstPercent = Number(item.gst) || 0;

        const baseTotal = qty * rate;
        const gstAmount = (baseTotal * gstPercent) / 100;
        const rowTotal = baseTotal + gstAmount;

        subTotal += baseTotal;
        gstTotal += gstAmount;

        return {
            ...item,
            total: rowTotal
        };
    });

    const grandTotal = subTotal + gstTotal - Number(discount || 0);
    const amountInWords = toWords(grandTotal) + " Rupees Only";

    // Item row edits
    const handleItemChange = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    const addRow = () => {
        setItems([...items, { itemName: "", quantity: 1, unitPrice: 0, gst: 18, total: 0 }]);
    };

    const removeRow = (index) => {
        if (items.length === 1) {
            toast.error("An invoice must contain at least one line item.");
            return;
        }
        const updated = items.filter((_, i) => i !== index);
        setItems(updated);
    };

    const handleSave = async (andPrint = false) => {
        if (!company) {
            toast.error("Please set up your Company Profile before issuing invoices.");
            navigate("/company");
            return;
        }
        if (!selectedClient) {
            toast.error("Please select a customer.");
            return;
        }

        // Validate items
        const invalidItem = items.find(item => !item.itemName.trim() || Number(item.quantity) <= 0 || Number(item.unitPrice) < 0);
        if (invalidItem) {
            toast.error("Please complete all line items. Quantities must exceed 0, and item names cannot be blank.");
            return;
        }

        const payload = {
            client: selectedClient._id,
            billDate,
            items: computedItems.map(item => ({
                itemName: item.itemName,
                quantity: Number(item.quantity),
                unitPrice: Number(item.unitPrice),
                gst: Number(item.gst)
            })),
            discount: Number(discount),
            paymentStatus,
            notes
        };

        try {
            let res;
            if (isEditMode) {
                res = await updateBill(id, payload);
                if (res.success) {
                    toast.success("Invoice updated successfully!");
                }
            } else {
                res = await createBill(payload);
                if (res.success) {
                    toast.success("Invoice created successfully!");
                }
            }

            if (res.success) {
                const billId = res.data._id;
                if (andPrint) {
                    navigate(`/bills/view/${billId}`);
                } else {
                    navigate("/bills");
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to save invoice.");
        }
    };

    // Client filtering options
    const filteredClients = clients.filter(c =>
        c.clientName.toLowerCase().includes(clientSearchText.toLowerCase()) ||
        c.phone.includes(clientSearchText)
    );

    return (
        <DashboardLayout>
            <div className="space-y-6 max-w-6xl mx-auto">
                {/* Back button and page title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Link to="/bills" className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition mr-1">
                            <ChevronLeft size={16} />
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">
                                {isEditMode ? `Edit Invoice: ${billNumber}` : "Draft New Invoice"}
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">
                                {isEditMode ? "Update details of the saved invoice" : "Create a boardroom-ready invoice in seconds"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Company Warnings */}
                {!company && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-800 text-sm">
                        <div>
                            <p className="font-bold">Company Profile Incomplete</p>
                            <p className="text-xs text-amber-700 mt-0.5">You must fill in your company information (address, bank coordinates) to generate invoices.</p>
                        </div>
                        <Link to="/company" className="h-9 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center transition shadow">
                            Setup Profile
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Compositor Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Parties Block */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
                            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
                                Billing Parties
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Side: Company details */}
                                <div className="space-y-3 bg-slate-50/50 rounded-xl p-4 border border-slate-100 text-xs text-slate-600">
                                    <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Company Details (Issuer)</h4>
                                    {company ? (
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-800 text-sm">{company.companyName}</p>
                                            <p className="leading-relaxed">{company.address}</p>
                                            {company.gstNumber && <p className="font-semibold mt-1">GSTIN: {company.gstNumber}</p>}
                                            {company.phone && <p>Phone: {company.phone}</p>}
                                        </div>
                                    ) : (
                                        <p className="text-slate-400 italic">No company settings loaded.</p>
                                    )}
                                </div>

                                {/* Right Side: Customer Search & Select */}
                                <div className="space-y-3 relative" ref={dropdownRef}>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        Client Details (Billed To) *
                                    </label>
                                    
                                    {!selectedClient ? (
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                                <Search size={16} />
                                            </span>
                                            <input
                                                type="text"
                                                value={clientSearchText}
                                                onChange={(e) => {
                                                    setClientSearchText(e.target.value);
                                                    setShowClientDropdown(true);
                                                }}
                                                onFocus={() => setShowClientDropdown(true)}
                                                placeholder="Search and select client name..."
                                                className="w-full h-11 pl-9 pr-4 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                                            />

                                            {/* Dropdown Options */}
                                            {showClientDropdown && (
                                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 shadow-xl rounded-xl max-h-52 overflow-y-auto z-30 divide-y divide-slate-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                                    {filteredClients.length === 0 ? (
                                                        <div className="p-3.5 text-center text-slate-450 text-xs">
                                                            No matches found.{" "}
                                                            <Link to="/clients" className="text-indigo-650 hover:underline font-semibold">
                                                                Add new client
                                                            </Link>
                                                        </div>
                                                    ) : (
                                                        filteredClients.map(c => (
                                                            <button
                                                                key={c._id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedClient(c);
                                                                    setShowClientDropdown(false);
                                                                    setClientSearchText("");
                                                                }}
                                                                className="w-full px-4 py-2.5 text-left text-xs text-slate-700 hover:bg-indigo-50/50 hover:text-indigo-700 font-medium transition-colors"
                                                            >
                                                                <p className="font-semibold text-slate-900">{c.clientName}</p>
                                                                <p className="text-[10px] text-slate-400 mt-0.5">{c.phone} | {c.city || "No City"}</p>
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 text-xs text-slate-600 flex justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 font-bold text-indigo-750 text-sm">
                                                    <UserCheck size={14} />
                                                    {selectedClient.clientName}
                                                </div>
                                                <p className="leading-relaxed mt-1">{selectedClient.address}</p>
                                                {selectedClient.gstNumber && <p className="font-semibold mt-1">GSTIN: {selectedClient.gstNumber}</p>}
                                                <p>Phone: {selectedClient.phone}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedClient(null)}
                                                className="text-xs font-semibold text-indigo-600 hover:underline shrink-0"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Line Items Table */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                                    Invoice Line Items
                                </h3>
                                <button
                                    type="button"
                                    onClick={addRow}
                                    className="h-9 px-3.5 border border-indigo-200 text-indigo-650 hover:bg-indigo-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition"
                                >
                                    <Plus size={14} />
                                    Add Row
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-slate-400 font-semibold border-b border-slate-100">
                                            <th className="pb-3 font-semibold w-1/2 min-w-[200px]">Item Description</th>
                                            <th className="pb-3 font-semibold text-center w-14">Qty</th>
                                            <th className="pb-3 font-semibold text-right w-28">Unit Price</th>
                                            <th className="pb-3 font-semibold text-center w-24">GST %</th>
                                            <th className="pb-3 font-semibold text-right w-28">Amount</th>
                                            <th className="pb-3 w-8"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {items.map((item, index) => {
                                            const qty = Number(item.quantity) || 0;
                                            const price = Number(item.unitPrice) || 0;
                                            const gst = Number(item.gst) || 0;
                                            const rowAmount = (qty * price) * (1 + gst / 100);

                                            return (
                                                <tr key={index} className="hover:bg-slate-50/20 transition-colors">
                                                    <td className="py-3 pr-2">
                                                        <input
                                                            type="text"
                                                            value={item.itemName}
                                                            onChange={(e) => handleItemChange(index, "itemName", e.target.value)}
                                                            placeholder="Product or service description"
                                                            className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 font-medium"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-1 text-center">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                                                            className="w-14 h-10 text-center bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 font-medium"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-1 text-right">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={item.unitPrice}
                                                            onChange={(e) => handleItemChange(index, "unitPrice", Number(e.target.value))}
                                                            className="w-28 h-10 text-right pr-3 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 font-semibold"
                                                        />
                                                    </td>
                                                    <td className="py-3 px-1 text-center">
                                                        <select
                                                            value={item.gst}
                                                            onChange={(e) => handleItemChange(index, "gst", Number(e.target.value))}
                                                            className="w-24 h-10 text-center bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 font-semibold"
                                                        >
                                                            {GST_PRESETS.map(p => (
                                                                <option key={p} value={p}>{p}%</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="py-3 pl-2 text-right font-semibold text-slate-900 font-mono text-xs pr-2">
                                                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(rowAmount)}
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeRow(index)}
                                                            className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-50 transition"
                                                            title="Delete Line"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Column: Settings / Totals Block */}
                    <div className="space-y-6">
                        {/* Dates & Status Controls */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
                                Settings
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Invoice Date
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                        <Calendar size={16} />
                                    </span>
                                    <input
                                        type="date"
                                        value={billDate}
                                        onChange={(e) => setBillDate(e.target.value)}
                                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Payment Status
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                        <CreditCard size={16} />
                                    </span>
                                    <select
                                        value={paymentStatus}
                                        onChange={(e) => setPaymentStatus(e.target.value)}
                                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white appearance-none font-semibold"
                                    >
                                        <option value="Pending">🕒 Pending Settlement</option>
                                        <option value="Paid">✅ Settled & Paid</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Summary Calculations */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 text-sm text-slate-600">
                            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wider">
                                Invoice Summary
                            </h3>

                            <div className="flex justify-between items-center py-0.5">
                                <span>Subtotal</span>
                                <span className="font-semibold text-slate-800">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(subTotal)}</span>
                            </div>

                            <div className="flex justify-between items-center py-0.5">
                                <span>Tax Total (GST)</span>
                                <span className="font-semibold text-slate-800">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(gstTotal)}</span>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <span>Discount (Flat INR)</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={discount}
                                        onChange={(e) => setDiscount(Math.max(0, Number(e.target.value) || 0))}
                                        className="w-24 h-8 text-right pr-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-slate-900">
                                <span className="font-bold">Grand Total</span>
                                <span className="font-extrabold text-indigo-700 text-lg font-mono">
                                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(grandTotal)}
                                </span>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[10px] leading-relaxed text-slate-550 italic font-medium">
                                <span className="block font-bold text-slate-400 not-italic uppercase tracking-wide mb-0.5">Amount in words:</span>
                                {amountInWords}
                            </div>
                        </div>

                        {/* Extra Notes */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-3">
                            <label className="block text-xs font-semibold text-slate-550 uppercase tracking-wider">
                                Terms or Internal Notes
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all min-h-[60px]"
                                placeholder="Terms, warranty conditions, payment instructions..."
                            />
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <Button
                                onClick={() => handleSave(false)}
                                variant="primary"
                                icon={<Save size={16} />}
                                loading={billLoading}
                            >
                                {isEditMode ? "Update Invoice" : "Save Invoice Draft"}
                            </Button>

                            <button
                                type="button"
                                onClick={() => handleSave(true)}
                                className="w-full h-12 rounded-xl border border-indigo-650 hover:bg-indigo-50 text-indigo-650 font-bold flex items-center justify-center gap-2 transition"
                            >
                                <Printer size={16} />
                                Save & View Invoice
                            </button>

                            <Link
                                to="/bills"
                                className="w-full h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center justify-center transition text-sm"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BillForm;
