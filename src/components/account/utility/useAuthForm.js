import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useHistory } from "react-router-dom";

function useAuthForm(focus) {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const {
        signup,
        changeEmail,
        changePassword,
        currentUser,
        resetPassword,
        login,
    } = useAuth();
    const history = useHistory();

    useEffect(() => {
        switch (focus) {
            case "password":
                passwordRef.current.focus();
                break;
            default:
                emailRef.current.focus();
        }
    }, [focus]);

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
        changeEmail,
        changePassword,
        currentUser,
        resetPassword,
        login,
        history,
    };
}

export default useAuthForm;
