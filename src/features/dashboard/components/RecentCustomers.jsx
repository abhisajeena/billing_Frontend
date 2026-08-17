import { Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecentCustomers = ({ clients = [] }) => {
    const navigate = useNavigate();

    const getInitials = (name) => {
        if (!name) return "C";

        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}
            <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">

                <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-slate-900">
                        Recent Customers
                    </h3>

                    <p className="mt-0.5 truncate text-xs text-slate-500">
                        Your latest customers
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/clients")}
                    className="flex shrink-0 items-center gap-1 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                    <span>View all</span>
                    <ArrowRight size={14} />
                </button>

            </div>

            {/* Customers */}
            <div className="divide-y divide-slate-100">

                {clients.length === 0 ? (

                    <div className="px-5 py-10 text-center">

                        <Users
                            size={28}
                            className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 text-sm text-slate-500">
                            No customers found
                        </p>

                    </div>

                ) : (

                    clients.slice(0, 5).map((client, index) => {

                        const name =
                            client.clientName ||
                            client.name ||
                            `Customer ${index + 1}`;

                        return (
                            <div
                                key={
                                    client._id ||
                                    client.id ||
                                    index
                                }
                                className="flex min-w-0 items-center gap-3 px-4 py-4 transition hover:bg-slate-50 sm:px-5"
                            >

                                {/* Avatar */}
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 sm:h-10 sm:w-10">
                                    {getInitials(name)}
                                </div>

                                {/* Customer Info */}
                                <div className="min-w-0 flex-1">

                                    <p className="truncate text-sm font-semibold text-slate-800">
                                        {name}
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-slate-400">
                                        {client.email ||
                                            client.phone ||
                                            "Customer account"}
                                    </p>

                                </div>

                            </div>
                        );
                    })

                )}

            </div>

        </div>
    );
};

export default RecentCustomers;