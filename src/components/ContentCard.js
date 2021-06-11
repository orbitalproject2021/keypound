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
 * @returns               A CSS grid component which contains Content tags.
 */
export function ContentCard({ children }) {
    return (
        <div className="body-container">
            <div className="body-margin"></div>
            <div className="wrapper">{children}</div>
            <div className="body-margin"></div>
        </div>
    );
}

/**
 * A box in which main contents of a page are to be rendered. There are several
 * properties supported to customise the box.
 *
 * @param props.title   The string to be shown in the title rectangle
 * @param props.area    An array that describes the placement of the box in the
 *                      grid, i.e. [startCol, endCol, startRow, endRow]. Note
 *                      that each box should take up an even number of rows as
 *                      alternate rows are thinner and used to contain the title
 *                      bar. E.g. [1, 2, 1, 3] for a small box; [1, 3, 1, 3] for
 *                      a larger one.
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
