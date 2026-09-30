import { Mail, Phone, ShieldCheck } from "lucide-react";

export default function ProfileCard({ user, email }) {
    const roles = user?.roles ? [...user.roles] : [];

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Your profile</h2>

            <dl className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <dd className="text-slate-700">{user?.email ?? email}</dd>
                </div>
                {user?.phoneNo && (
                    <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <dd className="text-slate-700">{user.phoneNo}</dd>
                    </div>
                )}
                <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-slate-400" />
                    <dd className="flex flex-wrap gap-1.5">
                        {roles.length ? (
                            roles.map((r) => (
                                <span
                                    key={r}
                                    className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700"
                                >
                  {r.replaceAll("_", " ")}
                </span>
                            ))
                        ) : (
                            <span className="text-slate-500">No roles assigned</span>
                        )}
                    </dd>
                </div>
            </dl>
        </section>
    );
}
