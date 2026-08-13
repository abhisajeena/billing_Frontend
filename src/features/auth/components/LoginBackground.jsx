const LoginBackground = ({ children }) => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-950 flex items-center justify-center font-sans">
            {/* Background Blur Ambient Glows */}
            <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-cyan-400/20 blur-[130px] pointer-events-none"></div>
            <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-blue-900/30 blur-[130px] pointer-events-none"></div>

            {/* Mesh dot pattern overlay */}
            <div 
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                }}
            />

            <div className="relative z-10 flex items-center justify-center w-full min-h-screen p-4 sm:p-6">
                {children}
            </div>
        </div>
    );
};

export default LoginBackground;