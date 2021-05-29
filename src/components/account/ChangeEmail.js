import React, { useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuthForm from "./utility/useAuthForm";
import { Email, Submit, authStyle, Message } from "./utility/AuthSheets";

export default function ChangeEmail() {
    const {
        emailRef,
        changeEmail,
        currentUser,
        error,
        setError,
        message,
        setMessage,
        loading,
        setLoading,
    } = useAuthForm();
    const successMsg = "Successfully updated profile.";

    useEffect(() => {
        !currentUser &&
            setError((prev) =>
                message === successMsg ? prev : "Error: You must be logged in."
            );
    }, [message, setError, currentUser]);

    function handleSubmit(e) {
        e.preventDefault();
        if (!currentUser) {
            return;
        }

        setMessage("");
        setError("");

        changeEmail(emailRef.current.value)
            .then(() => {
                setMessage(`Profile updated successfully.`);
            })
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className={authStyle.title}>Change Email</h2>
                    <Message error={error} message={message} />
                    <Form onSubmit={handleSubmit}>
                        <Email
                            reference={emailRef}
                            defaultValue={currentUser && currentUser.email}
                            required={true}
                            onChange={() => {
                                setMessage("");
                                setError("");
                            }}
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
