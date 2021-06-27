import React from "react";
import "./Table.css";

export function TableRow({ expenseObj, id }) {
    const { date, description, type, value } = expenseObj;
    const COLORS = ["#777777", "#666666"];
    return (
        <div className="tableRow" style={{ backgroundColor: COLORS[id % 2] }}>
            <p className="tableRowDetails hide-when-tiny">
                {date.toDate().toISOString().split("T")[0]}
            </p>
            <p className="tableRowDetails">{description}</p>
            <p className="tableRowDetails hide-when-narrow">{type}</p>
            <div></div>
            <p className="tableRowDetails right-align">
                {`${value > 0 && "+"}$${(value / 100)
                    .toFixed(2)
                    .toString()
                    .replace("/B(?=(d{3})+(?!d))/g", " ")}`}
            </p>
        </div>
    );
}

export function TableHeader() {
    return (
        <>
            <div className="tableRow" style={{ backgroundColor: "#ffb886" }}>
                <p className="tableRowDetails hide-when-tiny">Date</p>
                <p className="tableRowDetails">Description</p>
                <p className="tableRowDetails hide-when-narrow">Type</p>
                <div></div>
                <p className="tableRowDetails right-align">Amount</p>
            </div>
        </>
    );
}

export function Table({ array }) {
    return (
        <>
            <TableHeader />
        </>
    );
}
