import React, { useState } from "react";
import { Tab, Tabs } from "@mui/material";
const ControlledTabs = (props) => {
  const { value, handleChange } = props;
  return (
    <>
      <Tabs
        className="tabs"
        sx={{
          "& .MuiTabs-indicator": { backgroundColor: "#00A94F !important" },
          "& .MuiTab-root": {
            color: "#637381 !important",
            borderLeft: "none !important",
            borderTop: "none !important",
            borderRight: "none !important",
          },
          "& .Mui-selected": { color: "#00A94F !important" },
        }}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        value={value}
        onChange={handleChange}
      >
        {props.tabRenderer?.map((eachTab, index) => {
          return (
            <Tab
              label={
                <span
                  className={
                    value == index ? "tab_header_selected" : "tab_header"
                  }
                >
                  {eachTab.label}
                </span>
              }
              id={`add-dataset-tab-${index + 1}`}
            />
          );
        })}

        {/* <Tab
          sx={{
            "&.MuiButtonBase-root": {
              minWidth: "182.5px",
            },
          }}
          label={
            <span className={value == 1 ? "tab_header_selected" : "tab_header"}>
              Generate API
            </span>
          }
          //   disabled={datasetId || props.datasetIdForEdit ? false : true}
          id="add-dataset-tab-2"
        /> */}
      </Tabs>
      {/* <>{props.tabRenderer[value].component}</> */}
    </>
  );
};

export default ControlledTabs;
