import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import WelcomePage from "./pages/WelcomePage";

function Routes() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <WelcomePage /> : <AuthPage />;
}

const App = () => (
    <AuthProvider>
      <Routes />
    </AuthProvider>
);

export default App;
