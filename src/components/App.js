import React from "react";
import Signup from "./account/Signup";
import Dashboard from "./Dashboard";
import Login from "./account/Login";
import ForgotPassword from "./account/ForgotPassword";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ChangeEmail from "./account/ChangeEmail";
import ChangePassword from "./account/ChangePassword";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Switch>
                    <PrivateRoute exact path="/" component={Dashboard} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/login" component={Login} />
                    <Route path="/update-email" component={ChangeEmail} />
                    <Route path="/update-password" component={ChangePassword} />
                    <Route path="/forgot-password" component={ForgotPassword} />
                </Switch>
            </AuthProvider>
        </Router>
    );
}

export default App;
