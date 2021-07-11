import React, { useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import useAuthForm from "./utility/useAuthForm";
import {
  Password,
  PasswordConfirm,
  Submit,
  authStyle,
  Message,
  Dialog,
} from "./utility/AuthSheets";
import Navigation from "../Navigation";

/**
 * A component for the user to change their password. If the user is not
 * logged in, they should be redirected using PrivateRoute.
 *
 * @returns The React component for changing password
 */
export default function ChangePassword() {
  const {
    passwordRef,
    passwordConfirmRef,
    changePassword,
    error,
    setError,
    message,
    setMessage,
    loading,
    setLoading,
    isHidden,
    setIsHidden,
  } = useAuthForm("password");

  const successMsg = "Successfully updated profile.";

  useEffect(() => {
    document.title = "Change Password";
  }, []);

  /**
   * Handles form submission.
   *
   * Sends change password request to Firebase Auth and sets any alerts to be
   * displayed if the request succeeds or fails. Prevents accidental multiple
   * submissions of the form by disabling the button until the form is
   * updated.
   *
   * @param {Object} e The submit event. Used for preventing the default
   *                   submit behaviour.
   */
  function handleSubmit(e) {
    e.preventDefault(); // prevents form from refreshing upon submission

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    // Clear messages, errors and disable form
    setMessage("");
    setError("");
    setLoading(true);

    // Send change password request
    changePassword(passwordRef.current.value)
      .then(() => {
        setMessage(successMsg);
        setIsHidden(true); // password changed, hide form
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false); // re-enable form to let user retry
      });
  }
  const passwordFill = (
    <Password
      reference={passwordRef}
      onChange={() => {
        setMessage("");
        setError("");
      }}
      required
    />
  );
  const confirmFill = (
    <PasswordConfirm
      reference={passwordConfirmRef}
      onChange={() => {
        setMessage("");
        setError("");
      }}
      required
    />
  );
  const updateButton = <Submit loading={loading}>Update</Submit>;

  return (
    <>
      <Navigation />
      <Dialog>
        <Card>
          <Card.Body>
            <h2 className={authStyle.title}>Change Password</h2>
            <Message error={error} message={message} />
            {!isHidden && (
              <Form onSubmit={handleSubmit}>
                {passwordFill}
                {confirmFill}
                {updateButton}
              </Form>
            )}
          </Card.Body>
        </Card>
      </Dialog>
    </>
  );
}
