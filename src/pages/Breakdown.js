import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { Table } from "../components/Table";
import { Content } from "../components/ContentCard";
import "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { getDocs, tableTransactions } from "../backendUtils";

function Breakdown() {
  const { currentUser } = useAuth();
  const [tableData, setTableData] = useState();
  const [predicate, setPredicate] = useState(() => (transaction) => true);
  const [sortObj, setSortObj] = useState({
    sortBy: "date",
    compareFunc: (t1, t2) => t2.date.seconds - t1.date.seconds,
    reverse: false,
  });

  useEffect(() => {
    document.title = "Breakdown - Keypound";
    getDocs(currentUser).then((doc) => {
      if (doc.exists) {
        setTableData(doc.data().monthArr);
      }
    });
  }, [currentUser]);

  const clickFunctions = {
    date: () =>
      sortObj.sortBy === "date"
        ? setSortObj({ ...sortObj, reverse: !sortObj.reverse })
        : setSortObj({
            sortBy: "date",
            compareFunc: (t1, t2) => t2.date.seconds - t1.date.seconds,
            reverse: false,
          }),
    description: () =>
      sortObj.sortBy === "description"
        ? setSortObj({ ...sortObj, reverse: !sortObj.reverse })
        : setSortObj({
            sortBy: "description",
            compareFunc: (t1, t2) => (t2.description < t1.description ? 1 : -1),
            reverse: false,
          }),
    tag: () =>
      sortObj.sortBy === "tag"
        ? setSortObj({ ...sortObj, reverse: !sortObj.reverse })
        : setSortObj({
            sortBy: "tag",
            compareFunc: (t1, t2) => (t2.tag < t1.tag ? 1 : -1),
            reverse: false,
          }),
    type: () =>
      sortObj.sortBy === "type"
        ? setSortObj({ ...sortObj, reverse: !sortObj.reverse })
        : setSortObj({
            sortBy: "type",
            compareFunc: (t1, t2) => (t2.type < t1.type ? 1 : -1),
            reverse: false,
          }),
    amount: () =>
      sortObj.sortBy === "amount"
        ? setSortObj({ ...sortObj, reverse: !sortObj.reverse })
        : setSortObj({
            sortBy: "amount",
            compareFunc: (t1, t2) => t2.value - t1.value,
            reverse: false,
          }),
  };

  const table = () => (
    <Table
      transactionArr={tableTransactions(
        tableData,
        -1,
        predicate,
        sortObj.compareFunc,
        sortObj.reverse
      )}
      functions={clickFunctions}
      sortBy={sortObj.sortBy}
      reverse={sortObj.reverse}
    />
  );

  return (
    <>
      <Navigation active="Breakdown" />

      {tableData && (
        <Content title="Breakdown">
          <h4 className="body-title">All Transactions</h4>
          <p className="content-text">Select an entry to edit or delete it.</p>
          {table()}
        </Content>
      )}
    </>
  );
}

export default Breakdown;
