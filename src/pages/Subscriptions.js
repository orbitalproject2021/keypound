import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { formatCents, tableSubscriptions, getDocs } from "../backendUtils";
import Navigation from "../components/Navigation";
import up from "../icons/up.png";
import down from "../icons/down.png";
import search from "../icons/search.png";
import erase from "../icons/erase.png";
import { Button, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import Content from "../components/ContentCard";
import { useAuth } from "../contexts/AuthContext";
import { emptyRowDisplay } from "../components/Table";

export default function Subscriptions() {
  const { currentUser } = useAuth();
  const [monthObj, setMonthObj] = useState(); // contains most recent monthObj
  const [predicate, setPredicate] = useState(() => (subscription) => true);
  const searchRef = useRef();
  const [query, setQuery] = useState("");
  const startRef = useRef();
  const endRef = useRef();
  const history = useHistory();
  const [sortObj, setSortObj] = useState({
    sortBy: "id",
    compareFunc: (s1, s2) => s2.id - s1.id,
    reverse: true,
  });
  const [show, setShow] = useState(false);
  const clickFunctions = {
    id: () =>
      sortObj.sortBy === "id"
        ? setSortObj({ ...sortObj, reverse: !sortObj.reverse })
        : setSortObj({
            sortBy: "id",
            compareFunc: (s1, s2) => s2.id - s1.id,
            reverse: true,
          }),

    description: () =>
      sortObj.sortBy === "description"
        ? setSortObj({ ...sortObj, reverse: !sortObj.reverse })
        : setSortObj({
            sortBy: "description",
            compareFunc: (s1, s2) => (s1.description < s2.description ? 1 : -1),
            reverse: true,
          }),

    tag: () =>
      sortObj.sortBy === "tag"
        ? setSortObj({ ...sortObj, reverse: !sortObj.reverse })
        : setSortObj({
            sortBy: "tag",
            compareFunc: (s1, s2) => (s1.tag < s2.tag ? 1 : -1),
            reverse: true,
          }),
    value: () =>
      sortObj.sortBy === "value"
        ? setSortObj({ ...sortObj, reverse: !sortObj.reverse })
        : setSortObj({
            sortBy: "value",
            compareFunc: (s1, s2) => s1.value - s2.value, //TODO check order is correct
            reverse: false,
          }),
  };

  const table = () => (
    <SubscriptionTable
      subscriptionArr={tableSubscriptions(
        monthObj,
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
  const [category, setCategory] = useState("Category");
  const [operator, setOperator] = useState("Operator");

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.value = query;
    }
  });

  function SearchAndFilter() {
    const handleClose = () => {
      setShow(false);
    };
    const handleShow = () => {
      setPredicate(() => (subscription) => true);
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
          setPredicate(() => (subscription) => true);
          setCategory(category);
          setOperator("Operator");
        }}
      >
        {category}
      </Dropdown.Item>
    );
    const categoryDropdown = (
      <DropdownButton id="breakdown-dropdown-button" title={category}>
        {categoryItem("Description")}
        {categoryItem("Tag")}
        {categoryItem("Monthly Fee")}
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
        {operatorItem("contains", ["Description", "Tag"])}
        {operatorItem("starts with", ["Description", "Tag"])}
        {operatorItem("ends with", ["Description", "Tag"])}
        {operatorItem("is more than", ["Monthly Fee"])}
        {operatorItem("is less than", ["Monthly Fee"])}
        {operatorItem("is between", ["Monthly Fee"])}
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
      // Description / Tag
      if (category === "Description" || category === "Tag") {
        if (operator === "contains") {
          setPredicate(
            () => (subscription) =>
              subscription[category.toLowerCase()]
                .toLowerCase()
                .includes(startRef.current.value.toLowerCase())
          );
        } else if (operator === "starts with") {
          setPredicate(
            () => (subscription) =>
              subscription[category.toLowerCase()]
                .toLowerCase()
                .startsWith(startRef.current.value.toLowerCase())
          );
        } else if (operator === "ends with") {
          setPredicate(
            () => (subscription) =>
              subscription[category.toLowerCase()]
                .toLowerCase()
                .endsWith(startRef.current.value.toLowerCase())
          );
        }
      }
      // Monthly Fee
      else if (category === "Monthly Fee") {
        if (operator === "is more than") {
          setPredicate(
            () => (subscription) =>
              Math.abs(subscription.value) > startRef.current.value * 100
          );
        } else if (operator === "is less than") {
          setPredicate(
            () => (subscription) =>
              Math.abs(subscription.value) < startRef.current.value * 100
          );
        } else if (operator === "is between") {
          setPredicate(
            () => (subscription) =>
              Math.abs(subscription.value) >= startRef.current.value * 100 &&
              Math.abs(subscription.value) <= endRef.current.value * 100
          );
        }
      }
    };

    const handleReset = () => {
      setQuery("");
      setCategory("Category");
      setOperator("Operator");
      setPredicate(() => (subscription) => true);
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

  useEffect(() => {
    document.title = "Subscriptions - Keypound";
    getDocs(currentUser).then((doc) => {
      const monthArr = doc.data().monthArr;
      setMonthObj(monthArr[monthArr.length - 1]);
    });
  }, [currentUser]);

  useEffect(() => {
    monthObj &&
      window.innerWidth > 767 &&
      searchRef.current &&
      searchRef.current.focus();
  }, [monthObj]);

  return (
    <>
      <Navigation active="Subscriptions" />
      {monthObj && (
        <Content title="Subscriptions" minHeight={350}>
          <span className="body-title">Manage Subscriptions</span>

          <p className="content-text">
            Select a subscription to update it, or go{" "}
            <span
              className="dark-link"
              onClick={() =>
                history.push("/add-transaction", { subscribe: true })
              }
            >
              here
            </span>{" "}
            to add a new subscription.
          </p>
          {SearchAndFilter()}
          {table()}
        </Content>
      )}
    </>
  );
}

function SubscriptionTable({ subscriptionArr, functions, sortBy, reverse }) {
  const componentArr = subscriptionArr.map((subscriptionObj) => (
    <SubscriptionRow
      subscriptionObj={subscriptionObj}
      key={subscriptionObj.id}
    />
  ));

  return (
    <>
      <SubscriptionHeader
        functions={functions}
        sortBy={sortBy}
        reverse={reverse}
      />
      {subscriptionArr.length !== 0 ? componentArr : emptyRowDisplay}
    </>
  );
}

function SubscriptionRow({ subscriptionObj }) {
  const { description, id, tag, value, tableId } = subscriptionObj;
  const COLORS = ["#777777", "#666666"];
  const history = useHistory();
  return (
    <div
      className="table-row"
      style={{ backgroundColor: COLORS[tableId % 2] }}
      onClick={() => {
        history.push("/update-subscription", { id });
      }}
    >
      <div className="subscription-table-overflow-container">
        <p className="table-row-details table-hide-when-narrow">{id + 1}</p>
        <p className="table-row-details">{description}</p>
        <p className="table-row-details table-hide-when-narrow">{tag}</p>
        <p className="table-row-details table-right-align">
          {formatCents(value)}
        </p>
      </div>
    </div>
  );
}

export function SubscriptionHeader({ functions, sortBy, reverse }) {
  function upDownArrows(active) {
    return (
      <>
        <img
          className="table-arrow"
          src={up}
          alt=""
          style={{
            display: sortBy === active && reverse ? "block" : "none",
          }}
        />
        <img
          className="table-arrow"
          src={down}
          alt=""
          style={{
            display:
              sortBy === active && reverse
                ? "none"
                : sortBy === active
                ? "block"
                : "none",
          }}
        />
      </>
    );
  }
  return (
    <>
      <div className="table-row table-header">
        <div className="subscription-table-overflow-container table-header">
          <p
            className="tableHeaderDetails table-hide-when-narrow"
            onClick={functions.id}
          >
            <span>No.</span>
            {upDownArrows("id")}
          </p>
          <p className="tableHeaderDetails " onClick={functions.description}>
            <span>Description</span>
            {upDownArrows("description")}
          </p>
          <p
            className="tableHeaderDetails table-hide-when-narrow"
            onClick={functions.tag}
          >
            <span>Tag</span>
            {upDownArrows("tag")}
          </p>
          <p
            className="tableHeaderDetails table-right-align"
            onClick={functions.value}
          >
            <span>Monthly Fee</span>
            {upDownArrows("value")}
          </p>
        </div>
      </div>
    </>
  );
}
