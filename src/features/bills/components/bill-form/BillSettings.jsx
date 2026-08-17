import {
    Calendar,
    CreditCard,
} from "lucide-react";

const BillSettings = ({
    billDate,
    setBillDate,
    paymentStatus,
    setPaymentStatus,
}) => {
    return (
        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">

            <h3 className="border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wider text-slate-800">
                Settings
            </h3>

            <div className="mt-4 space-y-4">

                <div>

                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Invoice Date
                    </label>

                    <div className="relative">

                        <Calendar
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="date"
                            value={billDate}
                            onChange={(e) =>
                                setBillDate(
                                    e.target.value
                                )
                            }
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs text-slate-800 outline-none transition focus:ring-2 focus:ring-indigo-500"
                        />

                    </div>

                </div>

                <div>

                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Payment Status
                    </label>

                    <div className="relative">

                        <CreditCard
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <select
                            value={
                                paymentStatus
                            }
                            onChange={(e) =>
                                setPaymentStatus(
                                    e.target.value
                                )
                            }
                            className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs font-semibold text-slate-800 outline-none transition focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Pending">
                                Pending Settlement
                            </option>

                            <option value="Paid">
                                Settled & Paid
                            </option>
                        </select>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default BillSettings;