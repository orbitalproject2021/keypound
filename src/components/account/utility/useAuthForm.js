/**
 * A custom hook which provides declarations for variables and functions that
 * are useful for creating authentication forms.
 */
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useHistory } from "react-router-dom";

/**
 * Provides variables and functions in an object.
 *
 * Recommended usage is to import the relevant variables using object
 * destructuring. Warning: Can cause errors if the focus field is not provided
 * and there is no email field present.
 *
 * @param {string} focus Defines whether the password field should be focused.
 *                       If anything other than "password", or if left blank,
 *                       the email field will be focused.
 * @returns              An object containing the variables and functions
 *                       relevant to the creation of authentication forms.
 */
function useAuthForm(focus) {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const {
        signup,
        changeEmail,
        changePassword,
        currentUser,
        resetPassword,
        login,
    } = useAuth();
    const history = useHistory();

    // Puts focus on the email field, or the password field if the focus
    // parameter is provided as "password".
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
        isHidden,
        setIsHidden,
    };
}

export default useAuthForm;
