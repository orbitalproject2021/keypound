import React, { useState, useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import useAuthForm from "./utility/useAuthForm";
import {
    Email,
    Submit,
    Message,
    authStyle,
    Dialog,
    ExtLink,
} from "./utility/AuthSheets";

/**
 * A component for the user to reset their password if they have forgotten it.
 *
 * @returns The React component for resetting password.
 */
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
    } = useAuthForm();

    // Timer variable for displaying time left before sending another email.
    // To be displayed as button label.
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        document.title = "Forgot Password - Spendee";
    }, []);

    useEffect(() => {
        // Decrement the timer every second
        const interval = setInterval(
            () => setTimer((timer) => timer - 1),
            1000
        );

        // Once the timer hits zero, re-enable the form
        if (timer === 0) {
            setLoading(false);
            setMessage("");
            clearInterval(interval);
        }

        // After the component unmounts, remove the timer
        return () => {
            clearInterval(interval);
        };
    }, [timer, setLoading, setMessage]);

    /**
     * Handles form submission.
     *
     * Sends password reset request to Firebase Auth and sets any alerts to be
     * displayed if the request succeeds or fails. If the email is sent
     * successfully, there is a delay before the next email can be sent.
     *
     * @param {Object} e The submit event. Used for preventing the default
     *                   submit behaviour.
     */
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
                        <ExtLink url="/">Cancel</ExtLink>
                    </div>
                </Card.Body>
            </Card>
        </Dialog>
    );
}
