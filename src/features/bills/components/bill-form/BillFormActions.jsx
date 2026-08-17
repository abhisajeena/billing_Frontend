import { Printer, Save } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../../../../components/common/Button";

const BillFormActions = ({
    loading,
    isEditMode,
    onSave,
    onSaveAndView,
}) => {
    return (
        <div className="space-y-3">

            <Button
                type="button"
                onClick={onSave}
                variant="primary"
                fullWidth
                icon={<Save size={16} />}
                loading={loading}
            >
                {isEditMode
                    ? "Update Invoice"
                    : "Save Invoice Draft"}
            </Button>

            <button
                type="button"
                onClick={
                    onSaveAndView
                }
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-indigo-600 font-bold text-indigo-600 transition hover:bg-indigo-50"
            >
                <Printer size={16} />

                Save & View Invoice
            </button>

            <Link
                to="/bills"
                className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
                Cancel
            </Link>

        </div>
    );
};

export default BillFormActions;