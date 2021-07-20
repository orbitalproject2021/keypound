import React, { useEffect, useState, useRef } from "react";
import Navigation from "../components/Navigation";
import { Table } from "../components/Table";
import { Content } from "../components/ContentCard";
import "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { getDocs, tableTransactions } from "../backendUtils";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import search from "../icons/search.png";
import erase from "../icons/erase.png";
import { useHistory } from "react-router-dom";

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
  const [operator, setOperator] = useState("Operator");
  const [type, setType] = useState("Select type");
  const startRef = useRef();
  const endRef = useRef();
  const history = useHistory();

  useEffect(() => {
    document.title = "Breakdown - Keypound";
    getDocs(currentUser).then((doc) => {
      if (doc.exists) {
        setTableData(doc.data().monthArr);
      }
    });
  }, [currentUser]);

  useEffect(() => {
    tableData && searchRef.current.focus();
  }, [tableData]);

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
          setPredicate(() => (transaction) => true);
          setCategory(category);
          setOperator("Operator");
          setType("Select type");
        }}
      >
        {category}
      </Dropdown.Item>
    );
    const categoryDropdown = (
      <DropdownButton id="breakdown-dropdown-button" title={category}>
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
      <DropdownButton id="breakdown-dropdown-button" title={operator}>
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

    function userInput() {
      const dropdownItem = (item) => (
        <Dropdown.Item className="dropdown-item" onClick={() => setType(item)}>
          {item}
        </Dropdown.Item>
      );
      const dropdown = (
        <DropdownButton id="breakdown-dropdown-button" title={type}>
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
            className="breakdown-input"
            type={
              ["Description", "Tag"].includes(category)
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
                className="breakdown-input"
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

    const searchBox = (
      <>
        <span className="breakdown-search-label">Search: </span>
        <input
          className="breakdown-input"
          type="text"
          ref={searchRef}
          onChange={() => {
            const query = searchRef.current.value.toLowerCase();
            setQuery(query);
          }}
        />
      </>
    );

    const handleSubmit = () => {
      // Date
      if (category === "Date") {
        if (operator === "after") {
          setPredicate(
            () => (transaction) =>
              transaction.date.seconds * 1000 >=
              new Date(startRef.current.value).getTime()
          );
        } else if (operator === "before") {
          setPredicate(
            () => (transaction) =>
              transaction.date.seconds * 1000 <=
              new Date(startRef.current.value).getTime()
          );
        } else if (operator === "between") {
          setPredicate(
            () => (transaction) =>
              transaction.date.seconds * 1000 >=
                new Date(startRef.current.value).getTime() &&
              transaction.date.seconds * 1000 <= new Date(endRef.current.value)
          );
        }
      }
      // Description / Tag
      else if (category === "Description" || category === "Tag") {
        if (operator === "contains") {
          setPredicate(
            () => (transaction) =>
              transaction[category.toLowerCase()]
                .toLowerCase()
                .includes(startRef.current.value.toLowerCase())
          );
        } else if (operator === "starts with") {
          setPredicate(
            () => (transaction) =>
              transaction[category.toLowerCase()]
                .toLowerCase()
                .startsWith(startRef.current.value.toLowerCase())
          );
        } else if (operator === "ends with") {
          setPredicate(
            () => (transaction) =>
              transaction[category.toLowerCase()]
                .toLowerCase()
                .endsWith(startRef.current.value.toLowerCase())
          );
        }
      }
      // Type
      else if (category === "Type") {
        if (operator === "is") {
          setPredicate(() => (transaction) => transaction.type === type);
        } else if (operator === "is not") {
          setPredicate(() => (transaction) => transaction.type !== type);
        }
      }
      // Amount
      else if (category === "Amount") {
        if (operator === "is more than") {
          setPredicate(
            () => (transaction) =>
              Math.abs(transaction.value) >= startRef.current.value * 100
          );
        } else if (operator === "is less than") {
          setPredicate(
            () => (transaction) =>
              Math.abs(transaction.value) <= startRef.current.value * 100
          );
        } else if (operator === "is between") {
          setPredicate(
            () => (transaction) =>
              Math.abs(transaction.value) >= startRef.current.value * 100 &&
              Math.abs(transaction.value) <= endRef.current.value * 100
          );
        }
      }
    };

    const handleReset = () => {
      setQuery("");
      setCategory("Category");
      setOperator("Operator");
      setType("Select type");
      setPredicate(() => (transaction) => true);
      searchRef.current.value = "";
    };

    return (
      <div className="breakdown-search-div">
        {searchBox}
        <span className="breakdown-search-label">Filter: </span>
        {categoryDropdown}
        {category !== "Category" && operatorDropdown}
        {operator !== "Operator" && userInput()}

        <Button
          onClick={handleSubmit}
          className="custom-button-green breakdown-submit-button"
        >
          <img src={search} alt="" className="breakdown-search-icon" />
        </Button>
        <Button
          onClick={handleReset}
          className="custom-button-red breakdown-submit-button"
        >
          <img src={erase} alt="" className="breakdown-search-icon" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Navigation active="Breakdown" />

      {tableData && (
        <Content title="Breakdown" minHeight={350}>
          <span className="body-title">Transaction History</span>
          <span
            className="body-title-unselected"
            onClick={() => history.push("/breakdown-balance")}
          >
            Balance History
          </span>

          <p className="content-text">Select an entry to edit or delete it.</p>
          {SearchAndFilter()}
          {table()}
        </Content>
      )}
    </>
  );
}

export default Breakdown;
