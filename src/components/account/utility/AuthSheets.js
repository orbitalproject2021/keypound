import React from "react";

export function Dialog(props) {
    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
        >
            <div className="w-100" style={{ maxWidth: "400px" }}>
                {props.children}
            </div>
        </div>
    );
}

export function Email({ reference, ...properties }) {
    if (!reference) {
        throw Error("Reference required.");
    }
    return (
        <div>
            <label for="email">Email</label>
            <input
                type="email"
                id="email"
                ref={reference}
                {...properties}
            ></input>
        </div>
    );
}

export function Password({ reference, ...properties }) {
    if (!reference) {
        throw Error("Reference required.");
    }
    return (
        <div>
            <label for="password">Password</label>
            <input
                type="password"
                id="password"
                ref={reference}
                {...properties}
            ></input>
        </div>
    );
}

export function PasswordConfirm({ reference, ...properties }) {
    if (!reference) {
        throw Error("Reference required.");
    }
    return (
        <div>
            <label for="passwordConfirm">Password</label>
            <input
                type="password"
                id="passwordConfirm"
                ref={reference}
                {...properties}
            ></input>
        </div>
    );
}

export function Submit({ children, loading, ...properties }) {
    return (
        <>
            <div style={{ padding: "10pt" }}></div>
            <button
                {...properties}
                disabled={loading}
                className={authStyle.button}
                type="submit"
            >
                {children}
            </button>
        </>
    );
}

export function Message({ message, error }) {
    return (
        <>
            {message && <h2>{message}</h2>}
            {error && <h2>{error}</h2>}
        </>
    );
}

export const authStyle = {
    title: "text-center mb-4",
    cardLink: "w-100 text-center mt-3",
    link: "w-100 text-center mt-2",
    button: "w-100",
};
