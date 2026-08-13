import axiosInstance from "../../../lib/axios/axios";

// Create Client
export const createClientApi = async (clientData) => {
    const response = await axiosInstance.post("/clients/create", clientData);
    return response.data;
};

// Get All Clients
export const getAllClientsApi = async (page = 1, limit = 10, search = "") => {
    const response = await axiosInstance.get("/clients", {
        params: { page, limit, search },
    });
    return response.data;
};

// Get Client By ID
export const getClientByIdApi = async (clientId) => {
    const response = await axiosInstance.get(`/clients/${clientId}`);
    return response.data;
};

// Update Client
export const updateClientApi = async (clientId, clientData) => {
    const response = await axiosInstance.put(`/clients/${clientId}`, clientData);
    return response.data;
};

// Delete Client
export const deleteClientApi = async (clientId) => {
    const response = await axiosInstance.delete(`/clients/${clientId}`);
    return response.data;
};
