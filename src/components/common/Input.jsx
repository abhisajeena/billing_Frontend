import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Input = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    icon,
    error,
    required = false,
}) => {

    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    return (

        <div className="space-y-2">

            {label && (

                <label className="block text-sm font-semibold text-gray-700">

                    {label}

                </label>

            )}

            <div
               className={`
flex
items-center
h-14
rounded-xl
bg-white
shadow-lg
px-4
border
border-transparent
transition-all
duration-300
focus-within:ring-4
focus-within:ring-cyan-300
${error ? "ring-2 ring-red-500" : ""}
`}
            >

                {icon && (

                    <span className="text-gray-400 mr-3">

                        {icon}

                    </span>

                )}

                <input

                    type={
                        isPassword
                            ? (showPassword ? "text" : "password")
                            : type
                    }

                    name={name}

                    value={value}

                    onChange={onChange}

                    placeholder={placeholder}

                    required={required}

                    className="flex-1 outline-none bg-transparent"

                />

                {isPassword && (

                    <button

                        type="button"

                        onClick={() =>
                            setShowPassword(!showPassword)
                        }

                    >

                        {

                            showPassword

                                ?

                                <EyeOff
                                    size={20}
                                    className="text-gray-500"
                                />

                                :

                                <Eye
                                    size={20}
                                    className="text-gray-500"
                                />

                        }

                    </button>

                )}

            </div>

            {

                error && (

                    <p className="text-red-500 text-sm">

                        {error}

                    </p>

                )

            }

        </div>

    );

};

export default Input;