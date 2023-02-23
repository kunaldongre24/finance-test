//Kunal Dongre

import React, { Component } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
  Cell,
  ResponsiveContainer,
} from "recharts";

const alp = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

const renderCustomizedLabel = (props) => {
  const { x, y, width, height, value } = props;

  const fireOffset = value.toString().length < 5;
  const offset = fireOffset ? -40 : 5;
  return (
    <text
      x={x + width - offset}
      y={y + height - 5}
      fill={fireOffset ? "#285A64" : "#fff"}
      textAnchor="end"
    >
      {value}
    </text>
  );
};

export default class Chart extends Component {
  constructor(props) {
    super();
    const { options, optCount, correctOption } = props;
    const arr = [];
    for (var i = 0; i < options.length; i++) {
      const amount = optCount[options[i].id] ? optCount[options[i].id] : 0;
      arr.push({
        list: alp[i],
        amount: amount,
        amountLabel: `${(amount / 4) * 100}%`,
        isCorrect: options[i].id === correctOption,
      });
    }
    this.state = {
      data: arr,
    };
  }
  render() {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={this.state.data} layout="vertical">
          <XAxis
            type="number"
            orientation="top"
            stroke="#285A64"
            style={{ display: "none" }}
          />
          <YAxis
            type="category"
            dataKey="list"
            axisLine={false}
            dx={-10}
            tickLine={false}
            style={{ fill: "#285A64" }}
          />
          <Bar
            dataKey="amount"
            fill="#285A64"
            barSize={{ height: 30 }}
            isAnimationActive={false}
          >
            {this.state.data.map((x, index) => (
              <Cell
                key={`cell-${index}`}
                fill={x.isCorrect ? "#54CBA9" : "#D9DEE7"}
              />
            ))}
            <LabelList
              dataKey="amountLabel"
              content={renderCustomizedLabel}
              position="insideRight"
              style={{ fill: "white" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
