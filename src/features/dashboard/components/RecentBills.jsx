import { ReceiptText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecentBills = ({ bills = [] }) => {
  const navigate = useNavigate();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const getStatusClass = (status) => {
    if (status === "Paid") {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }

    if (status === "Pending") {
      return "bg-amber-50 text-amber-700 border-amber-100";
    }

    return "bg-rose-50 text-rose-700 border-rose-100";
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

        <div>
          <h3 className="text-base font-bold text-slate-900">
            Recent Invoices
          </h3>

          <p className="mt-0.5 text-xs text-slate-500">
            Latest billing activity
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/bills")}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View all
          <ArrowRight size={14} />
        </button>

      </div>

      <div className="divide-y divide-slate-100">

        {bills.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <ReceiptText
              size={28}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-medium text-slate-500">
              No invoices found
            </p>
          </div>
        ) : (
          bills.slice(0, 5).map((bill) => (
            <div
              key={bill._id}
              className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50"
            >

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <ReceiptText size={17} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {bill.billNumber}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-400">
                    {bill.client?.clientName || "Client Account"}
                  </p>
                </div>

              </div>

              <div className="shrink-0 text-right">

                <p className="text-sm font-bold text-slate-800">
                  {formatCurrency(bill.grandTotal)}
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusClass(
                    bill.paymentStatus
                  )}`}
                >
                  {bill.paymentStatus}
                </span>

              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default RecentBills;