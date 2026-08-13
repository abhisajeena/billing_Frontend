import { useState } from "react";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../store/auth.store";

const Login = () => {
    const navigate = useNavigate();
    const { login, loading } = useAuthStore();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(formData);
            navigate("/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Invalid email or password"
            );
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">

            <div className="min-h-screen grid lg:grid-cols-[1.05fr_0.95fr]">

                {/* ================================================= */}
                {/* LEFT BRANDING */}
                {/* ================================================= */}

                <section className="relative hidden lg:flex overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-950">

                    {/* Decorative circles */}

                    <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-400/20 blur-3xl" />

                    <div className="absolute -bottom-40 -right-20 w-[600px] h-[600px] rounded-full bg-indigo-400/20 blur-3xl" />

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.12),transparent_30%)]" />

                    <div className="relative z-10 flex flex-col justify-between w-full p-14 xl:p-20 text-white">

                        {/* Logo */}

                        <div className="flex items-center gap-4">

                            <div className="w-12 h-12 rounded-2xl bg-white text-blue-700 flex items-center justify-center text-xl font-extrabold shadow-xl">
                                B
                            </div>

                            <div>

                                <h2 className="text-xl font-bold tracking-wide">
                                    Billing ERP
                                </h2>

                                <p className="text-[10px] uppercase tracking-[0.25em] text-blue-200 mt-1">
                                    Billing Management System
                                </p>

                            </div>

                        </div>

                        {/* Main content */}

                        <div className="max-w-xl">

                            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-blue-100 mb-6">
                                Modern Billing Management
                            </span>

                            <h1 className="text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight">
                                Everything you need to
                                <span className="block text-blue-200">
                                    manage your billing.
                                </span>
                            </h1>

                            <p className="mt-7 text-lg leading-8 text-blue-100 max-w-lg">
                                Create invoices, manage customers,
                                track payments and keep your business
                                organized from one powerful workspace.
                            </p>

                            {/* Features */}

                            <div className="grid grid-cols-2 gap-4 mt-10 max-w-lg">

                                {[
                                    "Invoice Management",
                                    "Customer Management",
                                    "Payment Tracking",
                                    "Business Reports",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm"
                                    >
                                        <CheckCircle2
                                            size={17}
                                            className="text-blue-200 shrink-0"
                                        />

                                        <span className="text-sm font-medium">
                                            {item}
                                        </span>

                                    </div>
                                ))}

                            </div>

                        </div>

                        {/* Footer */}

                        <div className="flex items-center justify-between text-xs text-blue-200">

                            <span>
                                © 2026 Billing ERP
                            </span>

                            <span>
                                Secure Business Software
                            </span>

                        </div>

                    </div>

                </section>

                {/* ================================================= */}
                {/* RIGHT LOGIN */}
                {/* ================================================= */}

                <section className="relative flex items-center justify-center bg-slate-50 px-6 py-10 sm:px-10">

                    {/* Mobile background decoration */}

                    <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60 lg:hidden" />

                    <div className="relative w-full max-w-md">

                        {/* Mobile logo */}

                        <div className="flex lg:hidden items-center gap-3 mb-12">

                            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                                B
                            </div>

                            <div>

                                <h2 className="font-bold text-slate-900">
                                    Billing ERP
                                </h2>

                                <p className="text-[10px] uppercase tracking-widest text-slate-400">
                                    Management System
                                </p>

                            </div>

                        </div>

                        {/* Heading */}

                        <div className="mb-9">

                            <p className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-3">
                                Welcome Back
                            </p>

                            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
                                Sign in to
                                <span className="block">
                                    your workspace.
                                </span>
                            </h2>

                            <p className="mt-4 text-slate-500 leading-6">
                                Enter your account details to access
                                your Billing ERP dashboard.
                            </p>

                        </div>

                        {/* Error */}

                        {error && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Form */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Email */}

                            <div>

                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email address
                                </label>

                                <div className="relative">

                                    <Mail
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                        autoComplete="email"
                                        className="w-full h-14 rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />

                                </div>

                            </div>

                            {/* Password */}

                            <div>

                                <div className="flex items-center justify-between mb-2">

                                    <label className="text-sm font-semibold text-slate-700">
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        Forgot password?
                                    </button>

                                </div>

                                <div className="relative">

                                    <Lock
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                        autoComplete="current-password"
                                        className="w-full h-14 rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* Remember */}

                            <div className="flex items-center">

                                <label className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer">

                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />

                                    Remember me

                                </label>

                            </div>

                            {/* Submit */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            >

                                {loading ? (
                                    <>
                                        <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in

                                        <ArrowRight
                                            size={18}
                                            className="group-hover:translate-x-1 transition-transform"
                                        />
                                    </>
                                )}

                            </button>

                        </form>

                        {/* Security note */}

                        <div className="mt-8 pt-6 border-t border-slate-200 text-center">

                            <p className="text-xs text-slate-400">
                                Your account and business data are
                                securely protected.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
};

export default Login;