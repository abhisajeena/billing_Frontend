import { Navigate } from "react-router-dom";
import useAuthStore from "../features/auth/store/auth.store";

const PublicRoute = ({ children }) => {
    const token = useAuthStore((state) => state.token);

    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PublicRoute;
