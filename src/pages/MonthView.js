import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { Content } from "../components/ContentCard";
import Navigation from "../components/Navigation";
import { useAuth } from "../contexts/AuthContext";
import { DashboardPie } from "../components/DashboardCharts";
import {
  formatCents,
  getDocs,
  getFirstTimeOfMonth,
  getLastTimeOfMonth,
  tableTransactions,
  dashboardPieData,
} from "../backendUtils";
import { useHistory, useLocation } from "react-router-dom";
import { Table } from "../components/Table";
import back from "../icons/back.png";

function MonthView() {
  const history = useHistory();
  const { id } = useLocation().state;
  const [error] = useState("");
  const { currentUser } = useAuth();
  const [monthArr, setMonthArr] = useState();
  const [monthObj, setMonthObj] = useState({
    date: "",
    balance: 0,
  });
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    document.title = `${monthObj.date} - Keypound`;
  }, [monthObj]);

  useEffect(() => {
    getDocs(currentUser).then((docs) => {
      setMonthArr(docs.data().monthArr);
      setMonthObj(docs.data().monthArr[id]);
      const monthsAgo = docs.data().monthArr.length - 1 - id;
      setPieData(dashboardPieData(docs.data(), monthsAgo));
    });
  }, [currentUser, id]);

  const prevDate = () => (id > 0 ? monthArr[id - 1].date.slice(0, 3) : "");
  const nextDate = () =>
    id + 1 < monthArr.length ? monthArr[id + 1].date.slice(0, 3) : "";

  const charts = () => (
    <>
      <div>
        <div className="flex-start">
          <img
            className="month-view-back link"
            src={back}
            alt=""
            onClick={() => history.goBack()}
          />
          <span
            className="body-title-unselected"
            onClick={() => history.push("/month-view", { id: id - 1 })}
          >{`${prevDate()}`}</span>
          <span className="body-title">{`${monthObj.date.slice(0, 3)}`}</span>
          <span
            className="body-title-unselected"
            onClick={() => history.push("/month-view", { id: id + 1 })}
          >{`${nextDate()}`}</span>
        </div>
      </div>
      <div className="month-view-combined-charts">
        <div className="desktop-only">{balanceText()}</div>
        <div className="dashboard-pie-div desktop-only">
          <DashboardPie data={pieData.slice(0, 4)} />
        </div>
        <div className="dashboard-pie-div desktop-only">
          <DashboardPie data={pieData.slice(4)} />
        </div>
        <div className="mobile-only">{balanceText()}</div>
        <p className="body-title mobile-only"></p>
        <div className="mobile-combined-pies tiny-pies">
          <div className="dashboard-pie-div mobile-only">
            <DashboardPie data={pieData.slice(0, 4)} variant="mobile" />
          </div>
          <div className="dashboard-pie-div mobile-only">
            <DashboardPie data={pieData.slice(4)} variant="mobile" />
          </div>
        </div>
      </div>
    </>
  );

  const incOrDec = () => {
    const change = pieData[5].value - pieData[4].value;
    const changeStr = formatCents(change);
    if (change < 0) {
      return ["decreased", `decreased by ${changeStr}.`];
    } else if (change > 0) {
      return ["increased", `increased by ${changeStr}.`];
    } else {
      return ["same", `remained the same.`];
    }
  };

  const balanceText = () => (
    <>
      <p className="month-view-text-big">{`In ${
        monthObj.date
      }, your balance was ${formatCents(monthObj.balance)}.`}</p>
      <p className="month-view-text">{`You spent ${formatCents(
        pieData[4].value
      )}.`}</p>
      <p className="month-view-text">{`Your income was ${formatCents(
        pieData[5].value
      )}.`}</p>
      <p
        className="month-view-text"
        style={{
          color:
            incOrDec()[0] === "decreased"
              ? "#fea5ab"
              : incOrDec()[0] === "increased"
              ? "#98ddca"
              : "white",
        }}
      >{`Overall, your balance ${incOrDec()[1]}`}</p>
    </>
  );

  const recentTransactions = () =>
    monthArr && (
      <>
        <h4 className="body-title">{`${monthObj.date} transactions`}</h4>
        <Table
          transactionArr={tableTransactions(
            monthArr,
            -1,
            "",
            (transaction) =>
              transaction.date.seconds * 1000 >=
                getFirstTimeOfMonth(monthObj.date).getTime() &&
              transaction.date.seconds * 1000 <=
                getLastTimeOfMonth(monthObj.date).getTime()
          )}
        />
      </>
    );

  return (
    <>
      <Navigation active="Breakdown" />
      {error && <Alert variant="danger">{error}</Alert>}
      <Content title={`${monthObj.date} Overview`}>
        {pieData.length === 6 && charts()}
        <div className="large-padding"></div>
        {recentTransactions()}
      </Content>
    </>
  );
}

export default MonthView;
