import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import useCompanyStore from "../store/company.store";
import Loader from "../../../components/common/Loader";
import Button from "../../../components/common/Button";
import toast from "react-hot-toast";
import { Building2, Save, Landmark, Globe, CheckCircle2 } from "lucide-react";

const CompanySettings = () => {
    const { company, loading, fetchCompany, createCompany, updateCompany } = useCompanyStore();
    const [isFirstSetup, setIsFirstSetup] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    useEffect(() => {
        const loadCompany = async () => {
            try {
                const data = await fetchCompany();
                if (!data) {
                    setIsFirstSetup(true);
                } else {
                    setIsFirstSetup(false);
                    reset({
                        companyName: data.companyName || "",
                        address: data.address || "",
                        gstNumber: data.gstNumber || "",
                        phone: data.phone || "",
                        email: data.email || "",
                        website: data.website || "",
                        bankName: data.bankName || "",
                        accountNumber: data.accountNumber || "",
                        ifscCode: data.ifscCode || "",
                        branch: data.branch || "",
                        logo: data.logo || "",
                    });
                }
            } catch {
                // If it fails because company is not found (400/404), trigger first setup
                setIsFirstSetup(true);
            }
        };
        loadCompany();
    }, [fetchCompany, reset]);

    const onSubmitForm = async (data) => {
        try {
            let res;
            if (isFirstSetup) {
                res = await createCompany(data);
                if (res.success) {
                    toast.success("Company profile created successfully!");
                    setIsFirstSetup(false);
                }
            } else {
                res = await updateCompany(data);
                if (res.success) {
                    toast.success("Company profile updated successfully!");
                }
            }
            fetchCompany();
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Failed to save company settings");
        }
    };

    if (loading && !company) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <Loader size={40} className="text-indigo-600 animate-spin" />
                    <p className="text-xs text-slate-500 mt-2">Loading company profile...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Intro Card */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">
                                {isFirstSetup ? "Setup Company Profile" : "Company Profile Settings"}
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">
                                Configure bank details, address, and GST numbers which auto-populate all bills
                            </p>
                        </div>
                    </div>
                    {company && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 size={14} />
                            Verified Profile
                        </span>
                    )}
                </div>

                <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
                    {/* Section 1: Basic Company Details */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <Building2 size={16} className="text-slate-400" />
                                Basic Business Profile
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Official Company Name *
                                </label>
                                <input
                                    type="text"
                                    className={`w-full h-11 px-3.5 rounded-xl bg-slate-50 border text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all ${
                                        errors.companyName ? "border-red-400 focus:ring-red-400" : "border-slate-200"
                                    }`}
                                    placeholder="Enter your registered company name"
                                    {...register("companyName", { required: "Company name is required" })}
                                />
                                {errors.companyName && (
                                    <p className="text-xs text-red-500 mt-1">{errors.companyName.message}</p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Registered Office Address *
                                </label>
                                <textarea
                                    className={`w-full py-2.5 px-3.5 rounded-xl bg-slate-50 border text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all min-h-[70px] ${
                                        errors.address ? "border-red-400 focus:ring-red-400" : "border-slate-200"
                                    }`}
                                    placeholder="Full office location address..."
                                    {...register("address", { required: "Office address is required" })}
                                />
                                {errors.address && (
                                    <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
                                )}
                            </div>

                            <div>
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

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                    placeholder="Phone number"
                                    {...register("phone")}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                    placeholder="contact@company.com"
                                    {...register("email")}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Corporate Website URL
                                </label>
                                <input
                                    type="text"
                                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                    placeholder="https://company.com"
                                    {...register("website")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Bank Account Details */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <Landmark size={16} className="text-slate-400" />
                                Bank Settlement Details (For Invoices)
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Bank Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                    placeholder="E.g. HDFC Bank"
                                    {...register("bankName")}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                    placeholder="E.g. 50100012345678"
                                    {...register("accountNumber")}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    IFSC Code
                                </label>
                                <input
                                    type="text"
                                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all uppercase"
                                    placeholder="E.g. HDFC0001234"
                                    {...register("ifscCode")}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                    Branch Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                    placeholder="E.g. Connaught Place"
                                    {...register("branch")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Identity & Logo */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                <Globe size={16} className="text-slate-400" />
                                Corporate Identity
                            </h3>
                        </div>
                        <div className="p-6">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                Brand Logo URL
                            </label>
                            <input
                                type="text"
                                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                                placeholder="E.g. https://company.com/logo.png"
                                {...register("logo")}
                            />
                            <p className="text-[10px] text-slate-400 mt-1.5">
                                Provide an absolute URL to a hosting image. Will render at the top header of all PDFs.
                            </p>
                        </div>
                    </div>

                    {/* Form Submit */}
                    <div className="flex items-center justify-end">
                        <div className="w-48">
                            <Button type="submit" variant="primary" icon={<Save size={18} />}>
                                {isFirstSetup ? "Create Profile" : "Save Settings"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default CompanySettings;
