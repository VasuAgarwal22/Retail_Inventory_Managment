import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

export default function LoginForm({ notice, onSwitch }) {
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const validate = () => {
        const errs = {};
        if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email address";
        if (!form.password) errs.password = "Password is required";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setLoading(true);
        try {
            await login(form.email.trim(), form.password);
        } catch (err) {
            setApiError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Alert type="success">{notice}</Alert>
            <Alert>{apiError}</Alert>

            <InputField
                id="login-email"
                name="email"
                label="Email"
                type="email"
                icon={Mail}
                placeholder="you@company.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
            />
            <InputField
                id="login-password"
                name="password"
                label="Password"
                type="password"
                icon={Lock}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
            />

            <Button type="submit" loading={loading}>
                Sign in
            </Button>

            <p className="text-center text-sm text-slate-600">
                New here?{" "}
                <button
                    type="button"
                    onClick={onSwitch}
                    className="font-semibold text-indigo-600 hover:underline"
                >
                    Create an account
                </button>
            </p>
        </form>
    );
}
