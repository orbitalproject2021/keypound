import React from "react";
import { NavDropdown } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export function DropMenu({ img, title, children }) {
  return (
    <NavDropdown
      title={
        <span className={"nav-item drop"}>
          <img className={"nav-icon"} src={img} alt="" />
          <span /*className="mobile"*/>{title}</span>
        </span>
      }
      id="basic-nav-dropdown"
    >
      {children}
    </NavDropdown>
  );
}

export function DropItem({ url, children, click }) {
  const history = useHistory();
  return (
    <div
      role="button"
      className={"dropdown-item"}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          url ? history.push(url) : click();
        }
      }}
      tabIndex="0"
      onClick={url ? () => history.push(url) : click}
    >
      {children}
    </div>
  );
}

export default DropItem;
