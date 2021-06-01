import React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import home from "../icons/home.png";
import account from "../icons/account.png";
import expense from "../icons/expense.png";
import settings from "../icons/settings.png";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import NavItem from "./NavItem";

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
                    <NavItem active={active} image={home} url="/">
                        home
                    </NavItem>
                    <NavItem active={active} url="/advisor">
                        advisor
                    </NavItem>
                    <NavItem active={active} url="/breakdown">
                        breakdown
                    </NavItem>
                    <NavItem active={active} url="/goals">
                        goals
                    </NavItem>

                    <NavItem active={active} url="/credit">
                        credit
                    </NavItem>
                    <NavItem active={active} url="/loans">
                        loans
                    </NavItem>
                    <NavItem active={active} url="/reminders">
                        reminders
                    </NavItem>
                    <NavItem active={active} image={expense} url="/add-expense">
                        add expense
                    </NavItem>
                    <NavItem active={active} image={settings} url="/settings">
                        settings
                    </NavItem>
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
