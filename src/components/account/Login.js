import React, { useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import {
    Email,
    Password,
    Submit,
    Message,
    authStyle,
    Dialog,
    ExtLink,
} from "./utility/AuthSheets";
import { Link } from "react-router-dom";
import useAuthForm from "./utility/useAuthForm";

export default function Login() {
    const {
        emailRef,
        passwordRef,
        login,
        error,
        setError,
        loading,
        setLoading,
        history,
    } = useAuthForm();

    useEffect(() => {
        document.title = "Log In - Spendee";
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError("");
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            history.push("/");
        } catch (error) {
            setError(`Failed to log in: ${error.message}`);
            setLoading(false);
        }
    }

    return (
        <Dialog>
            <Card>
                <Card.Body>
                    <h2 className={authStyle.title}>Log In</h2>
                    <Message error={error} />
                    <Form onSubmit={handleSubmit}>
                        <Email reference={emailRef} required={true} />
                        <Password reference={passwordRef} required={true} />
                        <Submit loading={loading}>Log In</Submit>
                    </Form>
                    <div className={authStyle.cardLink}>
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                </Card.Body>
            </Card>
            <div className={authStyle.link}>
                Need an account? Sign up <ExtLink url="/signup">here</ExtLink>.
            </div>
        </Dialog>
    );
}
