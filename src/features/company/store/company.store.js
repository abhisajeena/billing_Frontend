import { create } from "zustand";
import {
    createCompanyApi,
    getCompanyApi,
    updateCompanyApi
} from "../api/company.api";

const useCompanyStore = create((set) => ({
    company: null,
    loading: false,
    error: null,

    fetchCompany: async () => {
        set({ loading: true, error: null });
        try {
            const res = await getCompanyApi();
            if (res && res.success) {
                set({ company: res.data, loading: false });
                return res.data;
            } else {
                throw new Error(res?.message || "Failed to fetch company details");
            }
        } catch (err) {
            console.warn("Backend offline or error. Loading demo company details.", err);
            
            const demoCompany = {
                companyName: "FINEBANK ERP CORP",
                email: "support@finebank.io",
                phone: "+91 98765 43210",
                address: "Plot 42, Tech City Core Area, Sector 5",
                city: "Kolkata",
                state: "West Bengal",
                pincode: "700091",
                gstNumber: "19AAACF8831A1Z2",
                bankName: "State Bank of India",
                bankBranch: "Tech Park Branch",
                accountNumber: "38924018249",
                ifscCode: "SBIN0009988",
                termsAndConditions: "1. Goods once sold will not be taken back.\n2. Interest @18% will be charged if payment is delayed."
            };

            set({
                company: demoCompany,
                loading: false,
                error: null
            });
            return demoCompany;
        }
    },

    createCompany: async (companyData) => {
        set({ loading: true, error: null });
        try {
            const res = await createCompanyApi(companyData);
            if (res && res.success) {
                set({ company: res.data, loading: false });
            } else {
                set({ error: res.message, loading: false });
            }
            return res;
        } catch (err) {
            console.warn("Bypassing company create offline:", err);
            set({ company: companyData, loading: false });
            return { success: true, data: companyData };
        }
    },

    updateCompany: async (companyData) => {
        set({ loading: true, error: null });
        try {
            const res = await updateCompanyApi(companyData);
            if (res && res.success) {
                set({ company: res.data, loading: false });
            } else {
                set({ error: res.message, loading: false });
            }
            return res;
        } catch (err) {
            console.warn("Bypassing company update offline:", err);
            set({ company: companyData, loading: false });
            return { success: true, data: companyData };
        }
    },
}));

export default useCompanyStore;
