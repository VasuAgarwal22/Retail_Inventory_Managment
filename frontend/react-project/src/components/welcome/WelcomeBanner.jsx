import { Sparkles } from "lucide-react";

export default function WelcomeBanner({ name }) {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    return (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white sm:p-8">
            <Sparkles className="absolute -right-4 -top-4 h-32 w-32 text-white/10" />
            <p className="text-sm font-medium text-indigo-100">{greeting}</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Welcome{name ? `,${name}` : ""}
            </h1>
        </section>
    );
}
