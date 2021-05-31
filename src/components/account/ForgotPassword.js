import React, { useState, useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import useAuthForm from "./utility/useAuthForm";
import {
    Email,
    Submit,
    Message,
    authStyle,
    Dialog,
} from "./utility/AuthSheets";

export default function ForgotPassword() {
    const {
        emailRef,
        resetPassword,
        error,
        setError,
        message,
        setMessage,
        loading,
        setLoading,
        history,
    } = useAuthForm();
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        document.title = "Forgot Password - Spendee";
    }, []);

    useEffect(() => {
        const interval = setInterval(
            () => setTimer((timer) => timer - 1),
            1000
        );
        if (timer === 0) {
            setLoading(false);
            setMessage("");
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [timer, setLoading, setMessage]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError("");
            setLoading(true);
            await resetPassword(emailRef.current.value);
            setMessage("Check your inbox for further instructions.");
            setTimer(30);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    return (
        <Dialog>
            <Card>
                <Card.Body>
                    <h2 className={authStyle.title}>Password Reset</h2>
                    <Message message={message} error={error} />
                    <Form onSubmit={handleSubmit}>
                        <Email reference={emailRef} required={true} />
                        <Submit loading={loading}>
                            {loading && timer > 0
                                ? `Resend in ${timer} seconds`
                                : "Send password reset email"}
                        </Submit>
                    </Form>
                    <div className={authStyle.link}>
                        <span
                            className="dark-link"
                            onClick={() => history.push("/")}
                        >
                            Cancel
                        </span>
                    </div>
                </Card.Body>
            </Card>
        </Dialog>
    );
}
