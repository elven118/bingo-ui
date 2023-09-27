import React, { Component } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AdminLogin from "./pages/adminLogin";
import Bingo from "./pages/bingo";
import BingoDrawer from "./pages/bingoDrawer";
import Login from "./pages/login";
import ValidateBingo from "./pages/validateBingo";

const ProtectedRoute = ({ redirectRoute = "/", ...props }) => {
  const jwt = localStorage.getItem("jwt");
  if (!jwt) {
    return <Redirect to="/" />;
  }

  return <Route {...props} />;
};

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route
            path="/admin"
            redirectRoute="/admin-login"
            component={BingoDrawer}
          />
          <Route
            path="/admin-validate"
            redirectRoute="/admin-login"
            component={ValidateBingo}
          />
          <Route path="/admin-login" component={AdminLogin} />
          <ProtectedRoute path="/bingo" component={Bingo} />
          <Route path="/" component={Login} />
        </Switch>
      </Router>
    );
  }
}

export default App;
