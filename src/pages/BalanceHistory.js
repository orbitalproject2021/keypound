import React, { useEffect, useState, useRef } from "react";
import Navigation from "../components/Navigation";
import { MonthTable } from "../components/MonthTable";
import { Content } from "../components/ContentCard";
import { useAuth } from "../contexts/AuthContext";
import {
  dateStringToDateObject,
  getDocs,
  monthTableTransactions,
} from "../backendUtils";
import { Button, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import search from "../icons/search.png";
import erase from "../icons/erase.png";
import { useHistory } from "react-router-dom";

export default function BalanceHistory() {
  const { currentUser } = useAuth();
  const [tableData, setTableData] = useState();
  const [predicate, setPredicate] = useState(() => (monthObj) => true);
  const [sortObj, setSortObj] = useState({
    sortBy: "date",
    compareFunc: (m1, m2) =>
      dateStringToDateObject(m2.date).getTime() -
      dateStringToDateObject(m1.date).getTime(),
    reverse: false,
  });
  const searchRef = useRef();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Category");
  const [operator, setOperator] = useState("Operator");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const startRef = useRef();
  const endRef = useRef();
  const history = useHistory();
  const [show, setShow] = useState(false);

  useEffect(() => {
    document.title = "Breakdown - Keypound";
    getDocs(currentUser).then((doc) => {
      if (doc.exists) {
        setTableData(doc.data().monthArr);
      }
    });
  }, [currentUser]);

  useEffect(() => {
    tableData &&
      window.innerWidth > 767 &&
      searchRef.current &&
      searchRef.current.focus();
  }, [tableData]);

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.value = query;
    }
    if (startRef.current) {
      startRef.current.value = start;
    }
    if (endRef.current) {
      endRef.current.value = end;
    }
  });

  const clickFunctions = {
    date: () =>
      sortObj.sortBy === "date"
        ? setSortObj({ ...sortObj, reverse: !sortObj.reverse })
        : setSortObj({
            sortBy: "date",
            compareFunc: (m1, m2) =>
              dateStringToDateObject(m2.date).getTime() -
              dateStringToDateObject(m1.date).getTime(),
            reverse: false,
          }),

    moneyIn: () =>
      sortObj.sortBy === "moneyIn"
        ? setSortObj({ ...sortObj, reverse: !sortObj.reverse })
        : setSortObj({
            sortBy: "moneyIn",
            compareFunc: (m1, m2) => m2.pieData[5].value - m1.pieData[5].value,
            reverse: false,
          }),
    moneyOut: () =>
      sortObj.sortBy === "moneyOut"
        ? setSortObj({ ...sortObj, reverse: !sortObj.reverse })
        : setSortObj({
            sortBy: "moneyOut",
            compareFunc: (m1, m2) => m2.pieData[4].value - m1.pieData[4].value,
            reverse: false,
          }),
    netChange: () =>
      sortObj.sortBy === "netChange"
        ? setSortObj({ ...sortObj, reverse: !sortObj.reverse })
        : setSortObj({
            sortBy: "netChange",
            compareFunc: (m1, m2) =>
              m2.pieData[5].value -
              m2.pieData[4].value -
              (m1.pieData[5].value - m1.pieData[4].value),
            reverse: false,
          }),
    balance: () =>
      sortObj.sortBy === "balance"
        ? setSortObj({ ...sortObj, reverse: !sortObj.reverse })
        : setSortObj({
            sortBy: "balance",
            compareFunc: (m1, m2) => m2.balance - m1.balance,
            reverse: false,
          }),
  };

  const table = () => (
    <MonthTable
      monthArr={monthTableTransactions(
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
    const handleClose = () => {
      setShow(false);
    };
    const handleShow = () => {
      setShow(true);
    };

    const MobileSearchFilter = () => (
      <div className="mobile-only">
        <Button className="custom-button" onClick={handleShow}>
          Filter options...
        </Button>
        <div className="small-padding"></div>
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header>
            <Modal.Title>Search and filter</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {searchBox}
            <p className="breakdown-search-label">Filter: </p>
            <div className="flex-start">
              {categoryDropdown}
              {category !== "Category" && operatorDropdown}
            </div>
            {operator !== "Operator" && userInput()}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => {
                handleSubmit();
                handleClose();
              }}
              className="custom-button-green breakdown-submit-button"
            >
              <img src={search} alt="" className="breakdown-search-icon" />
            </Button>
            <Button
              onClick={() => {
                handleReset();
                handleClose();
              }}
              className="custom-button-red breakdown-submit-button"
            >
              <img src={erase} alt="" className="breakdown-search-icon" />
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
    const categoryItem = (category) => (
      <Dropdown.Item
        className="dropdown-item"
        onClick={() => {
          setPredicate(() => (monthObj) => true);
          setCategory(category);
          setOperator("Operator");
        }}
      >
        {category}
      </Dropdown.Item>
    );
    const categoryDropdown = (
      <DropdownButton id="breakdown-dropdown-button" title={category}>
        {categoryItem("Date")}
        {categoryItem("Money In")}
        {categoryItem("Money Out")}
        {categoryItem("Net Change")}
        {categoryItem("Balance")}
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
        {operatorItem("is more than", [
          "Money In",
          "Money Out",
          "Balance",
          "Net Change",
        ])}
        {operatorItem("is less than", [
          "Money In",
          "Money Out",
          "Balance",
          "Net Change",
        ])}
        {operatorItem("is between", [
          "Money In",
          "Money Out",
          "Balance",
          "Net Change",
        ])}
      </DropdownButton>
    );

    function userInput() {
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
            onChange={() => setStart(startRef.current.value)}
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
                onChange={() => setEnd(endRef.current.value)}
              />
            </>
          )}
        </>
      );

      return input;
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
            () => (monthObj) =>
              dateStringToDateObject(monthObj.date).getTime() >=
              new Date(start).getTime()
          );
        } else if (operator === "before") {
          setPredicate(
            () => (monthObj) =>
              dateStringToDateObject(monthObj.date).getTime() <=
              new Date(start).getTime()
          );
        } else if (operator === "between") {
          setPredicate(
            () => (monthObj) =>
              dateStringToDateObject(monthObj.date).getTime() >=
                new Date(start).getTime() &&
              dateStringToDateObject(monthObj.date).getTime() <= new Date(end)
          );
        }
      }
      // Money In / Money Out / Balance / Net Change
      else if (
        ["Money In", "Money Out", "Balance", "Net Change"].includes(category)
      ) {
        const value = (monthObj) =>
          category === "Money In"
            ? monthObj.pieData[5].value
            : category === "Money Out"
            ? monthObj.pieData[4].value
            : category === "Balance"
            ? monthObj.balance
            : monthObj.pieData[5].value - monthObj.pieData[4].value;

        if (operator === "is more than") {
          setPredicate(
            () => (monthObj) => Math.abs(value(monthObj)) > start * 100
          );
        } else if (operator === "is less than") {
          setPredicate(
            () => (monthObj) => Math.abs(value(monthObj)) < start * 100
          );
        } else if (operator === "is between") {
          setPredicate(
            () => (monthObj) =>
              Math.abs(value(monthObj)) >= start * 100 &&
              Math.abs(value(monthObj)) <= end * 100
          );
        }
      }
    };

    const handleReset = () => {
      setQuery("");
      setCategory("Category");
      setOperator("Operator");
      setPredicate(() => (monthObj) => true);
      if (searchRef.current) {
        searchRef.current.value = "";
      }
    };

    return (
      <>
        <div className="breakdown-search-div desktop-only">
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
        {MobileSearchFilter()}
      </>
    );
  }

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
          <p className="content-text">
            Select an entry to see an overview for that month.
          </p>
          {SearchAndFilter()}
          {table()}
        </Content>
      )}
    </>
  );
}
