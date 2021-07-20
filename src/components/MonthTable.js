import React from "react";
import { useHistory } from "react-router-dom";
import { formatCents } from "../backendUtils";
import up from "../icons/up.png";
import down from "../icons/down.png";

export function MonthTableRow({ monthObj }) {
  // monthObj augmented with pointer to monthArr and pieData
  const { id, monthArr, pieData, tableId } = monthObj;
  const COLORS = ["#777777", "#666666"];
  const history = useHistory();

  return (
    <div
      className="table-row"
      style={{ backgroundColor: COLORS[tableId % 2] }}
      onClick={() => {
        history.push("/month-view", {
          id,
        });
      }}
    >
      <div className="month-table-overflow-container">
        <p className="table-row-details">{monthObj.date}</p>
        <p className="table-row-details table-hide-when-narrow">
          {
            formatCents(pieData[5].value) // money in
          }
        </p>
        <p className="table-row-details table-hide-when-narrow">
          {
            formatCents(pieData[4].value) // money out
          }
        </p>
        <p className="table-row-details table-right-align">
          {formatCents(monthObj.balance)}
        </p>
      </div>
    </div>
  );
}

export function MonthTableHeader({ functions, sortBy, reverse }) {
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
        <div className="month-table-overflow-container table-header">
          <p className="tableHeaderDetails" onClick={functions.date}>
            <span>Date</span>
            {upDownArrows("date")}
          </p>
          <p
            className="tableHeaderDetails table-hide-when-narrow"
            onClick={functions.moneyIn}
          >
            <span>Money In</span>
            {upDownArrows("moneyIn")}
          </p>
          <p
            className="tableHeaderDetails table-hide-when-narrow"
            onClick={functions.moneyOut}
          >
            <span>Money Out</span>
            {upDownArrows("moneyOut")}
          </p>
          <p
            className="tableHeaderDetails table-right-align"
            onClick={functions.balance}
          >
            <span>Balance</span>
            {upDownArrows("balance")}
          </p>
        </div>
      </div>
    </>
  );
}

export function MonthTable({ monthArr, functions, sortBy, reverse }) {
  const componentArr = monthArr.map((monthObj) => (
    <MonthTableRow monthObj={monthObj} key={monthObj.id} />
  ));
  return (
    <>
      <MonthTableHeader
        functions={functions}
        sortBy={sortBy}
        reverse={reverse}
      />
      {componentArr}
    </>
  );
}
