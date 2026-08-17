const BillNotes = ({
    notes,
    setNotes,
}) => {
    return (
        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">

            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Terms or Internal Notes
            </label>

            <textarea
                value={notes}
                onChange={(e) =>
                    setNotes(
                        e.target.value
                    )
                }
                className="min-h-[80px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                placeholder="Terms, warranty conditions, payment instructions..."
            />

        </section>
    );
};

export default BillNotes;