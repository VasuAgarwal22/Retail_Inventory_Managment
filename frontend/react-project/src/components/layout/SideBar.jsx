import {
    Boxes,
    LayoutDashboard,
    Package,
    Tags,
    Truck,
    Users,
    Warehouse,
    X,
} from "lucide-react";

const links = [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "Products", icon: Package },
    { label: "Categories & Brands", icon: Tags },
    { label: "Warehouses", icon: Warehouse },
    { label: "Suppliers", icon: Truck },
    { label: "Users", icon: Users },
];

export default function Sidebar({ open, onClose }) {
    return (
        <>
            {/* mobile backdrop */}
            {open && (
                <div
                    className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white p-4 transition-transform lg:static lg:z-auto lg:translate-x-0 ${
                    open ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="mb-6 flex items-center justify-between lg:hidden">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Boxes className="h-6 w-6 text-indigo-600" />
                        Retail_Inventory_Management_System
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-slate-100" aria-label="Close menu">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="space-y-1">
                    {links.map(({ label, icon: Icon, active }) => (
                        <button
                            key={label}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                active
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </button>
                    ))}
                </nav>
            </aside>
        </>
    );
}
