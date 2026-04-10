import axios from "../api/axiosInstance"
import { useAuth } from "./useAuth";

export const useProfile = () => {
    const { user, updateUser } = useAuth();

    const updateProfile = async (payload) => {
        if (!payload || typeof payload !== "object") {
            throw new Error("Invalid profile payload");
        }
        
        const res = await axios.put("/auth/me/profile", payload);
        updateUser(res.data);
        return res.data;
    };

    const updatePassword = async ({ current_password, new_password }) => {
        return axios.put("/auth/me/password", {
            current_password,
            new_password,
        });
    }
  return { user, updateProfile, updatePassword };
};
