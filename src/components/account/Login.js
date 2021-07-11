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

/**
 * A component for the user to log in.
 *
 * @returns The React component for the login page.
 */
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
    document.title = "Log In - Keypound";
  }, []);

  /**
   * Handles form submission.
   *
   * Sends login request to Firebase Auth and sets any alerts to be
   * displayed if the request succeeds or fails. Redirects user to home
   * page if login is successful.
   *
   * @param {Object} e The submit event. Used for preventing the default
   *                   submit behaviour.
   */
  async function handleSubmit(e) {
    e.preventDefault(); // prevent form from refreshing upon submission
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
  const emailFill = <Email reference={emailRef} required={true} />;
  const passwordFill = <Password reference={passwordRef} required={true} />;
  const loginButton = <Submit loading={loading}>Log In</Submit>;

  return (
    <Dialog>
      <Card>
        <Card.Body>
          <h2 className={authStyle.title}>Log In</h2>
          <Message error={error} />
          <Form onSubmit={handleSubmit}>
            {emailFill}
            {passwordFill}
            {loginButton}
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
