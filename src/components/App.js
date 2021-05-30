import React from "react";
import Signup from "./account/Signup";
import Dashboard from "./pages/Dashboard";
import Login from "./account/Login";
import ForgotPassword from "./account/ForgotPassword";
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ChangeEmail from "./account/ChangeEmail";
import ChangePassword from "./account/ChangePassword";
import Advisor from "./pages/Advisor";
import Breakdown from "./pages/Breakdown";
import Credit from "./pages/Credit";
import Expense from "./pages/Expense";
import Goals from "./pages/Goals";
import Loans from "./pages/Loans";
import Reminders from "./pages/Reminders";
import Settings from "./pages/Settings";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Switch>
                    <PrivateRoute exact path="/" component={Dashboard} />
                    <PrivateRoute path="/advisor" component={Advisor} />
                    <PrivateRoute path="/breakdown" component={Breakdown} />
                    <PrivateRoute path="/credit" component={Credit} />
                    <PrivateRoute path="/add-expense" component={Expense} />
                    <PrivateRoute path="/goals" component={Goals} />
                    <PrivateRoute path="/loans" component={Loans} />
                    <PrivateRoute path="/reminders" component={Reminders} />
                    <PrivateRoute path="/settings" component={Settings} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/login" component={Login} />
                    <Route path="/change-email" component={ChangeEmail} />
                    <Route path="/change-password" component={ChangePassword} />
                    <Route path="/forgot-password" component={ForgotPassword} />
                </Switch>
            </AuthProvider>
        </Router>
    );
}

export default App;
