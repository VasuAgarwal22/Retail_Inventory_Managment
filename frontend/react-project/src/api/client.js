const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function request(path, { method = "GET", body, token } = {}) {
    let res;
    try {
        res = await fetch(`${BASE_URL}${path}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch {
        throw Object.assign(
            new Error("Cannot reach the server. Is the backend running on port 8080?"),
            { status: 0 },
        );
    }

    const text = await res.text();
    let data = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text; // plain-text response
    }

    if (!res.ok) {
        const message =
            (data && typeof data === "object" && data.message) ||
            (res.status === 401 || res.status === 403
                ? "Invalid email or password."
                : "Something went wrong. Please try again.");
        throw Object.assign(new Error(message), { status: res.status });
    }

    return data;
}

export const authApi = {
    login: (email, password) =>
        request("/api/auth/login", { method: "POST", body: { email, password } }),
    register: (payload) =>
        request("/api/auth/register", { method: "POST", body: payload }),
    getAllUsers: (token) => request("/api/auth/all", { token }),
};
