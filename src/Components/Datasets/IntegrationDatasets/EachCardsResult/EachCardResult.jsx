import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";

const EachCardResult = (props) => {
  const { result } = props;
  const [col, setCol] = useState([]);
  const [row, setRow] = useState([]);
  useEffect(() => {
    if (result.length > 0) {
      let val = [];

      for (let key in result[0]) {
        let obj = { field: key, headerName: key, width: "150" };
        val.push(obj);
      }
      let rowArr = [];
      for (let i = 0; i < result.length; i++) {
        let obj1;
        if (result[i]["id"]) {
          obj1 = { ...result[i] };
          //console.log(obj1)
        } else {
          //console.log(obj1)
          obj1 = { id: i, ...result[i] };
        }
        rowArr.push(obj1);
      }
      //console.log(val, rowArr)
      setCol([...val]);
      setRow([...rowArr]);
    }
  }, [result]);
  return (
    <div
      style={{ height: 270, width: "100%", paddingBottom: 10, paddingTop: 10 }}
    >
      <DataGrid
        rows={row}
        columns={col}
        pageSize={5}
        rowsPerPageOptions={[5]}
        hideFooter

        // components={{ NoRowsOverlay, NoResultsOverlay }}
      />
    </div>
  );
};

export default EachCardResult;
