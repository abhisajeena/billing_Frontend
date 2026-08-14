import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <div className="min-h-screen lg:pl-64">

        {/* Navbar */}
        <Navbar
          setMobileOpen={setMobileOpen}
        />

        {/* Page Content */}
        <main className="w-full p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;