import React from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import home from "../icons/home.png";
import account from "../icons/account.png";
import expense from "../icons/expense.png";
import settings from "../icons/settings.png";
import { useAuth } from "../contexts/AuthContext";
import NavItem from "./NavItem";
import DropItem, { DropMenu } from "./DropItem";
import { useHistory } from "react-router";

/**
 * A component which allows the main navigation bar to be rendered.
 *
 * @param props.active The string corresponding to the current active page
 * @returns            A navigation bar. If the active prop is provided,
 *                     there will be a highlight indicating the active page.
 */
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
            <span
                className="logo"
                tabIndex="0"
                onClick={() => history.push("/")}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        history.push("/");
                    }
                }}
            >
                Spendee
            </span>
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
                    <NavItem
                        active={active}
                        image={expense}
                        url="/add-transaction"
                    >
                        add expense
                    </NavItem>
                    <NavItem active={active} image={settings} url="/settings">
                        settings
                    </NavItem>
                    <DropMenu img={account} title="account">
                        <div id="userEmail">
                            {currentUser && currentUser.email}
                        </div>

                        <DropItem url="/change-email">Change Email</DropItem>
                        <DropItem url="/change-password">
                            Change Password
                        </DropItem>
                        <NavDropdown.Divider />
                        <DropItem click={() => handleLogout()}>
                            Log Out
                        </DropItem>
                    </DropMenu>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Navigation;
