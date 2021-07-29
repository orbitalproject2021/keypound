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

/**
 * A component for the user to sign up.
 *
 * @returns The React component for the sign up page.
 */
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
    document.title = "Sign Up - Keypound";
  }, []);

  /**
   * Handles form submission.
   *
   * Sends signup request to Firebase Auth and sets any alerts to be
   * displayed if the request succeeds or fails. Redirects user to home
   * page if signup is successful.
   *
   * @param {Object} e The submit event. Used for preventing the default
   *                   submit behaviour.
   */
  async function handleSubmit(e) {
    e.preventDefault(); // prevent form from refreshing

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

  //Abstractions for frontend
  const emailFill = <Email reference={emailRef} required={true} />;

  const passwordFill = <Password reference={passwordRef} required={true} />;

  const confirmFill = (
    <PasswordConfirm reference={passwordConfirmRef} required={true} />
  );

  const signupButton = <Submit loading={loading}>Sign Up</Submit>;

  const loginLink = (
    <div className={authStyle.link}>
      {"Already have an account? Log in "}
      <ExtLink url="/login">here</ExtLink>.
    </div>
  );

  return (
    <Dialog>
      <Card>
        <Card.Body>
          <h2 className={authStyle.title}>Sign Up</h2>
          <Message error={error} />
          <Form onSubmit={handleSubmit}>
            {emailFill}
            {passwordFill}
            {confirmFill}
            {signupButton}
          </Form>
        </Card.Body>
      </Card>
      {loginLink}
    </Dialog>
  );
}
