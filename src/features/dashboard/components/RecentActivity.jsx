import {
  ReceiptText,
  CircleCheck,
  Clock3,
} from "lucide-react";

const RecentActivity = ({ bills = [] }) => {
  const activities = bills.slice(0, 4).map((bill) => ({
    id: bill._id,
    title:
      bill.paymentStatus === "Paid"
        ? `Invoice ${bill.billNumber} was paid`
        : `Invoice ${bill.billNumber} created`,
    description: `${bill.client?.clientName || "Client Account"} • ₹${Number(
      bill.grandTotal || 0
    ).toLocaleString("en-IN")}`,
    status: bill.paymentStatus,
  }));

  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 px-5 py-4">

        <h3 className="text-base font-bold text-slate-900">
          Recent Activity
        </h3>

        <p className="mt-0.5 text-xs text-slate-500">
          Latest business activity
        </p>

      </div>

      <div className="space-y-5 p-5">

        {activities.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            No recent activity
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex gap-3"
            >

              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  activity.status === "Paid"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {activity.status === "Paid" ? (
                  <CircleCheck size={16} />
                ) : (
                  <ReceiptText size={16} />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">
                  {activity.title}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {activity.description}
                </p>

                <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock3 size={11} />
                  Recently
                </div>
              </div>

            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default RecentActivity;