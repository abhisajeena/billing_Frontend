import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import Button from "../../../components/common/Button";
import toast from "react-hot-toast";

const ClientModal = ({ isOpen, onClose, onSave, client = null }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
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
                pincode: client.pincode || ""
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
                pincode: ""
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
            toast.error(error.response?.data?.message || error.message || "Failed to save client");
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">
                        {client ? "Edit Client Profile" : "Register New Client"}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-650 p-1 hover:bg-slate-50 rounded-lg transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Client Name *
                            </label>
                            <input
                                type="text"
                                className={`w-full h-11 px-3.5 rounded-xl bg-slate-50 border text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all ${
                                    errors.clientName ? "border-red-400 focus:ring-red-400" : "border-slate-200"
                                }`}
                                placeholder="E.g. Acme Corp"
                                {...register("clientName", { required: "Client name is required" })}
                            />
                            {errors.clientName && (
                                <p className="text-xs text-red-500 mt-1">{errors.clientName.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Contact Number *
                            </label>
                            <input
                                type="text"
                                className={`w-full h-11 px-3.5 rounded-xl bg-slate-50 border text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all ${
                                    errors.phone ? "border-red-400 focus:ring-red-400" : "border-slate-200"
                                }`}
                                placeholder="E.g. +91 9876543210"
                                {...register("phone", { 
                                    required: "Phone number is required",
                                    pattern: {
                                        value: /^[+]?[0-9\s-]{7,15}$/,
                                        message: "Invalid phone number"
                                    }
                                })}
                            />
                            {errors.phone && (
                                <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                placeholder="client@domain.com"
                                {...register("email")}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                GST Identification Number (GSTIN)
                            </label>
                            <input
                                type="text"
                                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all uppercase"
                                placeholder="E.g. 27AAAAA1111A1Z1"
                                {...register("gstNumber")}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Billing Address *
                            </label>
                            <textarea
                                className={`w-full py-2.5 px-3.5 rounded-xl bg-slate-50 border text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all min-h-[70px] ${
                                    errors.address ? "border-red-400 focus:ring-red-400" : "border-slate-200"
                                }`}
                                placeholder="Street address, building, suite..."
                                {...register("address", { required: "Address is required" })}
                            />
                            {errors.address && (
                                <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                City
                            </label>
                            <input
                                type="text"
                                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                placeholder="E.g. Mumbai"
                                {...register("city")}
                            />
                        </div>

                        <div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                        placeholder="MH"
                                        {...register("state")}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                        Pincode
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                        placeholder="400001"
                                        {...register("pincode")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-sm font-semibold transition"
                        >
                            Cancel
                        </button>
                        <div className="w-32">
                            <Button type="submit" variant="primary">
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
