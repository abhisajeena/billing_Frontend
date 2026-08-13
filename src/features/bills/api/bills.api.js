import axiosInstance from "../../../lib/axios/axios";

// Create Bill
export const createBillApi = async (billData) => {
    const response = await axiosInstance.post("/bills/create", billData);
    return response.data;
};

// Get All Bills
export const getAllBillsApi = async (page = 1, limit = 10, search = "") => {
    const response = await axiosInstance.get("/bills", {
        params: { page, limit, search },
    });
    return response.data;
};

// Get Bill By ID
export const getBillByIdApi = async (billId) => {
    const response = await axiosInstance.get(`/bills/${billId}`);
    return response.data;
};

// Update Bill
export const updateBillApi = async (billId, billData) => {
    const response = await axiosInstance.put(`/bills/${billId}`, billData);
    return response.data;
};

// Delete Bill
export const deleteBillApi = async (billId) => {
    const response = await axiosInstance.delete(`/bills/${billId}`);
    return response.data;
};
