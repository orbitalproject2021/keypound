import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { Content } from "../components/ContentCard";
import Navigation from "../components/Navigation";
import { useAuth } from "../contexts/AuthContext";
import { DashboardPie } from "../components/DashboardCharts";
import {
  formatCents,
  getFirstTimeOfMonth,
  getLastTimeOfMonth,
  tableTransactions,
} from "../backendUtils";
import { useHistory, useLocation } from "react-router-dom";
import { Table } from "../components/Table";
import back from "../icons/back.png";

function MonthView() {
  const history = useHistory();
  const { monthArr, monthObj, id, pieData } = useLocation().state;
  const [error] = useState("");
  const { currentUser } = useAuth();

  const [tableData, setTableData] = useState();

  useEffect(() => {
    document.title = `${monthObj.date} - Keypound`;
    console.log(monthObj);
    setTableData(monthArr);
  }, [monthObj, monthArr]);

  const charts = () => (
    <>
      <div>
        <h4 className="body-title">
          <div className="flex-start">
            <img
              className="month-view-back link"
              src={back}
              alt=""
              onClick={() => history.goBack()}
            />
            <span>{`${monthObj.date}`}</span>
          </div>
        </h4>
      </div>
      <div className="dashboard-combined-charts">
        <div className="desktop-only">{balanceText}</div>
        <div className="dashboard-pie-div desktop-only">
          <DashboardPie data={pieData.slice(0, 4)} />
        </div>
        <div className="dashboard-pie-div desktop-only">
          <DashboardPie data={pieData.slice(4)} />
        </div>
        <div className="mobile-only">{balanceText}</div>
        <h4 className="body-title mobile-only"></h4>
        <div className="dashboard-pie-div mobile-only">
          <DashboardPie data={pieData.slice(0, 4)} variant="mobile" />
        </div>
        <div className="dashboard-pie-div mobile-only">
          <DashboardPie data={pieData.slice(4)} variant="mobile" />
        </div>
      </div>
    </>
  );

  const balanceText = (
    <>
      <p className="month-view-text-big">{`In ${
        monthObj.date
      }, your balance was ${formatCents(monthObj.balance)}.`}</p>
      <p className="month-view-text">{`You spent ${formatCents(
        monthObj.pieData[4].value
      )}.`}</p>
      <p className="month-view-text">{`Your income was ${formatCents(
        monthObj.pieData[5].value
      )}.`}</p>
    </>
  );

  const recentTransactions = () =>
    tableData && (
      <>
        <h4 className="body-title">{`${monthObj.date} transactions`}</h4>
        <Table
          transactionArr={tableTransactions(
            tableData,
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
        {charts()}
        <div className="large-padding"></div>
        {recentTransactions()}
      </Content>
    </>
  );
}

export default MonthView;
