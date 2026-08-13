import axiosInstance from "../../../lib/axios/axios";

// Create Company Profile
export const createCompanyApi = async (companyData) => {
    const response = await axiosInstance.post("/company/create", companyData);
    return response.data;
};

// Get Company Profile
export const getCompanyApi = async () => {
    const response = await axiosInstance.get("/company/all");
    return response.data;
};

// Update Company Profile
export const updateCompanyApi = async (companyData) => {
    const response = await axiosInstance.put("/company/update", companyData);
    return response.data;
};
