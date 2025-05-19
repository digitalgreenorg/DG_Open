import React, { PureComponent } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import styles from "./datasets.module.css";
import LegendValue from "./LegendValue";

// const data = [
//   { name: "Crop data", value: 400 },
//   { name: "Land record", value: 300 },
//   { name: "Farmers data", value: 300 },
//   { name: "Pricing data", value: 200 },
//   { name: "Insurance", value: 400 },
//   { name: "Credit Assessment", value: 100 },
// ];

export default class PieChartMain extends PureComponent {
  //   static demoUrl = 'https://codesandbox.io/s/pie-chart-with-customized-label-dlhhj';

  render() {
    console.log(this.props);
    return (
      <div className={styles.datasetsChartBox}>
        <PieChart
          style={{
            // border: "1px solid green",
            display: "flex",
            justifyContent: "left",
          }}
          width={640}
          height={317}
        >
          <Pie
            data={this.props.dataForThePieChart}
            cx="40%"
            cy="50%"
            labelLine={false}
            // label={renderCustomizedLabel}
            outerRadius={135.5}
            fill="#8884d8"
            dataKey="value"
            animationEasing="ease-out"
            animationBegin={500}
            animationDuration={3000}
          >
            {this.props.dataForThePieChart.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={this.props.colors[index % this.props.colors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            itemStyle={{ color: "#3D4A52" }}
            // contentStyle={{border:"11px solid red"}}
          />
          <Legend
            //          payload={
            //   data.map(
            //     (item, index) => ({
            //       id: item.name,
            //       type: "square",
            //       value: `${Math.round((item.value/totalSum) * 100)}% ${item.name}`,
            //       color: COLORS[index % COLORS.length]
            //     })
            //   )
            // }
            content={
              <LegendValue
                data={this.props.dataForThePieChart}
                COLORS={this.props.colors}
              />
            }
            verticalAlign="middle"
            align="right"
            layout="vertical"
          />
        </PieChart>

        {/* <PieChartsSideMenu data={data} COLORS={COLORS} /> */}
      </div>
    );
  }
}
