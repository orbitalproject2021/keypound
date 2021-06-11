/**
 * Contains various utility functions for fetching, parsing or manipulating
 * backend data. Divided by page.
 */

/* DASHBOARD */
export function monthlyBreakdown(firestoreData, monthsAgo = 0) {
    const firstOfMonthSeconds = Math.round(
        new Date(
            new Date().getFullYear(),
            new Date().getMonth() - monthsAgo,
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
        .filter((obj) => obj.date.seconds >= firstOfMonthSeconds)
        .reduce(reducer, [
            { name: "Needs", value: 0 },
            { name: "Wants", value: 0 },
            { name: "Unexpected", value: 0 },
        ]);

    if (data[0].value === 0 && data[1].value === 0 && data[2].value === 0) {
        return "none";
    } else {
        data[3] = {
            name: "Total",
            value: data[0].value + data[1].value + data[2].value,
        };
        return data;
    }
}

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
            expenses: monthlyBreakdown(firestoreData, i),
        });
    }
    return output;
}
