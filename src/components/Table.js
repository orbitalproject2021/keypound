import React from "react";
import { useHistory } from "react-router-dom";
import up from "../icons/up.png";
import down from "../icons/down.png";

export function TableRow({ transactionObj }) {
  const {
    date,
    description,
    type,
    value,
    id,
    tag,
    expenseId,
    monthObj,
    monthArr,
  } = transactionObj;
  const COLORS = ["#777777", "#666666"];
  const history = useHistory();
  return (
    <div
      className="table-row"
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
      <div className="table-overflow-container">
        <p className="table-row-details table-hide-when-tiny">
          {date.toDate().toISOString().split("T")[0]}
        </p>
        <p className="table-row-details">{description}</p>
        <p className="table-row-details table-hide-when-narrow">{tag}</p>
        <p className="table-row-details table-hide-when-narrow">{type}</p>
        <p className="table-row-details table-right-align">
          {`${value > 0 ? "+" : "-"}$${Math.abs(value / 100)
            .toFixed(2)
            .toString()
            .replace("/B(?=(d{3})+(?!d))/g", " ")}`}
        </p>
      </div>
    </div>
  );
}

export function TableHeader({ functions, sortBy, reverse }) {
  function upDownArrows(active) {
    return (
      <>
        <img
          className="table-arrow"
          src={up}
          alt=""
          style={{
            display: sortBy === active && reverse ? "block" : "none",
          }}
        />
        <img
          className="table-arrow"
          src={down}
          alt=""
          style={{
            display:
              sortBy === active && reverse
                ? "none"
                : sortBy === active
                ? "block"
                : "none",
          }}
        />
      </>
    );
  }
  return (
    <>
      <div className="table-row table-header">
        <div className="table-overflow-container table-header">
          <p
            className="tableHeaderDetails table-hide-when-tiny"
            onClick={functions.date}
          >
            <span>Date</span>
            {upDownArrows("date")}
          </p>
          <p className="tableHeaderDetails" onClick={functions.description}>
            <span>Description</span>
            {upDownArrows("description")}
          </p>
          <p
            className="tableHeaderDetails table-hide-when-narrow"
            onClick={functions.tag}
          >
            <span>Tag</span>
            {upDownArrows("tag")}
          </p>
          <p
            className="tableHeaderDetails table-hide-when-narrow"
            onClick={functions.type}
          >
            <span>Type</span>
            {upDownArrows("type")}
          </p>
          <p
            className="tableHeaderDetails table-right-align"
            onClick={functions.amount}
          >
            <span>Amount</span>
            {upDownArrows("amount")}
          </p>
        </div>
      </div>
    </>
  );
}

const defaults = {
  date: () => {},
  description: () => {},
  tag: () => {},
  type: () => {},
  amount: () => {},
};

export function Table({
  transactionArr,
  functions = defaults,
  sortBy,
  reverse,
}) {
  const componentArr = transactionArr.map((transactionObj) => (
    <TableRow transactionObj={transactionObj} key={transactionObj.expenseId} />
  ));
  return (
    <>
      <TableHeader functions={functions} sortBy={sortBy} reverse={reverse} />
      {componentArr}
    </>
  );
}
