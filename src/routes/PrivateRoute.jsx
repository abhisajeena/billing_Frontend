import { Navigate } from "react-router-dom";
import useAuthStore from "../features/auth/store/auth.store";

const PrivateRoute = ({ children }) => {
    const token = useAuthStore((state) => state.token);

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
