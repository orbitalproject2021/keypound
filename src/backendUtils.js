/**
 * Contains various utility functions for fetching, parsing or manipulating
 * backend data. Divided by page.
 */

import { db } from "./firebase";

// * DASHBOARD

/**
 * Returns an array of objects. Each object has a name, which is either Needs,
 * Wants or Unexpected, and a value which is the sum of all expenses of each
 * category for that particular month.
 *
 * @param {*} firestoreData The document object to be retrieved from Firestore
 * @param {*} monthsAgo     The number of months to go back from the current
 *                          month. Default is 0, which is the current month
 * @returns                 An array of objects
 */
export function dashboardPieData(firestoreData, monthsAgo = 0) {
    const thisMonthTransactions =
        firestoreData.monthArr[firestoreData.monthArr.length - 1 - monthsAgo]
            .transactions;

    function reducer(accumulator, current) {
        // Note that expenses are negative in value
        switch (current.type) {
            case "Need":
                accumulator[0].value -= current.value;
                break;
            case "Want":
                accumulator[1].value -= current.value;
                break;
            case "Unexpected":
                accumulator[2].value -= current.value;
                break;
            default:
                throw new Error("Invalid expense type");
        }
        return accumulator;
    }
    const data = thisMonthTransactions.reduce(reducer, [
        { name: "Needs", value: 0 },
        { name: "Wants", value: 0 },
        { name: "Unexpected", value: 0 },
        { name: "Total", value: 0 },
    ]);
    data[3].value = data[0].value + data[1].value + data[2].value;
    return data;
}

/**
 * Depracated.
 * Returns an array of objects of the following form:
 * {id: %d, month: %s, year: %d, expenses: Array(4)}, e.g.
 * {id: 12, month: "Jun", year: 21, expenses: Array(4)} where expenses is an
 * array of objects which contains expenditure on needs, wants, unexpected and
 * total spending for that month.
 *
 * @param {*} firestoreData The document object to be retrieved from Firestore
 * @returns                 An array of objects
 */
export function getMonthlyExpenseArr(firestoreData) {
    const MONTHS = {
        0: "Jan",
        1: "Feb",
        2: "Mar",
        3: "Apr",
        4: "May",
        5: "Jun",
        6: "Jul",
        7: "Aug",
        8: "Sep",
        9: "Oct",
        10: "Nov",
        11: "Dec",
    };
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear() % 2000;

    const output = [];

    for (let i = 12; i > 0; i--) {
        output.push({
            id: i,
            month: MONTHS[(i + currentMonth) % 12],
            year: i + currentMonth >= 12 ? currentYear : currentYear - 1,
            expenses: dashboardPieData(firestoreData, 12 - i),
        });
    }
    return output;
}

export function dashboardBarData(firestoreData) {
    const monthlyBalance = firestoreData.monthArr.map((obj) => {
        return {
            id: obj.id,
            value: obj.balance,
            date: obj.date,
        };
    });
    return monthlyBalance.reverse();
}

// * ADD EXPENSE / TRANSACTION

export function dateToDateString(dateObj) {
    // TODO: implement
    return "Jun '21";
}

export function monthsSinceDateString(str) {
    // TODO: implement
    return 0;
}

export function updateBalance(currentUser, delta, monthsAgo = 0) {
    const isBetween = (num, start, end) => num >= start && num <= end;
    var docRef = db.collection("users").doc(currentUser.uid);
    docRef.get().then((doc) => {
        let monthArr = doc.data().monthArr;
        const endIndex = monthArr.length - 1;
        const startIndex = endIndex - monthsAgo;
        monthArr = monthArr.map((obj) =>
            isBetween(obj.id, startIndex, endIndex)
                ? { ...obj, balance: obj.balance + delta }
                : obj
        );
        console.log(monthArr);
        docRef.update({
            monthArr: monthArr,
        });
    });
}
