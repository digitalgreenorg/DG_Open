import { Tooltip } from "@mui/material";
import React, { useState } from "react";
import "./datasets.module.css"
const LegendValue = ({ data, COLORS }) => {
  // const [total, setTotal] = useState(0)
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    // console.log(data)
    sum += +data[i].value;
  }

  // setTotal(sum)
  return (
    <div style={{ overflowY:"scroll", height:"240px"}} className="width250px" >
      {data.map((entry, index) => (
        <div
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "left",
          }}
        >
          <div
            style={{
              height: "20px",
              width: "20px",
              background: `${COLORS[index]}`,
              marginRight: "14px",
              // marginLeft: "1px",
              marginBottom: "20px",
            }}
          ></div>
          <div style={{textAlign:"left"}} className="width200px" key={`item-${index}`}>
            {/* <Tooltip title={`${Math.round((+entry.value / sum) * 100)}% ${entry.name}` }> */}
           <span >{`${Math.round((+entry.value / sum) * 100)}% ${entry.name}` }</span> 
            {/* </Tooltip> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LegendValue;
