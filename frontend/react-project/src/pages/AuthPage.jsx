import { useState } from "react";
import AuthBrandPanel from "../components/auth/AuthBrandPanel";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

export default function AuthPage() {
    const [mode, setMode] = useState("login"); // "login" | "register"
    const [notice, setNotice] = useState("");

    const isLogin = mode === "login";

    const handleRegistered = () => {
        setNotice("Account created successfully. Please sign in.");
        setMode("login");
    };

    const switchMode = (next) => {
        setNotice("");
        setMode(next);
    };

    return (
        <div className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
            <AuthBrandPanel />

            <div className="flex items-center justify-center px-4 py-10 sm:px-8">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {isLogin ? "Welcome back" : "Create your account"}
                    </h2>
                    <p className="mb-6 mt-1 text-sm text-slate-500">
                        {isLogin
                            ? "Sign in to manage your inventory."
                            : "Fill in your details to get started."}
                    </p>

                    {isLogin ? (
                        <LoginForm notice={notice} onSwitch={() => switchMode("register")} />
                    ) : (
                        <RegisterForm
                            onSuccess={handleRegistered}
                            onSwitch={() => switchMode("login")}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
