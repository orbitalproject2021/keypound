import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getDocs } from "../backendUtils";
import Content from "../components/ContentCard";
import { MonthTable } from "../components/MonthTable";
import Navigation from "../components/Navigation";
import { useAuth } from "../contexts/AuthContext";

export default function BalanceHistory() {
  const { currentUser } = useAuth();
  const [tableData, setTableData] = useState();
  const history = useHistory();

  useEffect(() => {
    document.title = "Breakdown - Keypound";
    getDocs(currentUser).then((doc) => {
      if (doc.exists) {
        const monthArr = doc.data().monthArr.map((monthObj) => {
          return { ...monthObj, monthArr: doc.data().monthArr };
        });
        setTableData(monthArr);
      }
    });
  }, [currentUser]);

  const table = () => <MonthTable monthArr={tableData} />;

  return (
    <>
      <Navigation active="Breakdown" />
      {tableData && (
        <Content title="Breakdown" minHeight={350}>
          <span
            className="body-title-unselected"
            onClick={() => history.push("/breakdown")}
          >
            Transaction History
          </span>

          <span className="body-title">Balance History</span>
          <p className="content-text">Select an entry to edit it.</p>
          {table()}
        </Content>
      )}
    </>
  );
}
