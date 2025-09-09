import { Router, Route, A } from "@solidjs/router";
import { SettingsProvider } from "./contexts/SettingsContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import SignIn from "./pages/Signin";
import Verify2FA from "./pages/Verify2FA";
import SignUp from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Security from "./pages/Security";
import Finance from "./pages/Finance";
import OSP from "./pages/OSP";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <SettingsProvider>
      <LanguageProvider>
        <Router>
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/forgotpw" component={ForgotPassword} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/verify-2fa" component={Verify2FA} />
          <Route path="/security" component={Security} />
          <Route path="/finance" component={Finance} />
          <Route path="/osp" component={OSP} />
          <Route path="/settings" component={Settings} />
          <Route path="/profile" component={Profile} />
          <Route path="/" component={() => <SignIn />} />
        </Router>
      </LanguageProvider>
    </SettingsProvider>
  );
}
