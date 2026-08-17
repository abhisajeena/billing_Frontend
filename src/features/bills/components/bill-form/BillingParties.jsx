import ClientSelector from "./ClientSelector";

const BillingParties = ({
    company,
    clients,
    selectedClient,
    setSelectedClient,
}) => {
    return (
        <section className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">

            <h3 className="border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wider text-slate-800">
                Billing Parties
            </h3>

            <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">

                {/* Company */}
                <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-xs text-slate-600">

                    <h4 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                        Company Details (Issuer)
                    </h4>

                    {company ? (
                        <div className="min-w-0 space-y-1">

                            <p className="truncate text-sm font-bold text-slate-800">
                                {
                                    company.companyName
                                }
                            </p>

                            <p className="break-words leading-relaxed">
                                {company.address}
                            </p>

                            {company.gstNumber && (
                                <p className="mt-1 break-all font-semibold">
                                    GSTIN:{" "}
                                    {company.gstNumber}
                                </p>
                            )}

                            {company.phone && (
                                <p>
                                    Phone:{" "}
                                    {company.phone}
                                </p>
                            )}

                        </div>
                    ) : (
                        <p className="italic text-slate-400">
                            No company settings loaded.
                        </p>
                    )}

                </div>

                <ClientSelector
                    clients={clients}
                    selectedClient={
                        selectedClient
                    }
                    setSelectedClient={
                        setSelectedClient
                    }
                />

            </div>

        </section>
    );
};

export default BillingParties;