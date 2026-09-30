import { Package, TriangleAlert, Truck, Warehouse } from "lucide-react";
import StatCard from "./StatCard";

// TODO: replace the "—" placeholders with real numbers once you add
// count/summary endpoints to the backend.
export default function StatsGrid() {
    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total products" icon={Package} tone="indigo" />
            <StatCard label="Warehouses" icon={Warehouse} tone="emerald" />
            <StatCard label="Suppliers" icon={Truck} tone="amber" />
            <StatCard label="Low stock items" icon={TriangleAlert} tone="rose" />
        </section>
    );
}
