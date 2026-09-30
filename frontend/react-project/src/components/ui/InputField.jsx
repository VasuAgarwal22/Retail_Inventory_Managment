
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function InputField({
                                       label,
                                       id,
                                       icon: Icon,
                                       type = "text",
                                       error,
                                       ...props
                                   }) {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";

    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                )}
                <input
                    id={id}
                    type={isPassword && show ? "text" : type}
                    className={`w-full rounded-lg border bg-white py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 ${
                        Icon ? "pl-10" : "pl-3"
                    } ${isPassword ? "pr-10" : "pr-3"} ${
                        error
                            ? "border-red-400 focus:ring-red-200"
                            : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200"
                    }`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={show ? "Hide password" : "Show password"}
                    >
                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}
