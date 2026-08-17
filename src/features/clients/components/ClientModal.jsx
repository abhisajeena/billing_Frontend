import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

import Button from "../../../components/common/Button";
import toast from "react-hot-toast";

const ClientModal = ({
    isOpen,
    onClose,
    onSave,
    client = null,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        if (client) {
            reset({
                clientName: client.clientName || "",
                phone: client.phone || "",
                email: client.email || "",
                gstNumber: client.gstNumber || "",
                address: client.address || "",
                city: client.city || "",
                state: client.state || "",
                pincode: client.pincode || "",
            });
        } else {
            reset({
                clientName: "",
                phone: "",
                email: "",
                gstNumber: "",
                address: "",
                city: "",
                state: "",
                pincode: "",
            });
        }
    }, [client, reset, isOpen]);

    if (!isOpen) return null;

    const onSubmitForm = async (data) => {
        try {
            await onSave(data);

            reset();

            onClose();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to save client"
            );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/40 p-3 backdrop-blur-sm sm:items-center sm:p-4">

            <div className="my-3 flex max-h-[calc(100vh-24px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl sm:my-0 sm:max-h-[90vh]">

                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6">

                    <h3 className="min-w-0 truncate text-base font-bold text-slate-800 sm:text-lg">
                        {client
                            ? "Edit Client Profile"
                            : "Register New Client"}
                    </h3>

                    <button
                        type="button"
                        onClick={onClose}
                        className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"
                    >
                        <X size={18} />
                    </button>

                </div>

                {/* Scrollable Form Body */}
                <form
                    onSubmit={handleSubmit(
                        onSubmitForm
                    )}
                    className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6"
                >

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        {/* Client Name */}
                        <div className="sm:col-span-2">

                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Client Name *
                            </label>

                            <input
                                type="text"
                                className={`
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    bg-slate-50
                                    px-3.5
                                    text-sm
                                    text-slate-800
                                    outline-none
                                    transition
                                    focus:bg-white
                                    focus:ring-2
                                    focus:ring-indigo-500

                                    ${
                                        errors.clientName
                                            ? "border-red-400 focus:ring-red-400"
                                            : "border-slate-200"
                                    }
                                `}
                                placeholder="E.g. Acme Corp"
                                {...register(
                                    "clientName",
                                    {
                                        required:
                                            "Client name is required",
                                    }
                                )}
                            />

                            {errors.clientName && (
                                <p className="mt-1 text-xs text-red-500">
                                    {
                                        errors
                                            .clientName
                                            .message
                                    }
                                </p>
                            )}

                        </div>

                        {/* Phone */}
                        <div>

                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Contact Number *
                            </label>

                            <input
                                type="text"
                                className={`
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    bg-slate-50
                                    px-3.5
                                    text-sm
                                    text-slate-800
                                    outline-none
                                    transition
                                    focus:bg-white
                                    focus:ring-2
                                    focus:ring-indigo-500

                                    ${
                                        errors.phone
                                            ? "border-red-400 focus:ring-red-400"
                                            : "border-slate-200"
                                    }
                                `}
                                placeholder="E.g. +91 9876543210"
                                {...register(
                                    "phone",
                                    {
                                        required:
                                            "Phone number is required",
                                        pattern: {
                                            value: /^[+]?[0-9\s-]{7,15}$/,
                                            message:
                                                "Invalid phone number",
                                        },
                                    }
                                )}
                            />

                            {errors.phone && (
                                <p className="mt-1 text-xs text-red-500">
                                    {
                                        errors.phone
                                            .message
                                    }
                                </p>
                            )}

                        </div>

                        {/* Email */}
                        <div>

                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Email Address
                            </label>

                            <input
                                type="email"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                                placeholder="client@domain.com"
                                {...register("email")}
                            />

                        </div>

                        {/* GSTIN */}
                        <div className="sm:col-span-2">

                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                GST Identification Number (GSTIN)
                            </label>

                            <input
                                type="text"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm uppercase text-slate-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                                placeholder="E.g. 27AAAAA1111A1Z1"
                                {...register(
                                    "gstNumber"
                                )}
                            />

                        </div>

                        {/* Address */}
                        <div className="sm:col-span-2">

                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Billing Address *
                            </label>

                            <textarea
                                className={`
                                    min-h-[80px]
                                    w-full
                                    resize-y
                                    rounded-xl
                                    border
                                    bg-slate-50
                                    px-3.5
                                    py-2.5
                                    text-sm
                                    text-slate-800
                                    outline-none
                                    transition
                                    focus:bg-white
                                    focus:ring-2
                                    focus:ring-indigo-500

                                    ${
                                        errors.address
                                            ? "border-red-400 focus:ring-red-400"
                                            : "border-slate-200"
                                    }
                                `}
                                placeholder="Street address, building, suite..."
                                {...register(
                                    "address",
                                    {
                                        required:
                                            "Address is required",
                                    }
                                )}
                            />

                            {errors.address && (
                                <p className="mt-1 text-xs text-red-500">
                                    {
                                        errors
                                            .address
                                            .message
                                    }
                                </p>
                            )}

                        </div>

                        {/* City */}
                        <div>

                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                City
                            </label>

                            <input
                                type="text"
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                                placeholder="E.g. Mumbai"
                                {...register("city")}
                            />

                        </div>

                        {/* State + Pincode */}
                        <div className="grid grid-cols-2 gap-2">

                            <div>

                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    State
                                </label>

                                <input
                                    type="text"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                                    placeholder="MH"
                                    {...register("state")}
                                />

                            </div>

                            <div>

                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Pincode
                                </label>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-indigo-500"
                                    placeholder="400001"
                                    {...register(
                                        "pincode"
                                    )}
                                />

                            </div>

                        </div>

                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-end">

                        <button
                            type="button"
                            onClick={onClose}
                            className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
                        >
                            Cancel
                        </button>

                        <div className="w-full sm:w-36">
                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                            >
                                Save Profile
                            </Button>
                        </div>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default ClientModal;