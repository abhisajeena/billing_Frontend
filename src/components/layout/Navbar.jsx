import { Bell, Search, Menu } from "lucide-react";

import { useLocation } from "react-router-dom";

import useAuthStore from "../../features/auth/store/auth.store";

const Navbar = ({ setMobileOpen }) => {
  const { user } = useAuthStore();

  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;

    if (path.startsWith("/dashboard")) return "Dashboard";

    if (path.startsWith("/bills/create")) {
      return "Create Invoice";
    }

    if (path.startsWith("/bills/edit")) {
      return "Edit Invoice";
    }

    if (path.startsWith("/bills/view")) {
      return "Invoice Preview";
    }

    if (path.startsWith("/bills")) {
      return "Invoices";
    }

    if (path.startsWith("/clients/")) {
      return "Customer Details";
    }

    if (path.startsWith("/clients")) {
      return "Customers";
    }

    if (path.startsWith("/company")) {
      return "Company Profile";
    }

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
    <header className="sticky top-0 z-30 h-[76px] border-b border-slate-200 bg-white">

      <div className="flex h-full items-center justify-between px-4 sm:px-7 lg:px-8">

        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden"
          >
            <Menu size={21} />
          </button>

          {/* Page Title */}
          <div className="min-w-0">

            <p className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-600 sm:block">
              Billing ERP
            </p>

            <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:mt-0.5 sm:text-xl">
              {getPageTitle()}
            </h1>

          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Search */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Search size={18} strokeWidth={1.8} />
          </button>

          {/* Notification */}
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