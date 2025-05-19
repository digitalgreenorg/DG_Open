import React, { useEffect, useState } from "react";
import List from "rc-virtual-list";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";

const VirtualListForMaskColumn = (props) => {
  const { data, selectedColForMask, setSelectedCOlForMask, standardiseFile } =
    props;
  // {"mask_columns":["REGION","WOREDA"],"standardised_configuration":{},"config":{"REGION":{"masked":true},"WOREDA":{"masked":true}}}
  const handleChange = (name) => {
    console.log(name);
    let obj = { ...selectedColForMask };
    // if(name == "_all_"){
    //     obj
    // }else if()

    if (!obj[name]) {
      obj[name] = { masked: true };
    } else {
      delete obj[name];
    }
    setSelectedCOlForMask(obj);
  };

  useEffect(() => {
    setSelectedCOlForMask(standardiseFile?.standardisation_config ?? {});
  }, []);

  console.log(selectedColForMask, "selectedColForMask");
  console.log(standardiseFile, "standardiseFile");
  //   let lengthCheck = Object.keys(selectedColForMask) === data.length;
  return (
    <>
      {/* <h4>Masking</h4> */}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "left",
          gap: "20px",
          height: "30px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginTop: "5px",
          textAlign: "left",
          alignItems: "center",
          fontSize: "24px",
        }}
      >
        <Checkbox
          onClick={() => handleChange(lengthCheck ? "_none_" : "_all_")}
          checked={lengthCheck}
        />{" "}
        <ListItemText primary={lengthCheck ? "Deselect All" : "Select All"} />
      </div> */}
      <List data={data} height={400} itemHeight={30} itemKey={"id"}>
        {(name, index) => (
          <div
            className="each_list_in_masking_dataset"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              height: "50px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginTop: "0px",
              textAlign: "left",
              alignItems: "center",
              fontSize: "20px",
              padding: "0px 10px",
              textTransform: "capitalize",
            }}
            key={name}
            value={name}
          >
            <ListItemText style={{ fontSize: "30px" }} primary={name} />
            <Checkbox
              onClick={() => handleChange(name)}
              checked={selectedColForMask[name] ?? false}
            />{" "}
          </div>
        )}
      </List>
    </>
  );
};

export default VirtualListForMaskColumn;
