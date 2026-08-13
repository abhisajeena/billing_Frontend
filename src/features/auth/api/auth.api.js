import axiosInstance from "../../../lib/axios/axios";

// Register User
export const registerApi = async (userData) => {

    const response = await axiosInstance.post(
        "/auth/register",
        userData
    );

    return response.data;
};

// Login User
export const loginApi = async (userData) => {

    const response = await axiosInstance.post(
        "/auth/login",
        userData
    );

    return response.data;
};

// Get Profile
export const getProfileApi = async () => {

    const response = await axiosInstance.get(
        "/auth/profile"
    );

    return response.data;
};