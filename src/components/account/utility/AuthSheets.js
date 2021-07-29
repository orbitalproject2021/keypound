/**
 * Provides authentication bootstrap elements.
 *
 * The elements include Dialog, Email, Password,  PasswordConfirm, Submit,
 * Message, ExtLink and authStyle. Import by surrounding desired elements in
 * brace brackets, removing the unnecessary elements.
 */
import React from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { useHistory } from "react-router";

/**
 * Provides a container for form elements or other HTML elements to center them
 * on the screen.
 *
 * @param {Object} props Element properties to be passed to the div
 * @returns              A container flex element styled in a centred box
 */
export function Dialog(props) {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        {props.children}
      </div>
    </Container>
  );
}

/**
 * Provides an email field for user input.
 *
 * @param {Object} props.reference A reference object created using the useRef
 *                                 hook
 * @returns                        An email user input field
 */
export function Email({ reference, ...properties }) {
  if (!reference) {
    throw Error("Reference required.");
  }
  return (
    <Form.Group id="email">
      <Form.Label>Email</Form.Label>
      <Form.Control type="email" ref={reference} {...properties} />
    </Form.Group>
  );
}

/**
 * Provides a password field for user input.
 *
 * @param {Object} props.reference A reference object created using the useRef
 *                                 hook
 * @returns                        A password user input field
 */
export function Password({ reference, ...properties }) {
  if (!reference) {
    throw Error("Reference required.");
  }
  return (
    <Form.Group id="password">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" ref={reference} {...properties} />
    </Form.Group>
  );
}

/**
 * Provides a password conformation field for user input.
 *
 * @param {Object} props.reference A reference object created using the useRef
 *                                 hook
 * @returns                        A password confirmation user input field
 */
export function PasswordConfirm({ reference, ...properties }) {
  if (!reference) {
    throw Error("Reference required.");
  }
  return (
    <Form.Group id="passwordConfirm">
      <Form.Label>Confirm Password</Form.Label>
      <Form.Control type="password" ref={reference} {...properties} />
    </Form.Group>
  );
}

/**
 * Provides a submit button for submitting the entire form.
 *
 * @param {string} props.children  The label for the button
 * @param {boolean} props.loading  An optional state which, if true, dictates
 *                                 that the button cannot be clicked
 * @returns                        A submit button
 */
export function Submit({ children, loading, ...properties }) {
  return (
    <>
      <div className="small-padding"></div>
      <Button
        {...properties}
        disabled={loading}
        className={authStyle.button}
        type="submit"
      >
        {children}
      </Button>
    </>
  );
}

/**
 * Provides a Bootstrap Alert to display a message or error. If the text is
 * passed in as a message, it will be displayed in a green success box. If the
 * text is passed in as an error, it will be displayed in a red error box.
 *
 * @param {string} props.message  The success message to be rendered, if any
 * @param {string} props.error    The error message to be rendered, if any
 * @returns                       An element which displays an error or success
 *                                message, or both, if any
 */
export function Message({ message, error }) {
  return (
    <>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
    </>
  );
}

/**
 * Provides a link which can redirect a user to a different page on the site. It
 * supports tab-enter accessibility functionality.
 *
 * @param {string} props.url      The path of the destination page
 * @param {string} props.children The text label of the link
 * @returns
 */
export function ExtLink({ url, children }) {
  const history = useHistory();
  return (
    <span
      tabIndex="0"
      className="dark-link"
      onClick={() => history.push(url)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          history.push(url);
        }
      }}
    >
      {children}
    </span>
  );
}

/**
 * An object that provides preset CSS class names to be used for styling
 * certain authentication components.
 */
export const authStyle = {
  title: "text-center mb-4",
  cardLink: "w-100 text-center mt-3",
  link: "w-100 text-center mt-2 dark-text",
  button: "w-100 custom-button",
};
