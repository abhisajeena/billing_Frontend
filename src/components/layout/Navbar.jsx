import { Bell, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import useAuthStore from "../../features/auth/store/auth.store";

const Navbar = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;

    if (path.startsWith("/dashboard")) return "Dashboard";
    if (path.startsWith("/bills/create")) return "Create Invoice";
    if (path.startsWith("/bills/edit")) return "Edit Invoice";
    if (path.startsWith("/bills/view")) return "Invoice Preview";
    if (path.startsWith("/bills")) return "Invoices";
    if (path.startsWith("/clients/")) return "Customer Details";
    if (path.startsWith("/clients")) return "Customers";
    if (path.startsWith("/company")) return "Company Profile";

    return "Billing ERP";
  };

  const getInitials = (name) => {
    if (!name) return "A";

    return name
      .split(" ")
      .map((item) => item[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-40 h-[76px] border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-5 sm:px-7 lg:px-8">

        {/* Page Title */}
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Billing ERP
          </p>

          <h1 className="mt-0.5 truncate text-xl font-bold tracking-tight text-slate-900">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">

          {/* Search */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Search size={18} strokeWidth={1.8} />
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Bell size={18} strokeWidth={1.8} />

            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {user?.name || "Administrator"}
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
                Administrator
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-sm font-bold text-indigo-600">
              {getInitials(user?.name)}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;