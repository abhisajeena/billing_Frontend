import { useEffect } from "react";

import DashboardLayout from "../../../components/layout/DashboardLayout";

import DashboardHeader from "../components/DashboardHeader";
import DashboardCards from "../components/DashboardCards";
import RevenueChart from "../components/RevenueChart";
import RecentBills from "../components/RecentBills";
import RecentCustomers from "../components/RecentCustomers";
import RecentTransactions from "../components/RecentTransactions";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";

import useDashboardStore from "../store/dashboard.store";
import useClientStore from "../../clients/store/clients.store";

import Loader from "../../../components/common/Loader";

const Dashboard = () => {
    const {
        dashboard,
        loading: dashboardLoading,
        fetchDashboard,
    } = useDashboardStore();

    const {
        clients,
        fetchClients,
        loading: clientsLoading,
    } = useClientStore();

    useEffect(() => {
        fetchDashboard();
        fetchClients(1, 5);
    }, [fetchDashboard, fetchClients]);

    const loading = dashboardLoading || clientsLoading;

    if (loading && !dashboard) {
        return (
            <DashboardLayout>
                <div className="flex min-h-[60vh] items-center justify-center px-4">
                    <div className="flex flex-col items-center gap-3">
                        <Loader
                            size={38}
                            className="animate-spin text-indigo-600"
                        />

                        <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Loading dashboard...
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>

            <div className="w-full min-w-0 space-y-4 sm:space-y-5 lg:space-y-6">

                {/* Dashboard Header */}
                <div className="min-w-0">
                    <DashboardHeader />
                </div>

                {/* Statistics Cards */}
                <div className="min-w-0">
                    <DashboardCards
                        totalRevenue={dashboard?.totalRevenue}
                        totalBills={dashboard?.totalBills}
                        paidBills={dashboard?.paidBills}
                        totalClients={clients?.length || 0}
                    />
                </div>

                {/* Revenue + Activity */}
                <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 lg:gap-6 xl:grid-cols-3">

                    <div className="min-w-0 xl:col-span-2">
                        <RevenueChart
                            totalRevenue={
                                dashboard?.totalRevenue
                            }
                        />
                    </div>

                    <div className="min-w-0">
                        <RecentActivity
                            bills={
                                dashboard?.recentBills || []
                            }
                        />
                    </div>

                </div>

                {/* Bills + Customers */}
                <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 lg:gap-6 xl:grid-cols-5">

                    <div className="min-w-0 xl:col-span-3">
                        <RecentBills
                            bills={
                                dashboard?.recentBills || []
                            }
                        />
                    </div>

                    <div className="min-w-0 xl:col-span-2">
                        <RecentCustomers
                            clients={clients || []}
                        />
                    </div>

                </div>

                {/* Transactions */}
                <div className="min-w-0">
                    <RecentTransactions
                        bills={
                            dashboard?.recentBills || []
                        }
                    />
                </div>

                {/* Quick Actions */}
                <div className="min-w-0">
                    <QuickActions />
                </div>

            </div>

        </DashboardLayout>
    );
};

export default Dashboard;