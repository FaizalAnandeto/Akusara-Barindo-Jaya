import { Router, Route, A } from "@solidjs/router";
import Dashboard from "./pages/Dashboard";
import OSP from "./pages/OSP";

export default function App() {
  return (
    <>
      <Router>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/osp" component={OSP} />
        <Route path="/" component={() => <Dashboard />} />
      </Router>
    </>
  );
}
