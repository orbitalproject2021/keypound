import React from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";

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

export function Submit({ children, loading, ...properties }) {
    return (
        <>
            <div style={{ padding: "10pt" }}></div>
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

export function Message({ message, error }) {
    return (
        <>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
        </>
    );
}

export const authStyle = {
    title: "text-center mb-4",
    cardLink: "w-100 text-center mt-3",
    link: "w-100 text-center mt-2 dark-text",
    button: "w-100 custom-button",
};
