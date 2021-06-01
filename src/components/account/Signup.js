import React, { useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import useAuthForm from "./utility/useAuthForm";
import {
    Email,
    Password,
    PasswordConfirm,
    Submit,
    authStyle,
    Message,
    Dialog,
    ExtLink,
} from "./utility/AuthSheets";

export default function Signup() {
    const {
        emailRef,
        passwordRef,
        passwordConfirmRef,
        signup,
        error,
        setError,
        loading,
        setLoading,
        history,
    } = useAuthForm();

    useEffect(() => {
        document.title = "Sign Up - Spendee";
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match");
        }

        try {
            setError("");
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            history.push("/");
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }
    return (
        <Dialog>
            <Card>
                <Card.Body>
                    <h2 className={authStyle.title}>Sign Up</h2>
                    <Message error={error} />
                    <Form onSubmit={handleSubmit}>
                        <Email reference={emailRef} required={true} />
                        <Password reference={passwordRef} required={true} />
                        <PasswordConfirm
                            reference={passwordConfirmRef}
                            required={true}
                        />
                        <Submit loading={loading}>Sign Up</Submit>
                    </Form>
                </Card.Body>
            </Card>
            <div className={authStyle.link}>
                {"Already have an account? Log in "}
                <ExtLink url="/login">here</ExtLink>.
            </div>
        </Dialog>
    );
}
