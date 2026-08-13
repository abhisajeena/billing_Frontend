import { useState } from "react";
import { Mail, Lock, User, ShieldCheck, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import useAuthStore from "../store/auth.store";
import { registerApi } from "../api/auth.api";

const LoginForm = ({ isLogin, setIsLogin }) => {
    const navigate = useNavigate();
    const { login, loading } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "admin",
        }
    });

    const onSubmit = async (data) => {
        try {
            if (isLogin) {
                await login({
                    email: data.email,
                    password: data.password
                });
                toast.success("Welcome back! Access granted.");
                navigate("/dashboard");
            } else {
                const res = await registerApi({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    role: data.role
                });
                if (res.success) {
                    toast.success("Registration successful! You can now log in.");
                    setIsLogin(true);
                    reset();
                } else {
                    toast.error(res.message || "Registration failed");
                }
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to authenticate. Please check inputs."
            );
        }
    };

    return (
        <div className="w-full lg:w-1/2 min-h-screen bg-slate-50 flex flex-col justify-between p-8 sm:p-16 lg:p-20 font-sans">
            
            {/* Top Registration Toggle Link */}
            <div className="flex items-center justify-end text-xs font-semibold">
                <button
                    type="button"
                    onClick={() => {
                        setIsLogin(!isLogin);
                        reset();
                    }}
                    className="text-slate-500 hover:text-slate-800 transition"
                >
                    {isLogin ? (
                        <span>New here? <strong className="text-blue-600 hover:underline">Create account</strong></span>
                    ) : (
                        <span>Already registered? <strong className="text-blue-600 hover:underline">Sign in</strong></span>
                    )}
                </button>
            </div>

            {/* Main Form Box */}
            <div className="max-w-[400px] w-full mx-auto my-auto space-y-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {isLogin ? "Welcome back" : "Create Account"}
                    </h2>
                    <p className="text-slate-500 text-xs mt-2 font-medium leading-relaxed">
                        {isLogin 
                            ? "Sign in to your Billing ERP workspace to pick up where you left off."
                            : "Set up an administrator profile to initialize the billing registry."
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    
                    {/* Fields List */}
                    <div className="space-y-4">
                        {!isLogin && (
                            <>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Full Name
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-slate-400">
                                            <User size={16} />
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm"
                                            {...register("name", { required: "Name is required" })}
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="text-[10px] text-red-500 mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        System Role
                                    </label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-4 text-slate-400">
                                            <ShieldCheck size={16} />
                                        </span>
                                        <select
                                            className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm appearance-none cursor-pointer"
                                            {...register("role")}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="staff">Staff</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Email
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-slate-400">
                                    <Mail size={16} />
                                </span>
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email"
                                        }
                                    })}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-[10px] text-red-500 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Password
                                </label>
                                {isLogin && (
                                    <button
                                        type="button"
                                        className="text-xs font-bold text-blue-600 hover:underline transition"
                                        onClick={() => toast.success("Password recovery feature coming soon.")}
                                    >
                                        Forgot?
                                    </button>
                                )}
                            </div>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-slate-400">
                                    <Lock size={16} />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="w-full h-12 pl-11 pr-11 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Must be 6+ characters"
                                        }
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-[10px] text-red-500 mt-1">{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    {isLogin && (
                        <div className="flex items-center justify-between text-xs font-semibold pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-500 hover:text-slate-800 transition">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 accent-blue-600 rounded border-slate-300 bg-white"
                                />
                                Keep me signed in for 30 days
                            </label>
                        </div>
                    )}

                    {/* Submit Action */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/10 active:scale-[0.99] hover:scale-[1.01] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs tracking-wider uppercase"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <span className="flex items-center gap-2">
                                    {isLogin ? "Sign in" : "Create account"} <ArrowRight size={14} />
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Bottom Policy Terms text */}
            <div className="text-center text-[10px] text-slate-400 font-semibold mt-auto">
                By signing in you agree to our <button className="underline hover:text-slate-600">Terms</button> and <button className="underline hover:text-slate-600">Privacy Policy</button>.
            </div>
        </div>
    );
};

export default LoginForm;