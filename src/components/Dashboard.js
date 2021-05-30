import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Navigation from "./Navigation";

function Dashboard() {
    const { currentUser, logout } = useAuth();
    const [message] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();

    async function handleLogout() {
        try {
            await logout();
            // setMessage("You have been logged out.");
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <>
            <Navigation />
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            {currentUser && (
                <div>
                    {currentUser && "User: " + currentUser.email}
                    <div></div>
                    <Button onClick={handleLogout}>Log out</Button>
                    <div style={{ padding: "2pt" }}></div>
                    <Button onClick={() => history.push("/change-email")}>
                        Change Email
                    </Button>
                    <div style={{ padding: "2pt" }}></div>
                    <Button onClick={() => history.push("/update-password")}>
                        Change Password
                    </Button>
                </div>
            )}
        </>
    );
}

export default Dashboard;
