import {
  ReceiptText,
  UserPlus,
  Building2,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "New Invoice",
      description: "Create an invoice",
      icon: ReceiptText,
      path: "/bills/create",
      style: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Add Customer",
      description: "Create customer",
      icon: UserPlus,
      path: "/clients",
      style: "bg-blue-50 text-blue-600",
    },
    {
      title: "Company Profile",
      description: "Manage business",
      icon: Building2,
      path: "/company",
      style: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 px-5 py-4">

        <h3 className="text-base font-bold text-slate-900">
          Quick Actions
        </h3>

        <p className="mt-0.5 text-xs text-slate-500">
          Frequently used actions
        </p>

      </div>

      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              type="button"
              onClick={() => navigate(action.path)}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-200 hover:bg-slate-50"
            >

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.style}`}
              >
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  {action.title}
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  {action.description}
                </p>
              </div>

              <ArrowRight
                size={15}
                className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500"
              />

            </button>
          );
        })}

      </div>
    </div>
  );
};

export default QuickActions;