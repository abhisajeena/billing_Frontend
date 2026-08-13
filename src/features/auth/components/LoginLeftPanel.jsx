import logo from "../../../assets/login/billing-logo.png";
import illustration from "../../../assets/login/billing-dashboard-illustration.png";

const LoginLeftPanel = () => {

    return (

        <div className="relative bg-[#0D1B3D] text-white flex flex-col justify-between items-center px-10 py-8 overflow-hidden">

            {/* Decorative Circles */}

            <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-24 -right-20 w-72 h-72 bg-cyan-400 opacity-10 rounded-full blur-3xl"></div>

            {/* Logo */}

            <div className="w-full flex justify-center z-10">

                <img
                    src={logo}
                    alt="Billing Logo"
                    className="w-44 object-contain"
                />

            </div>

            {/* Illustration */}

            <div className="flex-1 flex items-center justify-center z-10">

                <img
                    src={illustration}
                    alt="Billing Illustration"
                    className="w-[360px] max-w-full object-contain"
                />

            </div>

            {/* Welcome Text */}

            <div className="text-center z-10">

                <h2 className="text-3xl font-bold mb-3">

                    Welcome Back 👋

                </h2>

                <p className="text-blue-200 leading-7 max-w-sm">

                    Manage invoices, clients, payments and
                    reports from one secure dashboard.

                </p>

            </div>

        </div>

    );

};

export default LoginLeftPanel;