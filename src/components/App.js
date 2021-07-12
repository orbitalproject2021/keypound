import React from "react";
import Signup from "./account/Signup";
import Dashboard from "../pages/Dashboard";
import Login from "./account/Login";
import ForgotPassword from "./account/ForgotPassword";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ChangeEmail from "./account/ChangeEmail";
import ChangePassword from "./account/ChangePassword";
import Breakdown from "../pages/Breakdown";
import AddTransaction from "../pages/AddTransaction";
import Goals from "../pages/Goals";
import Settings from "../pages/Settings";
import Start from "./account/Start";
import UpdateEntry from "../pages/UpdateEntry";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute path="/breakdown" component={Breakdown} />
          <PrivateRoute path="/update-entry" component={UpdateEntry} />
          <PrivateRoute path="/add-transaction" component={AddTransaction} />
          <PrivateRoute path="/goals" component={Goals} />
          <PrivateRoute path="/settings" component={Settings} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/change-email" component={ChangeEmail} />
          <PrivateRoute path="/change-password" component={ChangePassword} />
          <PrivateRoute path="/start" component={Start} />
          <Route path="/forgot-password" component={ForgotPassword} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;
