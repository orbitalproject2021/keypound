import React from "react";
import { useHistory } from "react-router";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function DashboardPie({ data }) {
    const COLORS = ["--ac-red", "--ac-green", "--em2"].map((id) =>
        getComputedStyle(document.documentElement).getPropertyValue(id)
    );
    const history = useHistory();

    if (data === "none") {
        return (
            <p className="content-text">
                No expenses this month. Click{" "}
                <span
                    className={"dark-link"}
                    onClick={() => history.push("/add-expense")}
                >
                    here
                </span>{" "}
                to add expenses and get insight on your spendings.
            </p>
        );
    }
    return (
        <ResponsiveContainer width="95%" height={250}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={1}
                    labelLine={false}
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}

export default DashboardPie;
