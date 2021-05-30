import React from "react";
import {
    Email,
    Password,
    Submit,
    Message,
    authStyle,
    Dialog,
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
            <div>
                <h2 className={authStyle.title}>Log In</h2>
                <Message error={error} />
                <form onSubmit={handleSubmit}>
                    <Email reference={emailRef} required={true} />
                    <Password reference={passwordRef} required={true} />
                    <Submit loading={loading}>Log In</Submit>
                </form>
                <div className={authStyle.cardLink}>
                    <Link to="/forgot-password">Forgot Password?</Link>
                </div>
            </div>
            <div className={authStyle.link}>
                Need an account? Sign up <Link to="/signup">here</Link>.
            </div>
        </Dialog>
    );
}
