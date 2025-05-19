import { useForkRef } from "@mui/material";
import React, { PureComponent, useEffect, useState } from "react";
import styles from "./datasetsCategory.module.css"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const BarChartComponent = ({ dataForThePieChart }) => {
  // const propsData = [
  //   {
  //     name: "Crop data",
  //     // uv: 4000,
  //     value: 2.2,
  //     amt: 2.4,
  //   },
  //   {
  //     name: "Land record",
  //     // uv: 3000,
  //     value: 2.2,
  //     amt: 2.21,
  //   },
  //   {
  //     name: "Farmer data",
  //     // uv: 2000,
  //     value: 4.2,
  //     amt: 2.29,
  //   },
  //   {
  //     name: "Pricing data",
  //     // uv: 2780,
  //     value: 2.2,
  //     amt: 2.0,
  //   },
  //   {
  //     name: "Insurance",
  //     // uv: 1890,
  //     value: 4.2,
  //     amt: 2.181,
  //   },
  //   {
  //     name: "Credit assessment",
  //     // uv: 2390,
  //     value: 10.0,
  //     amt: 2.5,
  //   },
    
    
  // ];
  // const [data, setData] = useState([]);
  useEffect(() => {

    // if (barChartData) {
    //   setData([...barChartData]);
    // }
  },[]);

  // console.log(data)
  return (
    <div className={styles.barchartencloser} >
      {/* <div style={{border:"1px solid red", borderRadius:"10px"}}> */}

      <BarChart
        // width={dataForThePieChart.length >= 10 ? 1500 : dataForThePieChart.length <= 4 ? 400  : dataForThePieChart.length <= 8 ? 680 : 1000}
        width={dataForThePieChart.length <=2 ? 200 : dataForThePieChart.length <=4 ? 400  : dataForThePieChart.length <= 6 ? 500 : dataForThePieChart.length <=8 ? 680 : dataForThePieChart.length <=10 ? 800 : dataForThePieChart.length <=12 ? 1000 : 1500}
        height={280}
        data={dataForThePieChart}
        margin={{ top: 0, right: 25, bottom: 0, left: -20 }}
        barSize={30}
        //    style={{border:"1px solid blue"}}
        isAnimationActive={true}
        // barCategoryGap={300}
        barGap={300}
        
      >
        <YAxis
          padding={{ top: 20, bottom: 5 }}
          tickCount={dataForThePieChart.length + 1}
          tickSize={0}
          minTickGap={1}
          domain={[0, "dataMax + 2"]}
          type="number"
          fontSize="10px"
          axisLine={false}
          isAnimationActive={true}
          fontWeight="600"
        />
        <XAxis
          padding={{ left: 35, right: 20 }}
          tickSize={1}
          minTickGap={-1}
          fontSize="10px"
          fontWeight="600"
          axisLine={false}
          type="category"
          dataKey="name"
          scale="point"
          interval={0}
          angle={dataForThePieChart.length < 10 ? 0 : dataForThePieChart.length >=10 ? 20 : 0 }
          tickMargin={1}
          width={10000}
          
        />
        <Tooltip />

        <Bar 
        
        isAnimationActive={true}
        animationBegin="0"
        animationDuration={2000}
        dataKey="value" fill="#5AAAFA" />
      </BarChart>
    </div>
  );
};

export default BarChartComponent;
