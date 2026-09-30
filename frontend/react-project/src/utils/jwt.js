export function decodeToken(token) {
    if (!token) return null;
    try {
        const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = part.padEnd(Math.ceil(part.length / 4) * 4, "=");
        return JSON.parse(atob(padded));
    } catch {
        return null;
    }
}

export function isTokenValid(token) {
    const payload = decodeToken(token);
    return !!payload?.exp && payload.exp * 1000 > Date.now();
}
