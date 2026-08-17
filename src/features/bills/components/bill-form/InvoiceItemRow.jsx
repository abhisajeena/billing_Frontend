import { Trash2 } from "lucide-react";

import {
    GST_PRESETS,
} from "../../utils/billCalculations";

import {
    formatCurrency,
} from "../../utils/billFormatters";

const InvoiceItemRow = ({
    item,
    index,
    onChange,
    onRemove,
}) => {
    const quantity =
        Number(item.quantity) || 0;

    const unitPrice =
        Number(item.unitPrice) || 0;

    const gst =
        Number(item.gst) || 0;

    const baseAmount =
        quantity * unitPrice;

    const gstAmount =
        (baseAmount * gst) / 100;

    const total =
        baseAmount + gstAmount;

    return (
        <tr className="transition hover:bg-slate-50/20">

            <td className="py-3 pr-2">
                <input
                    type="text"
                    value={item.itemName}
                    onChange={(e) =>
                        onChange(
                            index,
                            "itemName",
                            e.target.value
                        )
                    }
                    placeholder="Product or service description"
                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />
            </td>

            <td className="px-1 py-3 text-center">

                <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                        onChange(
                            index,
                            "quantity",
                            e.target.value
                        )
                    }
                    className="h-10 w-14 rounded-lg border border-slate-200 bg-slate-50 text-center text-xs font-medium text-slate-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />

            </td>

            <td className="px-1 py-3 text-right">

                <input
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) =>
                        onChange(
                            index,
                            "unitPrice",
                            e.target.value
                        )
                    }
                    className="h-10 w-28 rounded-lg border border-slate-200 bg-slate-50 pr-3 text-right text-xs font-semibold text-slate-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                />

            </td>

            <td className="px-1 py-3 text-center">

                <select
                    value={item.gst}
                    onChange={(e) =>
                        onChange(
                            index,
                            "gst",
                            e.target.value
                        )
                    }
                    className="h-10 w-24 rounded-lg border border-slate-200 bg-slate-50 text-center text-xs font-semibold text-slate-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                    {GST_PRESETS.map(
                        (gstValue) => (
                            <option
                                key={gstValue}
                                value={gstValue}
                            >
                                {gstValue}%
                            </option>
                        )
                    )}
                </select>

            </td>

            <td className="whitespace-nowrap py-3 pl-2 pr-2 text-right font-mono text-xs font-semibold text-slate-900">
                {formatCurrency(total)}
            </td>

            <td className="py-3 text-right">

                <button
                    type="button"
                    onClick={() =>
                        onRemove(index)
                    }
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-red-600"
                    title="Delete Line"
                >
                    <Trash2 size={15} />
                </button>

            </td>

        </tr>
    );
};

export default InvoiceItemRow;