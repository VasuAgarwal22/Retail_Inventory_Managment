import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import WelcomeBanner from "../components/welcome/WelcomeBanner";
import StatsGrid from "../components/welcome/StatsGrid";
import QuickActions from "../components/welcome/QuickActions";
import ProfileCard from "../components/welcome/ProfileCard";

export default function WelcomePage() {
    const { user, email, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const fullName = user ? `${user.firstName} ${user.lastName}` : "";

    return (
        <div className="flex min-h-screen flex-col bg-slate-50">
            <Navbar
                name={fullName}
                email={email}
                onLogout={logout}
                onMenuClick={() => setMenuOpen(true)}
            />

            <div className="flex flex-1">
                <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

                <main className="flex-1 space-y-6 p-4 sm:p-6">
                    <WelcomeBanner name={user?.firstName} />
                    <StatsGrid />

                    <div className="grid gap-6 xl:grid-cols-3">
                        <div className="xl:col-span-2">
                            <QuickActions />
                        </div>
                        <ProfileCard user={user} email={email} />
                    </div>
                </main>
            </div>
        </div>
    );
}
