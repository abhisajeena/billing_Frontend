import { formatCurrency } from "../../utils/billFormatters";

const BillSummary = ({
    subTotal,
    gstTotal,
    discount,
    setDiscount,
    grandTotal,
    amountInWords,
}) => {
    return (
        <section className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600 shadow-sm sm:p-6">

            <h3 className="border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wider text-slate-800">
                Invoice Summary
            </h3>

            <div className="mt-4 space-y-3">

                <div className="flex items-center justify-between gap-4">
                    <span>
                        Subtotal
                    </span>

                    <span className="whitespace-nowrap font-semibold text-slate-800">
                        {formatCurrency(
                            subTotal
                        )}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <span>
                        Tax Total (GST)
                    </span>

                    <span className="whitespace-nowrap font-semibold text-slate-800">
                        {formatCurrency(
                            gstTotal
                        )}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-4">

                    <span>
                        Discount
                    </span>

                    <input
                        type="number"
                        min="0"
                        value={discount}
                        onChange={(e) =>
                            setDiscount(
                                e.target.value
                            )
                        }
                        className="h-8 w-24 rounded-lg border border-slate-200 bg-slate-50 pr-2 text-right text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                    />

                </div>

                <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 text-slate-900">

                    <span className="font-bold">
                        Grand Total
                    </span>

                    <span className="whitespace-nowrap font-mono text-lg font-extrabold text-indigo-700">
                        {formatCurrency(
                            grandTotal
                        )}
                    </span>

                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-[10px] font-medium italic leading-relaxed text-slate-500">

                    <span className="mb-0.5 block font-bold uppercase tracking-wide not-italic text-slate-400">
                        Amount in words:
                    </span>

                    {amountInWords}

                </div>

            </div>

        </section>
    );
};

export default BillSummary;