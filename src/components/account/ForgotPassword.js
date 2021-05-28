import React, { useState, useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuthForm from "./utility/useAuthForm";
import { Email, Submit, Message, authStyle } from "./utility/AuthSheets";

export default function Login() {
    const {
        emailRef,
        resetPassword,
        error,
        setError,
        message,
        setMessage,
        loading,
        setLoading,
    } = useAuthForm();
    const [disabled, setDisabled] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        const interval = setInterval(
            () => setTimer((timer) => timer - 1),
            1000
        );
        if (timer === 0) {
            setDisabled(false);
            setLoading(false);
            setMessage("");
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
            setDisabled(true);
        } catch (error) {
            setError(error.message);
            setDisabled(false);
            setLoading(false);
        }
    }

    return (
        <Card>
            <Card.Body>
                <h2 className={authStyle.title}>Password Reset</h2>
                <Message message={message} error={error} />
                <Form
                    onSubmit={
                        disabled ? (e) => e.preventDefault() : handleSubmit
                    }
                >
                    <Email reference={emailRef} required={true} />
                    <Submit loading={loading}>
                        {disabled
                            ? `Resend in ${timer} seconds`
                            : "Send password reset mail"}
                    </Submit>
                </Form>
                <div className={authStyle.cardLink}>
                    <Link to="/login">Cancel</Link>
                </div>
            </Card.Body>
        </Card>
    );
}
