import React, { useEffect, useState, useRef } from "react";
import Navigation from "../components/Navigation";
import { Table } from "../components/Table";
import { Content } from "../components/ContentCard";
import "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { getDocs, tableTransactions } from "../backendUtils";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";

function Breakdown() {
  const { currentUser } = useAuth();
  const [tableData, setTableData] = useState();
  const [predicate, setPredicate] = useState(() => (transaction) => true);
  const [sortObj, setSortObj] = useState({
    sortBy: "date",
    compareFunc: (t1, t2) => t2.date.seconds - t1.date.seconds,
    reverse: false,
  });
  const searchRef = useRef();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Category");
  const [operator, setOperator] = useState("Filter options");
  const [type, setType] = useState("Select type");
  const [end, setEnd] = useState();
  const startRef = useRef();
  const endRef = useRef();

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
            reverse: true,
          }),
    tag: () =>
      sortObj.sortBy === "tag"
        ? setSortObj({ ...sortObj, reverse: !sortObj.reverse })
        : setSortObj({
            sortBy: "tag",
            compareFunc: (t1, t2) => (t2.tag < t1.tag ? 1 : -1),
            reverse: true,
          }),
    type: () =>
      sortObj.sortBy === "type"
        ? setSortObj({ ...sortObj, reverse: !sortObj.reverse })
        : setSortObj({
            sortBy: "type",
            compareFunc: (t1, t2) => (t2.type < t1.type ? 1 : -1),
            reverse: true,
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
        query,
        predicate,
        sortObj.compareFunc,
        sortObj.reverse
      )}
      functions={clickFunctions}
      sortBy={sortObj.sortBy}
      reverse={sortObj.reverse}
    />
  );

  function SearchAndFilter() {
    const categoryItem = (category) => (
      <Dropdown.Item
        className="dropdown-item"
        onClick={() => {
          setCategory(category);
          setOperator("Operator");
          setType("Select type");
        }}
      >
        {category}
      </Dropdown.Item>
    );
    const categoryDropdown = (
      <DropdownButton className="breakdown-dropdown-button" title={category}>
        {categoryItem("Date")}
        {categoryItem("Description")}
        {categoryItem("Tag")}
        {categoryItem("Type")}
        {categoryItem("Amount")}
      </DropdownButton>
    );
    const operatorItem = (operator, categories) =>
      categories.includes(category) && (
        <Dropdown.Item
          className="dropdown-item"
          onClick={() => {
            setOperator(operator);
          }}
        >
          {operator}
        </Dropdown.Item>
      );
    const operatorDropdown = (
      <DropdownButton className="breakdown-dropdown-button" title={operator}>
        {operatorItem("before", ["Date"])}
        {operatorItem("after", ["Date"])}
        {operatorItem("between", ["Date"])}
        {operatorItem("contains", ["Description", "Tag"])}
        {operatorItem("starts with", ["Description", "Tag"])}
        {operatorItem("ends with", ["Description", "Tag"])}
        {operatorItem("is", ["Type"])}
        {operatorItem("is not", ["Type"])}
        {operatorItem("is more than", ["Amount"])}
        {operatorItem("is less than", ["Amount"])}
        {operatorItem("is between", ["Amount"])}
      </DropdownButton>
    );

    function input1() {
      const dropdownItem = (item) => (
        <Dropdown.Item className="dropdown-item" onClick={() => setType(item)}>
          {item}
        </Dropdown.Item>
      );
      const dropdown = (
        <DropdownButton className="breakdown-dropdown-button" title={type}>
          {dropdownItem("Need")}
          {dropdownItem("Want")}
          {dropdownItem("Unexpected")}
          {dropdownItem("Subscription")}
          {dropdownItem("Money In")}
        </DropdownButton>
      );
      const input = (
        <>
          <input
            type={
              ["Description, Tag"].includes(category)
                ? "text"
                : category === "Date"
                ? "date"
                : "number"
            }
            ref={startRef}
          />
          {["is between", "between"].includes(operator) && (
            <>
              <span className="breakdown-search-label">and</span>
              <input
                type={
                  ["Description, Tag"].includes(category)
                    ? "text"
                    : category === "Date"
                    ? "date"
                    : "number"
                }
                ref={endRef}
              />
            </>
          )}
        </>
      );

      if (category === "Type") {
        return dropdown;
      } else {
        return input;
      }
    }

    return (
      <div className="breakdown-search-div">
        <span className="breakdown-search-label">Search: </span>
        <input
          type="text"
          ref={searchRef}
          onChange={() => {
            const query = searchRef.current.value.toLowerCase();
            setQuery(query);
          }}
        />
        <span className="breakdown-search-label">Filter: </span>
        {categoryDropdown}
        {operatorDropdown}
        {input1()}

        <Button className="custom-button-green breakdown-submit-button">
          Submit
        </Button>
      </div>
    );
  }

  return (
    <>
      <Navigation active="Breakdown" />

      {tableData && (
        <Content title="Breakdown">
          <h4 className="body-title">All Transactions</h4>
          <p className="content-text">Select an entry to edit or delete it.</p>
          {SearchAndFilter()}
          {table()}
        </Content>
      )}
    </>
  );
}

export default Breakdown;
