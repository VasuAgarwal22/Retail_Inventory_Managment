import { ArrowRight, Package, Tags, Truck, Warehouse } from "lucide-react";

const actions = [
    { title: "Manage products", desc: "Add, edit and review your product catalogue.", icon: Package },
    { title: "Categories & brands", desc: "Organise products into categories and brands.", icon: Tags },
    { title: "Warehouses", desc: "View warehouses and their storage locations.", icon: Warehouse },
    { title: "Suppliers", desc: "Maintain suppliers and what they provide.", icon: Truck },
];

export default function QuickActions({ onSelect }) {
    return (
        <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Quick actions</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {actions.map(({ title, desc, icon: Icon }) => (
                    <button
                        key={title}
                        onClick={() => onSelect?.(title)}
                        className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-indigo-300 hover:shadow-sm"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                            <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-slate-900">{title}</p>
                            <p className="mt-0.5 text-sm text-slate-500">{desc}</p>
                        </div>
                        <ArrowRight className="mt-1 h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
                    </button>
                ))}
            </div>
        </section>
    );
}
