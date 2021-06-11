import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function DashboardPie() {
    const DUMMYDATA = [
        { name: "Needs", value: 5000 },
        { name: "Wants", value: 4000 },
        { name: "Unexpected", value: 1000 },
    ];

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
    };
    return (
        <ResponsiveContainer width="95%" height={250}>
            <PieChart>
                <Pie
                    data={DUMMYDATA}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    label={renderCustomizedLabel}
                    labelLine={false}
                    stroke="none"
                >
                    {DUMMYDATA.map((entry, index) => (
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
