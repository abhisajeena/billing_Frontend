import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../../components/layout/DashboardLayout";

import useCompanyStore from "../../company/store/company.store";
import useClientStore from "../../clients/store/clients.store";
import useBillStore from "../store/bills.store";

import BillHeader from "../components/bill-form/BillHeader";
import BillingParties from "../components/bill-form/BillingParties";
import InvoiceItems from "../components/bill-form/InvoiceItems";
import BillSettings from "../components/bill-form/BillSettings";
import BillSummary from "../components/bill-form/BillSummary";
import BillNotes from "../components/bill-form/BillNotes";
import BillFormActions from "../components/bill-form/BillFormActions";

import {
    calculateBillTotals,
} from "../utils/billCalculations";

const BillForm = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const isEditMode = Boolean(id);

    const {
        company,
        fetchCompany,
    } = useCompanyStore();

    const {
        clients,
        fetchClients,
    } = useClientStore();

    const {
        createBill,
        updateBill,
        fetchBillById,
        loading: billLoading,
    } = useBillStore();

    const [billDate, setBillDate] =
        useState(
            new Date()
                .toISOString()
                .substring(0, 10)
        );

    const [selectedClient, setSelectedClient] =
        useState(null);

    const [items, setItems] = useState([
        {
            itemName: "",
            quantity: 1,
            unitPrice: 0,
            gst: 18,
        },
    ]);

    const [discount, setDiscount] =
        useState(0);

    const [paymentStatus, setPaymentStatus] =
        useState("Pending");

    const [notes, setNotes] =
        useState("");

    const [billNumber, setBillNumber] =
        useState("INV-XXXX");

    useEffect(() => {
        const initialize = async () => {
            try {
                await fetchCompany();

                await fetchClients(
                    1,
                    100,
                    ""
                );

                if (!isEditMode) {
                    return;
                }

                const bill =
                    await fetchBillById(id);

                if (!bill) {
                    return;
                }

                setBillNumber(
                    bill.billNumber ||
                        "INV-XXXX"
                );

                setBillDate(
                    new Date(
                        bill.billDate
                    )
                        .toISOString()
                        .substring(
                            0,
                            10
                        )
                );

                setSelectedClient(
                    bill.client
                );

                setDiscount(
                    bill.discount || 0
                );

                setPaymentStatus(
                    bill.paymentStatus ||
                        "Pending"
                );

                setNotes(
                    bill.notes || ""
                );

                setItems(
                    bill.items.map(
                        (item) => ({
                            itemName:
                                item.itemName ||
                                "",
                            quantity:
                                item.quantity ??
                                1,
                            unitPrice:
                                item.unitPrice ??
                                0,
                            gst:
                                item.gst ??
                                0,
                        })
                    )
                );
            } catch (error) {
                toast.error(
                    error.response?.data
                        ?.message ||
                        error.message ||
                        "Failed to load invoice."
                );
            }
        };

        initialize();
    }, [
        id,
        isEditMode,
        fetchCompany,
        fetchClients,
        fetchBillById,
    ]);

    const totals =
        calculateBillTotals(
            items,
            discount
        );

    const handleSave = async (
        saveAndView = false
    ) => {
        if (!company) {
            toast.error(
                "Please set up your Company Profile before issuing invoices."
            );

            navigate("/company");

            return;
        }

        if (!selectedClient) {
            toast.error(
                "Please select a customer."
            );

            return;
        }

        const invalidItem =
            items.find(
                (item) =>
                    !String(
                        item.itemName || ""
                    ).trim() ||
                    Number(item.quantity) <=
                        0 ||
                    Number(item.unitPrice) <
                        0
            );

        if (invalidItem) {
            toast.error(
                "Please complete all line items. Quantities must exceed 0, and item names cannot be blank."
            );

            return;
        }

        const payload = {
            client:
                selectedClient._id,

            billDate,

            items: totals.calculatedItems.map(
                (item) => ({
                    itemName:
                        item.itemName,

                    quantity:
                        Number(
                            item.quantity
                        ),

                    unitPrice:
                        Number(
                            item.unitPrice
                        ),

                    gst:
                        Number(item.gst),
                })
            ),

            discount:
                Number(discount) || 0,

            paymentStatus,

            notes,
        };

        try {
            let response;

            if (isEditMode) {
                response =
                    await updateBill(
                        id,
                        payload
                    );
            } else {
                response =
                    await createBill(
                        payload
                    );
            }

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                        "Failed to save invoice."
                );
            }

            toast.success(
                isEditMode
                    ? "Invoice updated successfully!"
                    : "Invoice created successfully!"
            );

            const billId =
                response.data?._id;

            if (saveAndView && billId) {
                navigate(
                    `/bills/view/${billId}`
                );
            } else {
                navigate("/bills");
            }
        } catch (error) {
            toast.error(
                error.response?.data
                    ?.message ||
                    error.message ||
                    "Failed to save invoice."
            );
        }
    };

    return (
        <DashboardLayout>

            <div className="mx-auto w-full min-w-0 max-w-6xl space-y-4 sm:space-y-6">

                <BillHeader
                    isEditMode={
                        isEditMode
                    }
                    billNumber={
                        billNumber
                    }
                />

                {!company && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        <p className="font-bold">
                            Company Profile Incomplete
                        </p>

                        <p className="mt-1 text-xs">
                            Set up your company
                            profile before
                            creating invoices.
                        </p>
                    </div>
                )}

                <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">

                    <div className="min-w-0 space-y-4 sm:space-y-6 lg:col-span-2">

                        <BillingParties
                            company={company}
                            clients={clients}
                            selectedClient={
                                selectedClient
                            }
                            setSelectedClient={
                                setSelectedClient
                            }
                        />

                        <InvoiceItems
                            items={items}
                            setItems={setItems}
                        />

                    </div>

                    <div className="min-w-0 space-y-4 sm:space-y-6">

                        <BillSettings
                            billDate={
                                billDate
                            }
                            setBillDate={
                                setBillDate
                            }
                            paymentStatus={
                                paymentStatus
                            }
                            setPaymentStatus={
                                setPaymentStatus
                            }
                        />

                        <BillSummary
                            subTotal={
                                totals.subTotal
                            }
                            gstTotal={
                                totals.gstTotal
                            }
                            discount={
                                discount
                            }
                            setDiscount={
                                setDiscount
                            }
                            grandTotal={
                                totals.grandTotal
                            }
                            amountInWords={
                                totals.amountInWords
                            }
                        />

                        <BillNotes
                            notes={notes}
                            setNotes={setNotes}
                        />

                        <BillFormActions
                            loading={
                                billLoading
                            }
                            isEditMode={
                                isEditMode
                            }
                            onSave={() =>
                                handleSave(
                                    false
                                )
                            }
                            onSaveAndView={() =>
                                handleSave(
                                    true
                                )
                            }
                        />

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
};

export default BillForm;