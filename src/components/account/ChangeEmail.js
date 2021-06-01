import React, { useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import useAuthForm from "./utility/useAuthForm";
import {
    Email,
    Submit,
    authStyle,
    Message,
    Dialog,
} from "./utility/AuthSheets";
import Navigation from "../Navigation";

export default function ChangeEmail() {
    const {
        emailRef,
        changeEmail,
        currentUser,
        error,
        setError,
        message,
        setMessage,
        isHidden,
        setIsHidden,
        loading,
        setLoading,
    } = useAuthForm();

    const successMsg = "Successfully updated profile.";

    useEffect(() => {
        document.title = "Change Email - Spendee";
    }, []);

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
                setIsHidden(true);
            })
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    }

    return (
        <>
            <Navigation />
            <Dialog>
                <Card>
                    <Card.Body>
                        <h2 className={authStyle.title}>Change Email</h2>
                        <Message error={error} message={message} />
                        {!isHidden && (
                            <Form onSubmit={handleSubmit}>
                                <Email
                                    reference={emailRef}
                                    required={true}
                                    onChange={() => {
                                        setMessage("");
                                        setError("");
                                    }}
                                />
                                <Submit loading={loading}>Update</Submit>
                            </Form>
                        )}
                    </Card.Body>
                </Card>
            </Dialog>
        </>
    );
}
