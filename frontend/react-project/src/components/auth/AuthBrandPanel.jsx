import { Boxes, ScanBarcode, Truck, Warehouse } from "lucide-react";

const features = [
    { icon: Boxes, text: "Track stock across every product variant" },
    { icon: Warehouse, text: "Manage warehouses and storage locations" },
    { icon: Truck, text: "Keep suppliers and purchasing in one place" },
    { icon: ScanBarcode, text: "Full history of every stock movement" },
];

export default function AuthBrandPanel() {
    return (
        <div className="hidden flex-col justify-between bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-700 p-10 text-white lg:flex">
            <div className="flex items-center gap-2 text-lg font-bold">
                <Boxes className="h-6 w-6" />
                Retail_Inventory_Management_System
            </div>

            <div>
                <h1 className="text-3xl font-bold leading-tight">
                    Retail inventory,
                    <br />
                    finally under control.
                </h1>
                <ul className="mt-8 space-y-4">
                    {features.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-center gap-3 text-indigo-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                <Icon className="h-4 w-4" />
              </span>
                            {text}
                        </li>
                    ))}
                </ul>
            </div>

            <p className="text-xs text-indigo-200">© {new Date().getFullYear()} Retail Inventory Management</p>
        </div>
    );
}
