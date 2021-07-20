import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { Content } from "../components/ContentCard";
import Navigation from "../components/Navigation";
import { useAuth } from "../contexts/AuthContext";
import { DashboardPie, DashboardBar } from "../components/DashboardCharts";
import {
  dashboardPieData,
  dashboardBarData,
  updateDatabase,
  getDocs,
  tableTransactions,
} from "../backendUtils";
import { useHistory } from "react-router-dom";
import { Table } from "../components/Table";

function Dashboard() {
  const [error] = useState("");
  const { currentUser } = useAuth();
  const [piechartData, setPiechartData] = useState([]);
  const [barchartData, setBarchartData] = useState([]);
  const history = useHistory();
  const [tableData, setTableData] = useState();

  useEffect(() => {
    document.title = "Dashboard - Keypound";

    // Reference to current user document from 'users' collection
    getDocs(currentUser)
      .then((doc) => {
        if (doc.exists) {
          updateDatabase(currentUser).then(() => {
            getDocs(currentUser).then((doc) => {
              if (doc.exists) {
                setTableData(doc.data().monthArr);
                setPiechartData(dashboardPieData(doc.data()));
                setBarchartData(dashboardBarData(doc.data()));
              }
            });
          });
        } else {
          // doc.data() will be undefined in this case
          setPiechartData([]);
          setBarchartData([]);
          history.push("/start");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }, [currentUser, history]);

  const charts = () =>
    barchartData &&
    piechartData && (
      <div className="dashboard-combined-charts">
        <div>
          <h4 className="body-title">Balance History</h4>
          <span
            className="content-text link"
            onClick={() => history.push("/breakdown-balance")}
          >
            View full balance history
          </span>
        </div>

        <h4 className="body-title desktop-only">This Month</h4>
        <div></div>
        <div className="dashboard-bar-div desktop-only">
          <DashboardBar
            data={barchartData}
            variant="desktop"
            monthArr={tableData}
          />
        </div>
        <div className="dashboard-pie-div desktop-only">
          <DashboardPie data={piechartData.slice(0, 4)} />
        </div>
        <div className="dashboard-pie-div desktop-only">
          <DashboardPie data={piechartData.slice(4)} />
        </div>
        <div className="dashboard-bar-div mobile-only">
          <DashboardBar
            data={barchartData}
            variant="mobile"
            monthArr={tableData}
          />
        </div>
        <h4 className="body-title mobile-only">This Month</h4>
        <div className="dashboard-pie-div mobile-only">
          <DashboardPie data={piechartData.slice(0, 4)} variant="mobile" />
        </div>
        <div className="dashboard-pie-div mobile-only">
          <DashboardPie data={piechartData.slice(4)} variant="mobile" />
        </div>
      </div>
    );

  const recentTransactions = () =>
    tableData && (
      <>
        <h4 className="body-title">Recent Transactions</h4>
        <Table transactionArr={tableTransactions(tableData, 5)} />
        <div className="dashboard-bottom-text">
          <p
            className="content-text link"
            onClick={() => history.push("/breakdown")}
          >
            View All Transactions
          </p>
        </div>
      </>
    );

  return (
    <>
      <Navigation active="Home" />
      {error && <Alert variant="danger">{error}</Alert>}
      <Content title="Home">
        {charts()}
        <div className="large-padding"></div>
        {recentTransactions()}
      </Content>
    </>
  );
}

export default Dashboard;
