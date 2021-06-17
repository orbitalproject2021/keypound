/**
 * Contains various utility functions for fetching, parsing or manipulating
 * backend data. Divided by page.
 */

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
export function monthlyBreakdown(firestoreData, monthsAgo = 0) {
    const firstOfMonthSeconds = Math.round(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth() - monthsAgo,
            1
        ).getTime() / 1000
    );
    const lastOfMonthSeconds = Math.round(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth() - monthsAgo + 1,
            1
        ).getTime() / 1000
    );
    function reducer(accumulator, current) {
        switch (current.type) {
            case "Need":
                accumulator[0].value += current.value;
                break;
            case "Want":
                accumulator[1].value += current.value;
                break;
            case "Unexpected":
                accumulator[2].value += current.value;
                break;
            default:
                throw new Error("Invalid expense type");
        }
        return accumulator;
    }
    const data = firestoreData.expenses
        .filter(
            (obj) =>
                obj.date.seconds >= firstOfMonthSeconds &&
                obj.date.seconds < lastOfMonthSeconds
        )
        .reduce(reducer, [
            { name: "Needs", value: 0 },
            { name: "Wants", value: 0 },
            { name: "Unexpected", value: 0 },
            { name: "Total", value: 0 },
        ]);
    data[3].value = data[0].value + data[1].value + data[2].value;
    return data;
}

/**
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
            expenses: monthlyBreakdown(firestoreData, 12 - i),
        });
    }
    return output;
}

export function dashboardBarData(firestoreData) {
    const monthlyExpense = getMonthlyExpenseArr(firestoreData).map((obj) => {
        return {
            id: obj.id,
            expense: obj.expenses[3].value,
            date: `${obj.month} '${obj.year}`,
        };
    });

    const output = [];
    const income = firestoreData.income;
    let balance = firestoreData.balance;
    for (let i = 0; i < monthlyExpense.length; i++) {
        output.push({ value: balance, date: monthlyExpense[i].date });
        balance += monthlyExpense[i].expense;
        balance -= income;
    }
    console.log(output);
    return output.reverse();
}
