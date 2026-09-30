export default function StatCard({ label, value = "—", icon: Icon, tone = "indigo" }) {
    const tones = {
        indigo: "bg-indigo-50 text-indigo-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        rose: "bg-rose-50 text-rose-600",
    };

    return (
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${tones[tone]}`}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    );
}
