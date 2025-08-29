import { Router, Route, A} from "@solidjs/router";
import SignIn from "./pages/Signin"
import SignUp from "./pages/Signup"
import { Router, Route, A } from "@solidjs/router";
import Dashboard from "./pages/Dashboard";
import OSP from "./pages/OSP";

export default function App() {
  return (
    <>
      <Router>
        <Route path="/signin" component={SignIn}/>
        <Route path="/signup" component={SignUp}/>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/osp" component={OSP} />
        <Route path="/" component={() => <Dashboard />} />
      </Router>
    </>
  );
}
