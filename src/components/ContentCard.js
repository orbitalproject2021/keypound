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

export function Content({ children, title, area, fg, bg, topbg, topfg }) {
    return (
        <div className={"title-window"}>
            <div
                className={"content-title"}
                style={{
                    gridArea: `${area[0] - 1}/${area[1]}/${area[0]}/${area[3]}`,
                    backgroundColor: topbg || "2d455d",
                    color: topfg || "#ececec",
                }}
            >
                {title}
            </div>
            <div
                className="content"
                style={{
                    backgroundColor: bg || "#4b4b4b",
                    color: fg || "white",
                    gridArea: `${area[0]}/${area[1]}/${area[2]}/${area[3]}`,
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default ContentCard;
