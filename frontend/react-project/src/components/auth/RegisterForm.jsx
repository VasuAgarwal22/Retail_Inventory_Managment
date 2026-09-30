import { useState } from "react";
import { Lock, Mail, Phone, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
};

export default function RegisterForm({ onSuccess, onSwitch }) {
    const { register } = useAuth();
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const validate = () => {
        const errs = {};
        if (!form.firstName.trim()) errs.firstName = "Required";
        if (!form.lastName.trim()) errs.lastName = "Required";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email address";
        if (!/^\+?\d{7,15}$/.test(form.phoneNo.replace(/[\s-]/g, "")))
            errs.phoneNo = "Enter a valid phone number";
        if (form.password.length < 6) errs.password = "At least 6 characters";
        if (form.confirmPassword !== form.password)
            errs.confirmPassword = "Passwords do not match";
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
            await register({
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                phoneNo: form.phoneNo.trim(),
                password: form.password,
            });
            onSuccess(form.email.trim());
        } catch (err) {
            setApiError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Alert>{apiError}</Alert>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                    id="reg-first"
                    name="firstName"
                    label="First name"
                    icon={User}
                    placeholder="Jane"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <InputField
                    id="reg-last"
                    name="lastName"
                    label="Last name"
                    icon={User}
                    placeholder="Doe"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
            </div>

            <InputField
                id="reg-email"
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
                id="reg-phone"
                name="phoneNo"
                label="Phone number"
                type="tel"
                icon={Phone}
                placeholder="9876543210"
                autoComplete="tel"
                value={form.phoneNo}
                onChange={handleChange}
                error={errors.phoneNo}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InputField
                    id="reg-password"
                    name="password"
                    label="Password"
                    type="password"
                    icon={Lock}
                    placeholder="Min. 6 characters"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                />
                <InputField
                    id="reg-confirm"
                    name="confirmPassword"
                    label="Confirm password"
                    type="password"
                    icon={Lock}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                />
            </div>

            <Button type="submit" loading={loading}>
                Create account
            </Button>

            <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={onSwitch}
                    className="font-semibold text-indigo-600 hover:underline"
                >
                    Sign in
                </button>
            </p>
        </form>
    );
}
