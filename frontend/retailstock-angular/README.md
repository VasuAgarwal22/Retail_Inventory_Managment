# RetailStock (Angular)

Angular 21 port of the React auth + welcome app (standalone components, signals, Tailwind v4, lucide-angular).

## Run
```bash
npm install
npm start          # http://localhost:4200
```
Backend URL is set in `src/environments/environment.ts` (default `http://localhost:8080`).

## React -> Angular mapping
| React | Angular |
|---|---|
| `AuthContext` / `useAuth` | `core/auth.service.ts` (signals) |
| `api/client.js` | `core/api.service.ts` (HttpClient) |
| `utils/jwt.js` | `core/jwt.ts` |
| conditional render in `App.jsx` | routes + `authGuard` / `guestGuard` |
| `InputField` | `ui/input-field.ts` (ControlValueAccessor, works with reactive forms) |
