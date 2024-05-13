import { red } from "@mui/material/colors";
import React, { PureComponent, useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceArea,
} from "recharts";
import DotForReference from "./DotForReference";
import LableForReference from "./LableForReference";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: "7px",
          padding: "5px",
          background: "#402769",
          color: "white",
          width: "76px",
          height: "30px",
          border: "none",
        }}
      >
        <div style={{ fontSize: "7px" }}>{`${label} Connectors`}</div>

        <div>{`${payload[0].value} days`}</div>
      </div>
    );
  }

  return null;
};

const LineChartGraph = ({ filterPeriod }) => {
  // const []
  const dummy = [
    {
      connectors: 1,
      uv: 4000,
      days: 2.4,
      amt: 2.4,
    },
    {
      connectors: 2,
      uv: 3000,
      days: 1.398,
      amt: 2.21,
    },
    {
      connectors: 3,
      uv: 2000,
      days: 9.8,
      amt: 2.29,
    },
    {
      connectors: 4,
      uv: 2780,
      days: 3.908,
      amt: 2.0,
    },
    {
      connectors: 5,
      uv: 1890,
      days: 4.8,
      amt: 2.181,
    },
    {
      connectors: 6,
      uv: 2390,
      days: 3.8,
      amt: 2.5,
    },
    {
      connectors: 7,
      uv: 3490,
      days: 4.3,
      amt: 2.1,
    },
    {
      connectors: 8,
      uv: 3490,
      days: 4.3,
      amt: 2.1,
    },
    {
      connectors: 9,
      uv: 3490,
      days: 4.3,
      amt: 2.1,
    },
    {
      connectors: 10,
      uv: 3490,
      days: 4.3,
      amt: 2.1,
    },
    {
      connectors: 11,
      uv: 3490,
      days: 2.0,
      amt: 2.1,
    },
    {
      connectors: 12,
      uv: 3490,
      days: 4.3,
      amt: 2.1,
    },
    {
      connectors: 13,
      uv: 3490,
      days: 4.3,
      amt: 2.1,
    },
    {
      connectors: 14,
      uv: 3490,
      days: 4.3,
      amt: 2.1,
    },
    {
      connectors: 15,
      uv: 3490,
      days: 4.5,
      amt: 2.1,
    },
    {
      connectors: 16,
      uv: 3490,
      days: 4.3,
      amt: 3.1,
    },
    {
      connectors: 17,
      uv: 3490,
      days: 4.5,
      amt: 2.1,
    },
    {
      connectors: 18,
      uv: 3490,
      days: 4.3,
      amt: 6.1,
    },
    {
      connectors: 19,
      uv: 3490,
      days: 8.0,
      amt: 2.1,
    },
    {
      connectors: 20,
      uv: 3490,
      days: 3.0,
      amt: 2.1,
    },
    {
      connectors: 21,
      uv: 3490,
      days: 19.0,
      amt: 2.1,
    },
    {
      connectors: 22,
      uv: 3490,
      days: 19.0,
      amt: 2.1,
    },
    {
      connectors: 23,
      uv: 3490,
      days: 19.0,
      amt: 2.1,
    },
    {
      connectors: 24,
      uv: 3490,
      days: 19.0,
      amt: 2.1,
    },
    {
      connectors: 25,
      uv: 3490,
      days: 18.0,
      amt: 2.1,
    },
    {
      connectors: 26,
      uv: 3490,
      days: 17.0,
      amt: 2.1,
    },
    {
      connectors: 27,
      uv: 3490,
      days: 15.0,
      amt: 2.1,
    },
    {
      connectors: 28,
      uv: 3490,
      days: 10.0,
      amt: 2.1,
    },
    {
      connectors: 29,
      uv: 3490,
      days: 13.0,
      amt: 2.1,
    },
    {
      connectors: 30,
      uv: 3490,
      days: 14.0,
      amt: 2.1,
    },
  ];
  const [data, setData] = useState(dummy);
  const monthData = [{}];
  const [value, setValue] = useState({
    x: dummy[0].connectors,
    y: dummy[0].days,
  });

  useEffect(() => {
    let initial = 0;
    let id = setInterval(() => {
      // console.log(initial);
      if (initial < filterPeriod) {
        //   console.log(initial, dummy[initial]);
        setValue({
          x: dummy[initial].connectors,
          y: dummy[initial].days,
        });
      } else {
        setValue({
          x: dummy[0].connectors,
          y: dummy[0].days,
        });
        initial = -1;
      }
      initial++;
      // return () => clearInterval(id);
    }, 1000);
  }, []);
  useEffect(() => {
    let updatedData = dummy.filter((item, i) => i < filterPeriod);
    setData([...updatedData]);
    // console.log(data, "updated");
  }, [filterPeriod]);

  return (
    <div>
      <LineChart
        width={600}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 50,
          left: 20,
          bottom: 5,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis
          minTickGap={1}
          domain={["dataMin", "dataMax - 10"]}
          tick={{ stroke: "#3D4A52" }}
          dataKey="connectors"
          startOffset={0}
          fontSize="10px"
          fontWeight={600}
          strokeWidth={0.5}
        />
        <YAxis
          minTickGap={1}
          unit="days"
          tick={{ stroke: "#3D4A52" }}
          allowDataOverflow={true}
          fontSize="10px"
          fontWeight={600}
          strokeWidth={0.5}
        />
        <Tooltip
          content={<CustomTooltip />}
          payload={data}
          position={{ y: 50 }}
          itemStyle={{ border: "none" }}
        />
        {/* <Legend /> */}
        {/* <ReferenceLine x="Page C" stroke="#D73193" label="Max PV PAGE" /> */}
        <ReferenceLine
          strokeDasharray="10 10"
          y={value.y}
          ifOverflow="extendDomain"
          label=""
          stroke="red"
        />
        <ReferenceLine
          x={value.x}
          // alwaysShow={true}
          ifOverflow="extendDomain"
          label=""
          stroke="#CFC1E4"
        />
        <ReferenceDot
          x={value.x}
          y={value.y}
          fill="#402769"
          stroke="#FFFFFF"
          strokeWidth="10px"
        />
        {/* <ReferenceArea x1={12} x2={16} y1={8} y2={10} stroke="#402769"   strokeOpacity={0.3}  /> */}
        <Line
          isAnimationActive={true}
          animationDuration={3000}
          onAnimationEnd={() => console.log("first")}
          strokeDashArray="4"
          animationBegin={100}
          animationEasing="ease-in-out"
          type="monotone"
          dataKey="days"
          stroke="#5AAAFA"
          strokeWidth={2}
          dot={true}
        />

        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
      </LineChart>
    </div>
  );
};

export default LineChartGraph;
