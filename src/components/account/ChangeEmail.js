import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthForm from "./utility/useAuthForm";
import {
    Email,
    Submit,
    authStyle,
    Message,
    Dialog,
} from "./utility/AuthSheets";

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
        isHidden,
        setIsHidden,
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
                setIsHidden(true);
            })
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    }

    return (
        <Dialog>
            <div>
                <h2 className={authStyle.title}>Change Email</h2>
                <Message error={error} message={message} />
                {!isHidden && (
                    <form onSubmit={handleSubmit}>
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
                    </form>
                )}
            </div>
            <div className={authStyle.link}>
                <Link to="/">Back to Home</Link>
            </div>
        </Dialog>
    );
}
