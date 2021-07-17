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
} from "recharts";

export function DashboardPie({ data, variant = "desktop" }) {
  const COLORS = ["--ac-red", "--ac-green", "--em2", "--tm1"].map((id) =>
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
          className="dashboard-pie-label"
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy}
          dy={19}
          textAnchor="middle"
          fill={fill}
          className="dashboard-pie-label"
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

  function allValuesZero(arr) {
    for (const obj of arr) {
      if (obj.value !== 0) {
        return false;
      }
    }
    return true;
  }

  if (allValuesZero(data)) {
    if (data.length === 4) {
      // no need to show the same message twice
      return (
        <p className="content-text">
          No expenses this month. Click{" "}
          <span
            className={"dark-link"}
            onClick={() => history.push("/add-transaction")}
          >
            here
          </span>{" "}
          to add expenses and get insight on your spendings.
        </p>
      );
    } else {
      return <></>;
    }
  }
  return (
    <PieChart height={200} width={160}>
      <Pie
        isAnimationActive={false}
        activeIndex={activeIndex}
        activeShape={renderActiveShape}
        data={data}
        dataKey="value"
        nameKey="name"
        innerRadius={"60%"}
        outerRadius={"80%"}
        fill="#8884d8"
        paddingAngle={1}
        labelLine={false}
        stroke="none"
        onMouseEnter={onPieEnter}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
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
    const numOfBars = Math.min(
      6,
      Math.round((window.innerWidth - 48) / 52) - 1
    );
    setTruncatedData(data.slice(-numOfBars));
  }, [dimensions, data]);

  return (
    <BarChart width={400} height={150} data={truncatedData}>
      <XAxis
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
          (dataMax) => Math.max(1000, dataMax),
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
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div className="dashboard-custom-tooltip">
        <p className="dashboard-tooltip-label">{label}</p>
        <p className="dashboard-tooltip-label">{`$${
          payload &&
          (payload[0].value / 100)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, " ") // put spaces between groups of 3 digits
        }`}</p>
      </div>
    );
  }

  return null;
};
