import React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import home from "../icons/home.png";
import account from "../icons/account.png";
import expense from "../icons/expense.png";
import settings from "../icons/settings.png";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

function Navigation({ active }) {
    const { currentUser, logout } = useAuth();
    const history = useHistory();

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
                <Nav id="width" className="m-auto appleBar">
                    <div onClick={() => history.push("/")}>
                        <span
                            className={
                                "navItem" + (active === "home" ? " active" : "")
                            }
                        >
                            <img className="navIcon" src={home} alt="" />
                            <span className="mobile">home</span>
                        </span>
                    </div>
                    <div onClick={() => history.push("/advisor")}>
                        <span
                            className={
                                "navItem" +
                                (active === "advisor" ? " active" : "")
                            }
                        >
                            advisor
                        </span>
                    </div>
                    <div onClick={() => history.push("/breakdown")}>
                        <span
                            className={
                                "navItem" +
                                (active === "breakdown" ? " active" : "")
                            }
                        >
                            breakdown
                        </span>
                    </div>
                    <div onClick={() => history.push("/goals")}>
                        <span
                            className={
                                "navItem" +
                                (active === "goals" ? " active" : "")
                            }
                        >
                            goals
                        </span>
                    </div>
                    <div onClick={() => history.push("/credit")}>
                        <span
                            className={
                                "navItem" +
                                (active === "credit" ? " active" : "")
                            }
                        >
                            credit
                        </span>
                    </div>
                    <div onClick={() => history.push("/loans")}>
                        <span
                            className={
                                "navItem" +
                                (active === "loans" ? " active" : "")
                            }
                        >
                            loans
                        </span>
                    </div>
                    <div onClick={() => history.push("/reminders")}>
                        <span
                            className={
                                "navItem" +
                                (active === "reminders" ? " active" : "")
                            }
                        >
                            reminders
                        </span>
                    </div>
                    <div onClick={() => history.push("/add-expense")}>
                        <span
                            className={
                                "navItem" +
                                (active === "expense" ? " active" : "")
                            }
                        >
                            <img className="navIcon" src={expense} alt="" />
                            <span className="mobile">add expense</span>
                        </span>
                    </div>
                    <div onClick={() => history.push("/settings")}>
                        <span
                            className={
                                "navItem" +
                                (active === "settings" ? " active" : "")
                            }
                        >
                            <img className="navIcon" src={settings} alt="" />
                            <span className="mobile">settings</span>
                        </span>
                    </div>
                    <NavDropdown
                        title={
                            <span className={"navItem"}>
                                <img
                                    className={"navIcon"}
                                    src={account}
                                    alt=""
                                />
                                <span className="mobile">account</span>
                            </span>
                        }
                        id="basic-nav-dropdown"
                    >
                        <div id="userEmail">
                            {currentUser && currentUser.email}
                        </div>

                        <div
                            className={"dropdownItem"}
                            onClick={() => history.push("/change-email")}
                        >
                            Change Email
                        </div>
                        <div
                            className={"dropdownItem"}
                            onClick={() => history.push("/change-password")}
                        >
                            Change Password
                        </div>
                        <NavDropdown.Divider />
                        <div className={"dropdownItem"} onClick={handleLogout}>
                            Log Out
                        </div>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Navigation;
