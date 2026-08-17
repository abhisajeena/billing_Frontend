import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    UserCheck,
} from "lucide-react";

const ClientSelector = ({
    clients = [],
    selectedClient,
    setSelectedClient,
}) => {
    const [searchText, setSearchText] =
        useState("");

    const [showDropdown, setShowDropdown] =
        useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target
                )
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
    }, []);

    const filteredClients = clients.filter(
        (client) => {
            const name =
                client.clientName || "";

            const phone =
                client.phone || "";

            const query =
                searchText.toLowerCase();

            return (
                name
                    .toLowerCase()
                    .includes(query) ||
                phone.includes(searchText)
            );
        }
    );

    return (
        <div
            ref={dropdownRef}
            className="relative min-w-0 space-y-3"
        >

            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Client Details (Billed To) *
            </label>

            {!selectedClient ? (

                <div className="relative">

                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={searchText}
                        onChange={(event) => {
                            setSearchText(
                                event.target.value
                            );
                            setShowDropdown(true);
                        }}
                        onFocus={() =>
                            setShowDropdown(true)
                        }
                        placeholder="Search and select client name..."
                        className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-800 outline-none transition focus:ring-2 focus:ring-indigo-500"
                    />

                    {showDropdown && (
                        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-52 overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-xl">

                            {filteredClients.length ===
                            0 ? (

                                <div className="p-4 text-center text-xs text-slate-500">

                                    No matches found.{" "}

                                    <Link
                                        to="/clients"
                                        className="font-semibold text-indigo-600 hover:underline"
                                    >
                                        Add new client
                                    </Link>

                                </div>

                            ) : (

                                filteredClients.map(
                                    (client) => (
                                        <button
                                            key={
                                                client._id
                                            }
                                            type="button"
                                            onClick={() => {
                                                setSelectedClient(
                                                    client
                                                );
                                                setSearchText(
                                                    ""
                                                );
                                                setShowDropdown(
                                                    false
                                                );
                                            }}
                                            className="w-full px-4 py-3 text-left text-xs font-medium text-slate-700 transition hover:bg-indigo-50"
                                        >
                                            <p className="font-semibold text-slate-900">
                                                {
                                                    client.clientName
                                                }
                                            </p>

                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                {
                                                    client.phone
                                                }{" "}
                                                |{" "}
                                                {client.city ||
                                                    "No City"}
                                            </p>
                                        </button>
                                    )
                                )
                            )}

                        </div>
                    )}

                </div>

            ) : (

                <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs text-slate-600 sm:flex-row sm:items-start sm:justify-between">

                    <div className="min-w-0 space-y-1">

                        <div className="flex min-w-0 items-center gap-1.5 font-bold text-sm text-indigo-700">

                            <UserCheck
                                size={14}
                                className="shrink-0"
                            />

                            <span className="truncate">
                                {
                                    selectedClient.clientName
                                }
                            </span>

                        </div>

                        <p className="break-words leading-relaxed">
                            {
                                selectedClient.address
                            }
                        </p>

                        {selectedClient.gstNumber && (
                            <p className="break-all font-semibold">
                                GSTIN:{" "}
                                {
                                    selectedClient.gstNumber
                                }
                            </p>
                        )}

                        <p>
                            Phone:{" "}
                            {selectedClient.phone}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setSelectedClient(
                                null
                            )
                        }
                        className="shrink-0 self-start text-xs font-semibold text-indigo-600 hover:underline"
                    >
                        Change
                    </button>

                </div>

            )}

        </div>
    );
};

export default ClientSelector;