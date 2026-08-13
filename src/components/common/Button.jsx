import Loader from "./Loader";

const Button = ({
    children,
    type = "button",
    variant = "primary",
    loading = false,
    disabled = false,
    fullWidth = false,
    onClick,
    icon,
    className = "",
}) => {
    const variants = {
        primary:
            "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg",

        secondary:
            "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200",

        success:
            "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md",

        danger:
            "bg-red-600 hover:bg-red-700 text-white shadow-md",

        outline:
            "bg-white border border-blue-600 text-blue-600 hover:bg-blue-50",

        ghost:
            "bg-transparent text-gray-700 hover:bg-gray-100",

        purple:
            "bg-violet-600 hover:bg-violet-700 text-white shadow-md",
    };

    const selectedVariant =
        variants[variant] || variants.primary;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={loading || disabled}
            className={`
                ${fullWidth ? "w-full" : ""}
                ${selectedVariant}
                h-11
                px-5
                rounded-xl
                font-semibold
                text-sm
                inline-flex
                items-center
                justify-center
                gap-2
                whitespace-nowrap
                transition-all
                duration-200
                active:scale-[0.98]
                disabled:opacity-50
                disabled:cursor-not-allowed
                ${className}
            `}
        >
            {loading ? (
                <Loader size={20} />
            ) : (
                <>
                    {icon}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;