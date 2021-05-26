import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

function Dashboard() {
    const { currentUser, logout } = useAuth();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const history = useHistory();
    const sleep = (ms) => new Promise((fn) => setTimeout(fn, ms));

    async function handleLogout() {
        try {
            await logout();
            setMessage("You have been logged out.");
        } catch {
            window.alert("Unable to log out.");
        } finally {
            sleep(2000).then(() => history.push("/login"));
        }
    }

    function handleUpdate() {
        history.push("/update");
    }

    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            {currentUser && (
                <div>
                    {currentUser && "User: " + currentUser.email}
                    <div></div>
                    <Button onClick={handleLogout}>Log out</Button>
                    <div style={{ padding: "2pt" }}></div>
                    <Button onClick={handleUpdate}>Update Profile</Button>
                </div>
            )}
        </>
    );
}

export default Dashboard;
