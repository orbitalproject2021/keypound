import React from "react";
import home from "../icons/home.png";
import settings from "../icons/settings.png";
import account from "../icons/account.png";
import expense from "../icons/expense.png";
import { Link, useHistory } from "react-router-dom";
import "./NavigationBar.css";

function NavigationBar({ active }) {
    const history = useHistory();
    return (
        <div className={"navBar"}>
            <img
                className={"navIcon" + (active === "home" ? " active" : "")}
                src={home}
                alt=""
                onClick={() => history.push("/")}
            />
            <p
                className={"navItem" + (active === "advisor" ? " active" : "")}
                onClick={() => history.push("/advisor")}
            >
                advisor
            </p>
            <p
                className={
                    "navItem" + (active === "breakdown" ? " active" : "")
                }
                onClick={() => history.push("/breakdown")}
            >
                breakdown
            </p>
            <p
                className={"navItem" + (active === "goals" ? " active" : "")}
                onClick={() => history.push("/goals")}
            >
                goals
            </p>
            <p
                className={"navItem" + (active === "credit" ? " active" : "")}
                onClick={() => history.push("/credit")}
            >
                credit
            </p>
            <p
                className={"navItem" + (active === "loans" ? " active" : "")}
                onClick={() => history.push("/loans")}
            >
                loans
            </p>
            <p
                className={
                    "navItem" + (active === "reminders" ? " active" : "")
                }
                onClick={() => history.push("/reminders")}
            >
                reminders
            </p>
            <img
                className={"navIcon" + (active === "settings" ? " active" : "")}
                src={settings}
                onClick={() => {}}
                alt=""
            />
            <div className={"dropdown"}>
                <img
                    className={
                        "navIcon" + (active === "account" ? " active" : "")
                    }
                    onClick={() => {}}
                    src={account}
                    alt=""
                />
                <div className={"dropdownContent"}>
                    <p
                        className={"menuOption"}
                        onClick={() => history.push("/change-email")}
                    >
                        Change Email
                    </p>
                    <p
                        className={"menuOption"}
                        onClick={() => history.push("/change-password")}
                    >
                        Change Password
                    </p>
                </div>
            </div>
            <img
                className={"navIcon" + (active === "expense" ? " active" : "")}
                onClick={() => history.push("expense")}
                src={expense}
                alt=""
            />
        </div>
    );
}

export default NavigationBar;
