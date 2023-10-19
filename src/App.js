import React, { Component } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AdminBingoDrawer from "./pages/adminBingoDrawer";
import AdminLogin from "./pages/adminLogin";
import AdminValidateBingo from "./pages/adminValidateBingo";
import Bingo from "./pages/bingo";
import Login from "./pages/login";
import Alert from "./components/alert";
import { getJwt } from "./utils/jwt";

const ProtectedRoute = ({ redirectRoute = "/", ...props }) => {
  const jwt = getJwt();

  if (!jwt) {
    return <Redirect to={redirectRoute} />;
  }

  return <Route {...props} />;
};

class App extends Component {
  render() {
    return (
      <>
        <Alert />
        <Router>
          <Switch>
            <ProtectedRoute
              path="/admin"
              redirectRoute="/admin-login"
              component={AdminBingoDrawer}
            />
            <ProtectedRoute
              path="/admin-validate"
              redirectRoute="/admin-login"
              component={AdminValidateBingo}
            />
            <Route path="/admin-login" component={AdminLogin} />
            <ProtectedRoute path="/bingo" component={Bingo} />
            <Route path="/" component={Login} />
          </Switch>
        </Router>
      </>
    );
  }
}

export default App;
