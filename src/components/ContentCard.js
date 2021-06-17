/**
 * This is a component used to generate the main content boxes on the various
 * pages. The usage is as follows:
 *
 * <ContentCard>
 *      <Content props={{...}}>
 *          ...
 *      </Content>
 * </ContentCard>
 *
 * Using this component allows the page contents to be rendered in a uniform
 * box which supports various settings like title, area, placement and colour.
 */

import React from "react";

/**
 * Wrapper for a Content component. There should only be one of these per page.
 * Use multiple Content components if multiple content dialogs are desired.
 *
 * @param props.children  The child of the ContentCard, which should be
 *                        enclosed in <Content> tags.
 * @returns               A CSS flex component which contains Content tags.
 */
export function ContentCard({ children }) {
    return (
        <div className="body-container">
            <div className="wrapper">{children}</div>
        </div>
    );
}

/**
 * A box in which main contents of a page are to be rendered. There are several
 * properties supported to customise the box.
 *
 * @param props.title   The string to be shown in the title rectangle
 * @param props.fg      A string representing the text colour of the body
 * @param props.bg      A string representing the background colour of the body
 * @param props.topfg   A string representing the text colour of the title
 * @param props.topbg   A string representing the background colour of the title
 * @param props.border  A string representing the colour of the border.
 * @param props.display A string representing the css display prop, e.g. flex
 * @returns             A component to contain the main body of things to be
 *                      rendered
 */
export function Content({
    children,
    title,
    area,
    fg,
    bg,
    topfg,
    topbg,
    border,
    display,
    ...properties
}) {
    return (
        <div className={"title-window"}>
            <div
                className={"content-title"}
                style={{
                    backgroundColor: topbg,
                    color: topfg,
                    borderBottom: "1px solid " + border || "white",
                }}
            >
                {title}
            </div>
            <div
                className="content"
                style={{
                    backgroundColor: bg,
                    color: fg,
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
