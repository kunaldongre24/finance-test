//Kunal Dongre

import React, { PureComponent } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#54CBA9", "#D9DEE7"];

const RADIAN = Math.PI / 180;

export default class Example extends PureComponent {
  render() {
    return (
      <div style={{ width: 200, height: "100%", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h1>{this.props.title}</h1>
        </div>
        <ResponsiveContainer width={"100%"} height={220}>
          <PieChart width={400} height={220}>
            <Pie
              data={[
                { name: "Group A", value: this.props.g1 },
                { name: "Group B", value: this.props.g2 },
              ]}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={74}
              paddingAngle={0}
              fill="#D9DEE7"
              dataKey="value"
              blendStroke={"#D9DEE7"}
              isAnimationActive={true}
            >
              {[
                { name: "Group A", value: this.props.g1 },
                { name: "Group B", value: this.props.g2 },
              ].map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
