import { create } from "zustand";
import { getDashboardDataApi } from "../api/dashboard.api";

const useDashboardStore = create((set) => ({
    dashboard: null,
    loading: false,
    error: null,
    isDemo: false,

    fetchDashboard: async () => {
        set({ loading: true, error: null });
        try {
            const res = await getDashboardDataApi();
            if (res && res.success) {
                set({
                    dashboard: res.data,
                    loading: false,
                    isDemo: false,
                });
                return res.data;
            } else {
                throw new Error(res?.message || "Failed to fetch dashboard data");
            }
        } catch (error) {
            console.warn("Backend offline or error. Loading visual demo data instead.", error);
            
            // Replicate exactly the mockup data shapes
            const demoData = {
                totalRevenue: 240399,
                totalBills: 15,
                paidBills: 9,
                recentBills: [
                    {
                        _id: "demo-bill-1",
                        billNumber: "INV-2023-001",
                        billDate: new Date().toISOString(),
                        paymentStatus: "Paid",
                        grandTotal: 160.00,
                        client: { clientName: "GTR 5" }
                    },
                    {
                        _id: "demo-bill-2",
                        billNumber: "INV-2023-002",
                        billDate: new Date().toISOString(),
                        paymentStatus: "Paid",
                        grandTotal: 20.00,
                        client: { clientName: "Polo Shirt" }
                    },
                    {
                        _id: "demo-bill-3",
                        billNumber: "INV-2023-003",
                        billDate: new Date().toISOString(),
                        paymentStatus: "Paid",
                        grandTotal: 10.00,
                        client: { clientName: "Biriyani" }
                    },
                    {
                        _id: "demo-bill-4",
                        billNumber: "INV-2023-004",
                        billDate: new Date().toISOString(),
                        paymentStatus: "Pending",
                        grandTotal: 12.00,
                        client: { clientName: "Taxi Fare" }
                    },
                    {
                        _id: "demo-bill-5",
                        billNumber: "INV-2023-005",
                        billDate: new Date().toISOString(),
                        paymentStatus: "Paid",
                        grandTotal: 22.00,
                        client: { clientName: "Keyboard" }
                    }
                ]
            };

            set({
                dashboard: demoData,
                loading: false,
                error: null,
                isDemo: true
            });
            return demoData;
        }
    },
}));

export default useDashboardStore;