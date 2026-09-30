import { Boxes, LogOut, Menu } from "lucide-react";

export default function Navbar({ name, email, onLogout, onMenuClick }) {
    const initial = (name || email || "?").charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                    aria-label="Open menu"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Boxes className="h-6 w-6 text-indigo-600" />
                    Retail_Inventory_Management_System
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold text-slate-900">{name || "User"}</p>
                    <p className="text-xs text-slate-500">{email}</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                    {initial}
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>
    );
}
