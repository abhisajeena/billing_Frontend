import axiosInstance from "../../../lib/axios/axios";

// Get Dashboard Data
export const getDashboardDataApi = async () => {
    const response = await axiosInstance.get("/dashboard");
    return response.data;
};