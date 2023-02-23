//Kunal Dongre
import React, { Component } from "react";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default class Example extends Component {
  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            dataKey="count"
            data={this.props.data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            isAnimationActive={false}
            fill="#8884d8"
            label
          >
            {this.props.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={this.props.colors[index % this.props.colors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
