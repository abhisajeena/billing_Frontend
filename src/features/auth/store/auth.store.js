import { create } from "zustand";
import { loginApi, getProfileApi } from "../api/auth.api";
import toast from "react-hot-toast";

const useAuthStore = create((set) => ({
  // -----------------------------------------
  // Initial State
  // -----------------------------------------
  user: null,

  token: localStorage.getItem("token") || null,

  loading: false,

  error: null,

  // -----------------------------------------
  // Login
  // -----------------------------------------
  login: async (userData) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const response = await loginApi(userData);

      console.log("Login response:", response);

      // Make sure backend actually returned a token
      if (!response?.token) {
        throw new Error(
          response?.message || "Login failed. Token not received."
        );
      }

      // -----------------------------------------
      // Store REAL backend JWT
      // -----------------------------------------
      localStorage.setItem("token", response.token);

      // Optional: store user information
      localStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      // -----------------------------------------
      // Update Zustand
      // -----------------------------------------
      set({
        token: response.token,
        user: response.user,
        loading: false,
        error: null,
      });

      toast.success(response.message || "Login successful");

      return response;
    } catch (error) {
      console.error("Login failed:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";

      set({
        loading: false,
        error: message,
      });

      toast.error(message);

      throw error;
    }
  },

  // -----------------------------------------
  // Get Profile
  // -----------------------------------------
  getProfile: async () => {
    try {
      const response = await getProfileApi();

      if (response?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.user)
        );

        set({
          user: response.user,
        });
      }
    } catch (error) {
      console.error("Failed to get profile:", error);

      // Don't create fake admin user.
      // Keep the existing authenticated user if available.
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          set({
            user: JSON.parse(storedUser),
          });
        } catch {
          set({
            user: null,
          });
        }
      }
    }
  },

  // -----------------------------------------
  // Logout
  // -----------------------------------------
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      user: null,
      token: null,
      loading: false,
      error: null,
    });
  },
}));

export default useAuthStore;