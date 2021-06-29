import React from "react";
import { useHistory } from "react-router-dom";
import "./Table.css";

export function TableRow({ transactionObj }) {
    const {
        date,
        description,
        type,
        value,
        id,
        expenseId,
        monthObj,
        monthArr,
    } = transactionObj;
    const COLORS = ["#777777", "#666666"];
    const history = useHistory();
    return (
        <div
            className="tableRow"
            style={{ backgroundColor: COLORS[expenseId % 2] }}
            onClick={() => {
                history.push("/update-entry", {
                    monthArr,
                    monthObj,
                    id,
                    transactionObj,
                    date: date.toDate().toISOString().split("T")[0],
                });
            }}
        >
            <div className="overflow-container">
                <p className="tableRowDetails hide-when-tiny">
                    {date.toDate().toISOString().split("T")[0]}
                </p>
                <p className="tableRowDetails">{description}</p>
                <p className="tableRowDetails hide-when-narrow">{type}</p>
                <p className="tableRowDetails right-align">
                    {`${value > 0 ? "+" : "-"}$${Math.abs(value / 100)
                        .toFixed(2)
                        .toString()
                        .replace("/B(?=(d{3})+(?!d))/g", " ")}`}
                </p>
            </div>
        </div>
    );
}

export function TableHeader() {
    return (
        <>
            <div
                className="tableRow"
                style={{ backgroundColor: "#f8a66c", color: "#4d3321" }}
            >
                <div className="overflow-container">
                    <p className="tableHeaderDetails hide-when-tiny">Date</p>
                    <p className="tableHeaderDetails">Description</p>
                    <p className="tableHeaderDetails hide-when-narrow">Type</p>
                    <p className="tableHeaderDetails right-align">Amount</p>
                </div>
            </div>
        </>
    );
}

export function Table({ monthArr, limit = 25 }) {
    const transactionArr = [];
    let expenseId = 0;
    const reversedMonthArr = [...monthArr].reverse();
    for (const monthObj of reversedMonthArr) {
        const reversedMonthObjTransactions = [
            ...monthObj.transactions,
        ].reverse();
        for (const transaction of reversedMonthObjTransactions) {
            transactionArr.push({
                ...transaction, // date, description, type, value
                monthObj,
                monthArr,
                expenseId,
            });
            expenseId++;
            if (transactionArr.length >= limit) {
                break;
            }
        }
        if (transactionArr.length >= limit) {
            break;
        }
    }
    const componentArr = transactionArr.map((transactionObj) => (
        <TableRow
            transactionObj={transactionObj}
            key={transactionObj.expenseId}
        />
    ));
    return (
        <>
            <TableHeader />
            {componentArr}
        </>
    );
}
