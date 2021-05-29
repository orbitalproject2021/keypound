import React, { useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuthForm from "./utility/useAuthForm";
import {
    Password,
    PasswordConfirm,
    Submit,
    authStyle,
    Message,
} from "./utility/AuthSheets";

export default function ChangePassword() {
    const {
        passwordRef,
        passwordConfirmRef,
        changePassword,
        currentUser,
        error,
        setError,
        message,
        setMessage,
        loading,
        setLoading,
    } = useAuthForm("password");
    const successMsg = "Successfully updated profile.";

    useEffect(() => {
        !currentUser &&
            setError((prev) =>
                message === successMsg ? prev : "Error: You must be logged in."
            );
    }, [message, setError]);

    function handleSubmit(e) {
        e.preventDefault();
        if (!currentUser) {
            return;
        }

        setMessage("");
        setError("");

        changePassword(passwordRef.current.value)
            .then(() => {
                setMessage("Successfully updated profile.");
            })
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    }

    const placeholder = "Leave blank to keep the same.";
    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className={authStyle.title}>Update Email</h2>
                    <Message error={error} message={message} />
                    <Form onSubmit={handleSubmit}>
                        <Password
                            reference={passwordRef}
                            placeholder={placeholder}
                            onChange={() => setMessage("")}
                        />

                        <PasswordConfirm
                            reference={passwordConfirmRef}
                            placeholder={placeholder}
                            onChange={() => setMessage("")}
                        />
                        <Submit loading={loading}>Update</Submit>
                    </Form>
                </Card.Body>
            </Card>
            <div className={authStyle.link}>
                <Link to="/">Back to Home</Link>
            </div>
        </>
    );
}
