import Loader from "../../../../components/common/Loader";

import BillRow from "./BillRow";

const BillTable = ({
    bills = [],
    loading = false,
    onDelete,
}) => {
    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

            {/* Horizontal scroll only inside table */}
            <div className="w-full max-w-full overflow-x-auto">

                <table className="min-w-[850px] w-full text-sm">

                    <thead>

                        <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-xs font-semibold text-slate-500">

                            <th className="whitespace-nowrap px-5 py-4">
                                Invoice No
                            </th>

                            <th className="whitespace-nowrap px-5 py-4">
                                Client Name
                            </th>

                            <th className="whitespace-nowrap px-5 py-4">
                                Bill Date
                            </th>

                            <th className="whitespace-nowrap px-5 py-4">
                                Grand Total
                            </th>

                            <th className="whitespace-nowrap px-5 py-4">
                                Payment Status
                            </th>

                            <th className="whitespace-nowrap px-5 py-4 text-right">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-50">

                        {loading && bills.length === 0 ? (

                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-12 text-center"
                                >
                                    <Loader
                                        size={32}
                                        className="mx-auto animate-spin text-indigo-600"
                                    />

                                    <p className="mt-2 text-xs text-slate-500">
                                        Loading bills ledger...
                                    </p>

                                </td>
                            </tr>

                        ) : bills.length === 0 ? (

                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-12 text-center text-xs text-slate-500"
                                >
                                    No invoices found.
                                    Generate a new
                                    invoice above.
                                </td>
                            </tr>

                        ) : (

                            bills.map((bill) => (
                                <BillRow
                                    key={bill._id}
                                    bill={bill}
                                    onDelete={onDelete}
                                />
                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default BillTable;