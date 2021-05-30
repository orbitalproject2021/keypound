import React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import home from "../icons/home.png";
import account from "../icons/account.png";
import expense from "../icons/expense.png";
import settings from "../icons/settings.png";
import { useAuth } from "../contexts/AuthContext";

function Navigation({ active }) {
    const { currentUser, logout } = useAuth();

    async function handleLogout() {
        try {
            await logout();
            // setMessage("You have been logged out.");
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <Navbar bg="dark" expand="md" variant="dark">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="m-auto">
                    <Nav.Link href="/">
                        <span
                            className={
                                "navItem" + (active === "home" ? " active" : "")
                            }
                        >
                            <img className="navIcon" src={home} alt="" />
                        </span>
                    </Nav.Link>
                    <Nav.Link href="advisor">
                        <span
                            className={
                                "navItem" +
                                (active === "advisor" ? " active" : "")
                            }
                        >
                            advisor
                        </span>
                    </Nav.Link>
                    <Nav.Link href="breakdown">
                        <span
                            className={
                                "navItem" +
                                (active === "breakdown" ? " active" : "")
                            }
                        >
                            breakdown
                        </span>
                    </Nav.Link>
                    <Nav.Link href="goals">
                        <span
                            className={
                                "navItem" +
                                (active === "goals" ? " active" : "")
                            }
                        >
                            goals
                        </span>
                    </Nav.Link>
                    <Nav.Link href="credit">
                        <span
                            className={
                                "navItem" +
                                (active === "credit" ? " active" : "")
                            }
                        >
                            credit
                        </span>
                    </Nav.Link>
                    <Nav.Link href="loans">
                        <span
                            className={
                                "navItem" +
                                (active === "loans" ? " active" : "")
                            }
                        >
                            loans
                        </span>
                    </Nav.Link>
                    <Nav.Link href="reminders">
                        <span
                            className={
                                "navItem" +
                                (active === "reminders" ? " active" : "")
                            }
                        >
                            reminders
                        </span>
                    </Nav.Link>
                    <Nav.Link href="add-expense">
                        <span
                            className={
                                "navItem" +
                                (active === "expense" ? " active" : "")
                            }
                        >
                            <img className="navIcon" src={expense} alt="" />
                        </span>
                    </Nav.Link>
                    <Nav.Link href="settings">
                        <span
                            className={
                                "navItem" +
                                (active === "settings" ? " active" : "")
                            }
                        >
                            <img className="navIcon" src={settings} alt="" />
                        </span>
                    </Nav.Link>
                    <NavDropdown
                        title={
                            <span className={"navItem"}>
                                <img
                                    className={"navIcon"}
                                    src={account}
                                    alt=""
                                />
                            </span>
                        }
                        id="basic-nav-dropdown"
                    >
                        <div id="userEmail">
                            {currentUser && currentUser.email}
                        </div>

                        <NavDropdown.Item href="/change-email">
                            Change Email
                        </NavDropdown.Item>
                        <NavDropdown.Item href="/change-password">
                            Change Password
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={handleLogout}>
                            Log Out
                        </NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Navigation;
