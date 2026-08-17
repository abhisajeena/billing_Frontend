import { useEffect, useState } from "react";

import DashboardLayout from "../../../components/layout/DashboardLayout";

import useBillStore from "../store/bills.store";

import BillListHeader from "../components/bill-list/BillListHeader";
import BillFilters from "../components/bill-list/BillFilters";
import BillTable from "../components/bill-list/BillTable";
import BillPagination from "../components/bill-list/BillPagination";

import toast from "react-hot-toast";

const BillList = () => {
    const {
        bills,
        loading,
        pagination,
        fetchBills,
        deleteBill,
    } = useBillStore();

    const [search, setSearch] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [statusFilter, setStatusFilter] =
        useState("All");

    /* -----------------------------
       Fetch Bills
    ----------------------------- */

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBills(
                page,
                10,
                search
            );
        }, 300);

        return () =>
            clearTimeout(timer);
    }, [
        page,
        search,
        fetchBills,
    ]);

    /* -----------------------------
       Search
    ----------------------------- */

    const handleSearchChange = (
        event
    ) => {
        setSearch(event.target.value);
        setPage(1);
    };

    /* -----------------------------
       Delete
    ----------------------------- */

    const handleDelete = async (
        event,
        billId,
        billNumber
    ) => {
        event.stopPropagation();

        const confirmed =
            window.confirm(
                `Are you sure you want to delete invoice "${billNumber}"? This action cannot be undone.`
            );

        if (!confirmed) {
            return;
        }

        try {
            const result =
                await deleteBill(
                    billId
                );

            if (result.success) {
                toast.success(
                    result.message ||
                        "Invoice deleted successfully."
                );

                fetchBills(
                    page,
                    10,
                    search
                );
            }
        } catch (error) {
            toast.error(
                error.response?.data
                    ?.message ||
                    error.message ||
                    "Failed to delete invoice."
            );
        }
    };

    /* -----------------------------
       Client-side Status Filter
    ----------------------------- */

    const filteredBills =
        statusFilter === "All"
            ? bills
            : bills.filter(
                  (bill) =>
                      bill.paymentStatus ===
                      statusFilter
              );

    return (
        <DashboardLayout>

            <div className="w-full min-w-0 space-y-4 sm:space-y-6">

                <BillListHeader />

                <BillFilters
                    search={search}
                    onSearchChange={
                        handleSearchChange
                    }
                    statusFilter={
                        statusFilter
                    }
                    setStatusFilter={
                        setStatusFilter
                    }
                />

                <BillTable
                    bills={filteredBills}
                    loading={loading}
                    onDelete={handleDelete}
                />

                <BillPagination
                    pagination={pagination}
                    setPage={setPage}
                />

            </div>

        </DashboardLayout>
    );
};

export default BillList;