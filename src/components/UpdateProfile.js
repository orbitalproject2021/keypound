import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function UpdateProfile() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { updateEmail, updatePassword, currentUser } = useAuth();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    function handleSubmit(e) {
        setMessage("");
        setError("");

        e.preventDefault();
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match.");
        }

        const promises = [];
        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value));
        }
        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value));
        }

        Promise.all(promises)
            .then(() => {
                setMessage("Successfully updated profile.");
            })
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    }
    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Update Email</h2>
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                ref={emailRef}
                                defaultValue={currentUser.email}
                                required
                            />
                        </Form.Group>

                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                ref={passwordRef}
                                placeholder="Leave blank to keep the same"
                            />
                        </Form.Group>

                        <Form.Group id="passwordConfirm">
                            <Form.Label>Password Confirm</Form.Label>
                            <Form.Control
                                type="password"
                                ref={passwordConfirmRef}
                                placeholder="Leave blank to keep the same"
                            />
                        </Form.Group>

                        <div style={{ padding: "10pt" }}></div>
                        <Button
                            disabled={loading}
                            className="w-100"
                            type="submit"
                        >
                            Update
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/">Back to Home</Link>
            </div>
        </>
    );
}
