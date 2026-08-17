import {
    Calendar,
    Edit2,
    Eye,
    Trash2,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
    formatCurrency,
    formatDate,
} from "../../utils/billFormatters";

const BillRow = ({
    bill,
    onDelete,
}) => {
    return (
        <tr className="transition hover:bg-slate-50">

            {/* Invoice */}
            <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-semibold text-slate-900">
                {bill.billNumber}
            </td>

            {/* Client */}
            <td className="max-w-[220px] px-5 py-4 font-medium text-slate-800">

                <Link
                    to={`/clients/${
                        bill.client?._id ||
                        bill.client
                    }`}
                    className="block truncate hover:text-indigo-600"
                >
                    {bill.client?.clientName ||
                        "Unknown Client"}
                </Link>

            </td>

            {/* Date */}
            <td className="whitespace-nowrap px-5 py-4 text-xs">

                <span className="flex items-center gap-1.5 text-slate-500">

                    <Calendar
                        size={13}
                        className="shrink-0 text-slate-400"
                    />

                    {formatDate(bill.billDate)}

                </span>

            </td>

            {/* Amount */}
            <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-semibold text-slate-900">
                {formatCurrency(
                    bill.grandTotal
                )}
            </td>

            {/* Status */}
            <td className="whitespace-nowrap px-5 py-4">

                <span
                    className={`
                        inline-flex
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
                    {bill.paymentStatus}
                </span>

            </td>

            {/* Actions */}
            <td className="px-5 py-4">

                <div className="flex items-center justify-end gap-2">

                    <Link
                        to={`/bills/view/${bill._id}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
                        title="View/Print Invoice"
                    >
                        <Eye size={14} />
                    </Link>

                    <Link
                        to={`/bills/edit/${bill._id}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
                        title="Edit Invoice"
                    >
                        <Edit2 size={14} />
                    </Link>

                    <button
                        type="button"
                        onClick={(e) =>
                            onDelete(
                                e,
                                bill._id,
                                bill.billNumber
                            )
                        }
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-red-600"
                        title="Delete Invoice"
                    >
                        <Trash2 size={14} />
                    </button>

                </div>

            </td>

        </tr>
    );
};

export default BillRow;