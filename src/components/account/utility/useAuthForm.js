import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useHistory } from "react-router-dom";

function useAuthForm() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const {
        signup,
        updateEmail,
        updatePassword,
        currentUser,
        resetPassword,
        login,
    } = useAuth();
    const history = useHistory();

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    return {
        emailRef,
        passwordRef,
        passwordConfirmRef,
        error,
        setError,
        message,
        setMessage,
        loading,
        setLoading,
        signup,
        updateEmail,
        updatePassword,
        currentUser,
        resetPassword,
        login,
        history,
    };
}

export default React.memo(useAuthForm);
