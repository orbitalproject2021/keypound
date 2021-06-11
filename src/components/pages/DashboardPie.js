import React from "react";
import { useHistory } from "react-router";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function DashboardPie({ data }) {
    const history = useHistory();
    const COLORS = ["--ac-red", "--ac-green", "--em2"].map((id) =>
        getComputedStyle(document.documentElement).getPropertyValue(id)
    );
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index,
        name,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 2;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percent > 0.1) {
            return (
                <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                >
                    {name}
                </text>
            );
        }
    };
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
                    label={renderCustomizedLabel}
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
