import React from "react";
import { Link } from "react-router-dom";
import useAuthForm from "./utility/useAuthForm";
import {
    Email,
    Password,
    PasswordConfirm,
    Submit,
    authStyle,
    Message,
    Dialog,
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
            <div>
                <h2 className={authStyle.title}>Sign Up</h2>
                <Message error={error} />
                <form onSubmit={handleSubmit}>
                    <Email reference={emailRef} required={true} />
                    <Password reference={passwordRef} required={true} />
                    <PasswordConfirm
                        reference={passwordConfirmRef}
                        required={true}
                    />
                    <Submit loading={loading}>Sign Up</Submit>
                </form>
            </div>
            <div className={authStyle.link}>
                Already have an account? Log in <Link to="/login">here</Link>.
            </div>
        </Dialog>
    );
}
