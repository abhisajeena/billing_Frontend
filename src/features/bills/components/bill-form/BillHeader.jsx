import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BillHeader = ({
    isEditMode,
    billNumber,
}) => {
    return (
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex min-w-0 items-center gap-2">

                <Link
                    to="/bills"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                >
                    <ChevronLeft size={16} />
                </Link>

                <div className="min-w-0">

                    <h2 className="truncate text-lg font-bold text-slate-800 sm:text-xl">
                        {isEditMode
                            ? `Edit Invoice: ${billNumber}`
                            : "Draft New Invoice"}
                    </h2>

                    <p className="truncate text-[11px] font-medium text-slate-500 sm:text-xs">
                        {isEditMode
                            ? "Update details of the saved invoice"
                            : "Create a professional invoice in seconds"}
                    </p>

                </div>

            </div>

        </div>
    );
};

export default BillHeader;