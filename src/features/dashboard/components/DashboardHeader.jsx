import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

      <div>
        <p className="text-sm font-semibold text-indigo-600">
          Welcome back 👋
        </p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Business Overview
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Manage your invoices, customers and business activities from one
          place.
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate("/bills/create")}
        className="inline-flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
      >
        <Plus size={17} />
        Create Invoice
      </button>

    </div>
  );
};

export default DashboardHeader;