import React, { Component } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Bingo from "./pages/bingo";
import Login from "./pages/login";

const ProtectedRoute = (props) => {
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
          {/* <Route path="/admin">
            <span>Hi admin</span>
          </Route> */}
          <ProtectedRoute path="/bingo" component={Bingo} />
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
