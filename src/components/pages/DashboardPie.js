import React, { useState } from "react";
import { useHistory } from "react-router";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";

function DashboardPie({ data, total }) {
    const COLORS = ["--ac-red", "--ac-green", "--em2"].map((id) =>
        getComputedStyle(document.documentElement).getPropertyValue(id)
    );
    const history = useHistory();
    const [activeIndex, setActiveIndex] = useState(0);

    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const {
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            startAngle,
            endAngle,
            fill,
            payload,
            value,
        } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? "start" : "end";

        return (
            <g>
                <text
                    x={cx}
                    y={cy}
                    dy={8}
                    textAnchor="middle"
                    fill={fill}
                    style={{ fontSize: "1.2em", fontWeight: 300 }}
                >
                    {payload.name}
                </text>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path
                    d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
                    stroke={fill}
                    fill="none"
                />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                <text
                    x={ex + (cos >= 0 ? 1 : -1) * 12}
                    y={ey}
                    dy={6}
                    textAnchor={textAnchor}
                    fill={fill}
                    style={{ fontSize: "1.2em", fontWeight: "300" }}
                >
                    {(value / 100).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                    })}
                </text>
            </g>
        );
    };
    const onPieEnter = (_, index) => {
        setActiveIndex(index);
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
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    isAnimationActive={false}
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={1}
                    labelLine={false}
                    stroke="none"
                    onMouseEnter={onPieEnter}
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
