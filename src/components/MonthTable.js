import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  centsToReadableDollars,
  dashboardPieData,
  monthsSinceDateString,
} from "../backendUtils";

export function MonthTableRow({ monthObj }) {
  // monthObj augmented with pointer to monthArr
  const { id, monthArr } = monthObj;
  const COLORS = ["#777777", "#666666"];
  const history = useHistory();
  const pieData = dashboardPieData(
    { monthArr },
    monthsSinceDateString(monthObj.date)
  );

  useEffect(() => {
    console.log(pieData);
  });

  return (
    <div
      className="table-row"
      style={{ backgroundColor: COLORS[id % 2] }}
      onClick={() => {
        history.push("/month-view", {
          monthArr,
          monthObj,
          id,
          pieData,
        });
      }}
    >
      <div className="month-table-overflow-container">
        <p className="table-row-details">{monthObj.date}</p>
        <p className="table-row-details table-hide-when-narrow">
          {centsToReadableDollars(pieData[5].value)}
        </p>
        <p className="table-row-details table-hide-when-narrow">
          {centsToReadableDollars(pieData[4].value)}
        </p>
        <p className="table-row-details table-right-align">
          {centsToReadableDollars(monthObj.balance)}
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
