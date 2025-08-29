import { Router, Route, A } from "@solidjs/router";
import { SettingsProvider } from "./contexts/SettingsContext";
import SignIn from "./pages/Signin"
import SignUp from "./pages/Signup"
import Dashboard from "./pages/Dashboard";
import OSP from "./pages/OSP";
import Security from "./pages/Security";
import Finance from "./pages/Finance";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <SettingsProvider>
      <Router>
        <Route path="/signin" component={SignIn}/>
        <Route path="/signup" component={SignUp}/>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/osp" component={OSP} />
        <Route path="/security" component={Security} />
        <Route path="/finance" component={Finance} />
        <Route path="/settings" component={Settings} />
        <Route path="/profile" component={Profile} />
        <Route path="/" component={() => <Dashboard />} />
      </Router>
    </SettingsProvider>
  );
}
