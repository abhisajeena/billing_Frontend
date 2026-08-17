import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const BillPagination = ({
    pagination,
    setPage,
}) => {
    if (
        !pagination ||
        pagination.totalPages <= 1
    ) {
        return null;
    }

    return (
        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <span className="text-slate-500">
                Page{" "}
                {pagination.page}{" "}
                of{" "}
                {pagination.totalPages}{" "}
                (
                {pagination.total}{" "}
                invoices)
            </span>

            <div className="flex items-center gap-2">

                <button
                    type="button"
                    onClick={() =>
                        setPage((page) =>
                            Math.max(
                                1,
                                page - 1
                            )
                        )
                    }
                    disabled={
                        pagination.page ===
                        1
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft size={16} />
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setPage((page) =>
                            Math.min(
                                pagination.totalPages,
                                page + 1
                            )
                        )
                    }
                    disabled={
                        pagination.page ===
                        pagination.totalPages
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronRight size={16} />
                </button>

            </div>

        </div>
    );
};

export default BillPagination;