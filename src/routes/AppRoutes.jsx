import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "../features/auth/pages/Login";
import Dashboard from "../features/dashboard/pages/Dashboard";
import ClientList from "../features/clients/pages/ClientList";
import ClientDetail from "../features/clients/pages/ClientDetail";
import CompanySettings from "../features/company/pages/CompanySettings";
import BillList from "../features/bills/pages/BillList";
import BillForm from "../features/bills/pages/BillForm";
import BillView from "../features/bills/pages/BillView";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    className: "bg-slate-900 text-white border border-slate-800 rounded-xl",
                    duration: 4000,
                }}
            />
            <Routes>
                {/* Public Route */}
                <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                {/* Direct Login Path for Preview/Testing without redirects */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Private Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/clients"
                    element={
                        <PrivateRoute>
                            <ClientList />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/clients/:id"
                    element={
                        <PrivateRoute>
                            <ClientDetail />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/company"
                    element={
                        <PrivateRoute>
                            <CompanySettings />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/bills"
                    element={
                        <PrivateRoute>
                            <BillList />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/bills/create"
                    element={
                        <PrivateRoute>
                            <BillForm />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/bills/edit/:id"
                    element={
                        <PrivateRoute>
                            <BillForm />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/bills/view/:id"
                    element={
                        <PrivateRoute>
                            <BillView />
                        </PrivateRoute>
                    }
                />

                {/* Catch All Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;