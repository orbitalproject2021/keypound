import React from "react";
import { useHistory } from "react-router-dom";

export function TableRow({ transactionObj }) {
  const { date, description, type, value, id, expenseId, monthObj, monthArr } =
    transactionObj;
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

export function TableHeader() {
  return (
    <>
      <div className="table-row table-header">
        <div className="table-overflow-container table-header">
          <p className="tableHeaderDetails table-hide-when-tiny">Date</p>
          <p className="tableHeaderDetails">Description</p>
          <p className="tableHeaderDetails table-hide-when-narrow">Type</p>
          <p className="tableHeaderDetails table-right-align">Amount</p>
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
    const reversedMonthObjTransactions = [...monthObj.transactions].reverse();
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
    <TableRow transactionObj={transactionObj} key={transactionObj.expenseId} />
  ));
  return (
    <>
      <TableHeader />
      {componentArr}
    </>
  );
}
