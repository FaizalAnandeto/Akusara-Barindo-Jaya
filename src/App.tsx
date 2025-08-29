import { Router, Route, A} from "@solidjs/router";
import SignIn from "./pages/Signin"
import SignUp from "./pages/Signup"

export default  function App() {
  return(
    <>
      <Router>
        <Route path="/signin" component={SignIn}/>
        <Route path="/signup" component={SignUp}/>
      </Router>
    </>
  )
}
