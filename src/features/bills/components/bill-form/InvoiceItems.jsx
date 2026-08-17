import { Plus } from "lucide-react";

import InvoiceItemRow from "./InvoiceItemRow";

const InvoiceItems = ({
    items,
    setItems,
}) => {
    const addRow = () => {
        setItems((currentItems) => [
            ...currentItems,
            {
                itemName: "",
                quantity: 1,
                unitPrice: 0,
                gst: 18,
            },
        ]);
    };

    const removeRow = (index) => {
        setItems((currentItems) => {
            if (currentItems.length === 1) {
                return currentItems;
            }

            return currentItems.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            );
        });
    };

    const updateItem = (
        index,
        field,
        value
    ) => {
        setItems((currentItems) =>
            currentItems.map(
                (item, itemIndex) =>
                    itemIndex === index
                        ? {
                              ...item,
                              [field]:
                                  value,
                          }
                        : item
            )
        );
    };

    return (
        <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Invoice Line Items
                </h3>

                <button
                    type="button"
                    onClick={addRow}
                    className="flex h-9 w-full items-center justify-center gap-1 rounded-lg border border-indigo-200 px-3.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 sm:w-auto"
                >
                    <Plus size={14} />
                    Add Row
                </button>

            </div>

            <div className="mt-4 w-full max-w-full overflow-x-auto rounded-xl border border-slate-100">

                <table className="min-w-[760px] w-full text-sm">

                    <thead>
                        <tr className="border-b border-slate-100 text-left text-slate-400">

                            <th className="min-w-[200px] pb-3 font-semibold">
                                Item Description
                            </th>

                            <th className="w-14 pb-3 text-center font-semibold">
                                Qty
                            </th>

                            <th className="w-28 pb-3 text-right font-semibold">
                                Unit Price
                            </th>

                            <th className="w-24 pb-3 text-center font-semibold">
                                GST %
                            </th>

                            <th className="w-28 pb-3 text-right font-semibold">
                                Amount
                            </th>

                            <th className="w-8 pb-3" />

                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-50">

                        {items.map(
                            (item, index) => (
                                <InvoiceItemRow
                                    key={index}
                                    item={item}
                                    index={index}
                                    onChange={updateItem}
                                    onRemove={
                                        removeRow
                                    }
                                />
                            )
                        )}

                    </tbody>

                </table>

            </div>

        </section>
    );
};

export default InvoiceItems;    