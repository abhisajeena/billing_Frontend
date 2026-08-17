import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen overflow-x-hidden bg-slate-50">

            {/* Sidebar */}
            <Sidebar
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* Main Area */}
            <div className="min-h-screen lg:pl-64">

                {/* Navbar */}
                <Navbar
                    setMobileOpen={setMobileOpen}
                />

                {/* Page Content */}
                <main className="w-full min-w-0 p-3 sm:p-5 lg:p-8">
                    {children}
                </main>

            </div>

        </div>
    );
};

export default DashboardLayout;