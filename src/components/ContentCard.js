import React from "react";

export function ContentCard({ children }) {
    return (
        <div className="body-container">
            <div className="body-margin"></div>
            <div className="wrapper">{children}</div>
            <div className="body-margin"></div>
        </div>
    );
}

export function Content({
    children,
    title,
    area,
    fg,
    bg,
    topbg,
    topfg,
    border,
    display,
    ...properties
}) {
    // [1, 2, 1, 3]
    return (
        <div
            className={"title-window"}
            style={{
                gridArea: `${area[0]}/${area[2]}/${area[3]}/${area[1]}`,
            }}
        >
            <div
                className={"content-title"}
                style={{
                    gridArea: `${area[0]}/${area[2]}/${area[0] + 1}/${area[1]}`,
                    backgroundColor: topbg || "2d455d",
                    color: topfg || "#ececec",
                    borderBottom: "1px solid " + border || "white",
                }}
            >
                {title}
            </div>
            <div
                className="content"
                style={{
                    backgroundColor: bg || "#4b4b4b",
                    color: fg || "white",
                    gridArea: `${area[0] + 1}/${area[2]}/${area[3]}/${area[1]}`,
                    display: display || "block",
                    ...properties,
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default ContentCard;
