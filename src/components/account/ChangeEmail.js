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

/**
 * A component for the user to change their email address. If the user is not
 * logged in, they should be redirected using PrivateRoute.
 *
 * @returns The React component for changing email address
 */
export default function ChangeEmail() {
    const {
        emailRef,
        changeEmail,
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
        document.title = "Change Email - nameless app";
    }, []);

    /**
     * Handles form submission.
     *
     * Sends change email request to Firebase Auth and sets any alerts to be
     * displayed if the request succeeds or fails. Prevents accidental multiple
     * submissions of the form by disabling the button until the form is
     * updated.
     *
     * @param {Object} e The submit event. Used for preventing the default
     *                   submit behaviour.
     */
    function handleSubmit(e) {
        e.preventDefault(); // prevent form from refreshing upon submission
        // clear messages upon submission
        setMessage("");
        setError("");
        setLoading(true); // disable the form to prevent repeated submission

        changeEmail(emailRef.current.value)
            .then(() => {
                setMessage(successMsg);
                setIsHidden(true); // hide the input fields
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false); // enable the form to let user try again
            });
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
