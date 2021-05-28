import { useState, useRef } from "react";
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

export default useAuthForm;
