import { CircleAlert, CircleCheck } from "lucide-react";

export default function Alert({ type = "error", children }) {
    if (!children) return null;
    const isError = type === "error";
    const Icon = isError ? CircleAlert : CircleCheck;

    return (
        <div
            role="alert"
            className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${
                isError
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
        >
            <Icon className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{children}</span>
        </div>
    );
}
