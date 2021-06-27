import React from "react";
import "./Table.css";

export function TableRow({ expenseObj }) {
    const { date, description, type, value } = expenseObj;
    return (
        <div className="tableRow">
            <div className="tableRowLeft">
                <p className="tableRowDetails">
                    {date.toDate().toISOString().split("T")[0]}
                </p>
                <p className="tableRowDetails hide-when-narrow">
                    {(description + " ".repeat(30)).slice(0, 30)}
                </p>
                <p className="tableRowDetails hide-when-narrow">
                    {(type + " ".repeat(11)).slice(0, 11)}
                </p>
            </div>
            <p className="tableRowDetails">
                {`$${(value / 100)
                    .toFixed(2)
                    .toString()
                    .replace("/B(?=(d{3})+(?!d))/g", " ")}`}
            </p>
        </div>
    );
}

export function TableHeader() {
    return <></>;
}

export function Table() {
    return <></>;
}
