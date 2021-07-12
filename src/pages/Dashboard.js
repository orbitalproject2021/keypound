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
} from "../backendUtils";
import { useHistory } from "react-router-dom";
import { Table } from "../components/Table";

function Dashboard() {
  const [message] = useState("");
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

  return (
    <>
      <Navigation active="Home" />
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      <Content
        display="flex"
        flexWrap="wrap"
        flexDirection="column"
        title="home"
        justifyContent="center"
      >
        <div className="dashboard-combined-charts">
          {barchartData && piechartData && (
            <>
              <h4 className="body-title">Balance History</h4>
              <h4 className="body-title desktop-only">This Month</h4>
              <div className="dashboard-bar-div desktop-only">
                <DashboardBar data={barchartData} variant="desktop" />
              </div>
              <div className="dashboard-bar-div mobile-only">
                <DashboardBar data={barchartData} variant="mobile" />
              </div>
              <h4 className="body-title mobile-only">This Month</h4>
              <div className="dashboard-pie-div desktop-only">
                <DashboardPie data={piechartData.slice(0, 4)} />
                <DashboardPie data={piechartData.slice(4)} />
              </div>
              <div className="dashboard-pie-div mobile-only">
                <DashboardPie
                  data={piechartData.slice(0, 4)}
                  variant="mobile"
                />
                <DashboardPie data={piechartData.slice(4)} variant="mobile" />
              </div>
            </>
          )}
        </div>
        <div className="large-padding"></div>
        <h4 className="body-title">recent transactions</h4>
        {tableData && <Table monthArr={tableData} limit={5} />}
        <div className="dashboard-bottom-text">
          <p
            className="content-text link"
            onClick={() => history.push("/breakdown")}
          >
            View All Transactions
          </p>
        </div>
      </Content>
    </>
  );
}

export default Dashboard;
