import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { formatCents, debug } from "../backendUtils";

export function MonthTableRow({ monthObj }) {
  // monthObj augmented with pointer to monthArr and pieData
  const { id, monthArr, pieData } = monthObj;
  const COLORS = ["#777777", "#666666"];
  const history = useHistory();

  useEffect(() => {
    console.log(pieData);
  });

  return (
    <div
      className="table-row"
      style={{ backgroundColor: COLORS[id % 2] }}
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

export function MonthTableHeader() {
  return (
    <>
      <div className="table-row table-header">
        <div className="month-table-overflow-container table-header">
          <p className="tableHeaderDetails">Date</p>
          <p className="tableHeaderDetails table-hide-when-narrow">Money In</p>
          <p className="tableHeaderDetails table-hide-when-narrow">Money Out</p>
          <p className="tableHeaderDetails table-right-align">Balance</p>
        </div>
      </div>
    </>
  );
}

export function MonthTable({ monthArr }) {
  const componentArr = monthArr.map((monthObj) => (
    <MonthTableRow monthObj={monthObj} key={monthObj.id} />
  ));
  return (
    <>
      <MonthTableHeader />
      {componentArr}
    </>
  );
}
