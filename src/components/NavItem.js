import React from "react";
import { useHistory } from "react-router";

export function NavItem({ url, image, active, children }) {
  const history = useHistory();
  return (
    <>
      <span
        role="button"
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            history.push(url);
          }
        }}
        tabIndex="0"
        onClick={() => history.push(url)}
        className={"nav-item" + (active === children ? " active" : "")}
      >
        {image ? <img className="nav-icon" src={image} alt="" /> : children}
        {image && <span className="mobile">{children}</span>}
      </span>
    </>
  );
}

export default NavItem;
