import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import {
    PieChart,
    Pie,
    Cell,
    XAxis,
    Sector,
    Bar,
    BarChart,
    Tooltip,
    YAxis,
    ResponsiveContainer,
} from "recharts";

export function DashboardPie({ data, variant }) {
    const COLORS = ["--ac-red", "--ac-green", "--em2"].map((id) =>
        getComputedStyle(document.documentElement).getPropertyValue(id)
    );

    const history = useHistory();
    const [activeIndex, setActiveIndex] = useState(0);

    const renderActiveShape = (props) => {
        // const RADIAN = Math.PI / 180;
        const {
            cx,
            cy,
            innerRadius,
            outerRadius,
            startAngle,
            endAngle,
            fill,
            payload,
            value,
            // midAngle,
        } = props;
        // const sin = Math.sin(-RADIAN * midAngle);
        // const cos = Math.cos(-RADIAN * midAngle);
        // const mx = cx + (outerRadius + 30) * cos;
        // const my = cy + (outerRadius + 30) * sin;
        // const sx = cx + (outerRadius + 10) * cos;
        // const sy = cy + (outerRadius + 10) * sin;
        // const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        // const ey = my;
        // const textAnchor = cos >= 0 ? "start" : "end";

        return (
            <g>
                <text
                    x={cx}
                    y={cy}
                    dy={-3}
                    textAnchor="middle"
                    fill={fill}
                    style={{ fontSize: "1em", fontWeight: 300 }}
                >
                    {payload.name}
                </text>
                <text
                    x={cx}
                    y={cy}
                    dy={19}
                    textAnchor="middle"
                    fill={fill}
                    style={{ fontSize: "1em", fontWeight: 300 }}
                >
                    {`$${(value / 100).toFixed(2)}`}
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
            </g>
        );
    };
    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    if (
        data.length === 0 ||
        (data[0].value === 0 && data[1].value === 0 && data[2].value === 0)
    ) {
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
        <ResponsiveContainer width={"99%"} height={300}>
            <PieChart height={300} width={400}>
                <Pie
                    isAnimationActive={false}
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={"40%"}
                    outerRadius={"55%"}
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

export function DashboardBar({ data, variant }) {
    const COLORS = ["--tm1"].map((id) =>
        getComputedStyle(document.documentElement).getPropertyValue(id)
    );

    const [truncatedData, setTruncatedData] = useState([]);
    // eslint-disable-next-line
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    });

    useEffect(() => {
        function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth,
            });
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    });

    useEffect(() => {
        const numOfBars = Math.round((window.innerWidth - 48) / 52) - 1;
        setTruncatedData(data.slice(-numOfBars));
    }, [dimensions, data]);

    return (
        <ResponsiveContainer width={"99%"} height={150}>
            <BarChart data={truncatedData}>
                <XAxis
                    reversed={true}
                    dataKey="date"
                    stroke="#aaaaaa"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                        fontWeight: 300,
                        fontSize: variant === "desktop" ? 14 : 12,
                    }}
                    interval={0}
                />
                <YAxis
                    domain={[
                        (dataMin) => (dataMin > 0 ? 0.9 : 1.1) * dataMin,
                        (dataMax) => dataMax,
                    ]}
                    hide={true}
                />
                <Tooltip cursor={false} content={<CustomTooltip />} />
                <Bar
                    dataKey="value"
                    fill={COLORS[0]}
                    isAnimationActive={false}
                    maxBarSize={60}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
        return (
            <div className="custom-tooltip">
                <p className="tooltip-label">{label}</p>
                <p className="tooltip-label">{`$${
                    payload && (payload[0].value / 100).toFixed(2)
                }`}</p>
            </div>
        );
    }

    return null;
};

// TODO
// export function ExpenseTable({data}) {

// }

// function TableItem({data}) {
//     return (
//         <div className="dashboard-table-item">

//         </div>
//     )
// }
