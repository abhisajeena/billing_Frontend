import {
    ReceiptText,
    Users,
    IndianRupee,
    CircleCheck,
} from "lucide-react";

import StatCard from "./StatCard";

const DashboardCards = ({
    totalRevenue = 0,
    totalBills = 0,
    paidBills = 0,
    totalClients = 0,
}) => {

    const formatRevenue = (value) => {
        if (!value) return "₹0";

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">

            {/* Total Revenue */}
            <div className="min-w-0">
                <StatCard
                    title="Total Revenue"
                    value={formatRevenue(totalRevenue)}
                    icon={<IndianRupee size={20} />}
                    iconClass="bg-emerald-50 text-emerald-600"
                    trend="+12% from last month"
                />
            </div>

            {/* Total Invoices */}
            <div className="min-w-0">
                <StatCard
                    title="Total Invoices"
                    value={totalBills}
                    icon={<ReceiptText size={20} />}
                    iconClass="bg-blue-50 text-blue-600"
                    trend={`${totalBills} invoices created`}
                    trendClass="text-blue-600"
                />
            </div>

            {/* Paid Invoices */}
            <div className="min-w-0">
                <StatCard
                    title="Paid Invoices"
                    value={paidBills}
                    icon={<CircleCheck size={20} />}
                    iconClass="bg-violet-50 text-violet-600"
                    trend="Successfully paid"
                    trendClass="text-violet-600"
                />
            </div>

            {/* Total Customers */}
            <div className="min-w-0">
                <StatCard
                    title="Total Customers"
                    value={totalClients}
                    icon={<Users size={20} />}
                    iconClass="bg-indigo-50 text-indigo-600"
                    trend="Active customers"
                    trendClass="text-indigo-600"
                />
            </div>

        </div>
    );
};

export default DashboardCards;