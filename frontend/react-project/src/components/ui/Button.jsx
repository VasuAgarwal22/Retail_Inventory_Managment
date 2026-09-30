import { LoaderCircle } from "lucide-react";

export default function Button({ children, loading = false, disabled, ...props }) {
    return (
        <button
            disabled={disabled || loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
            {...props}
        >
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
}
