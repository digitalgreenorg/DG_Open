import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/system/Box";
import LocalStyle from "./Tabs.module.css";

const CustomTabs = (props) => {
  // this component expects 3 things in props
  const {
    tabValue,
    setTabValue,
    TabLabels,
    orientation,
    filledBackground,
    isPolicy,
  } = props;
  console.log("in cutom tab", tabValue, setTabValue, TabLabels);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      {/* <Box sx={{ borderBottom: 1, borderColor: "divider" }}> */}
      <Tabs
        sx={{
          width: isPolicy ? "260px !important" : "auto",
          "& .MuiTabs-indicator": { backgroundColor: "#00A94F !important" },
          "& .MuiTab-root": {
            color: "#637381 !important",
            borderLeft: "none !important",
            borderTop: "none !important",
            borderRight: "none !important",
            alignItems: "baseline",
            width: isPolicy ? "100% !important" : "auto",
          },
          "& .Mui-selected": {
            alignItems: "baseline",
            color: filledBackground
              ? "#ffffff !important"
              : "#00A94F !important",
            backgroundColor: filledBackground
              ? " #00A94F !important"
              : "#ffffff !important",
            width: isPolicy ? "100% !important" : "auto",
          },
        }}
        value={tabValue}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        onChange={handleChange}
        aria-label="tabs"
        orientation={orientation ?? "horizontal"}
        className={LocalStyle.tabs}
      >
        {TabLabels?.map((label, index) => {
          console.log("tab value ", label);
          let updatedLabel =
            label?.length > 25 ? label.substring(0, 25) + "..." : label;

          return (
            <Tab
              sx={{
                "&.MuiButtonBase-root": {
                  minWidth: "200px",
                  alignItems: "center",
                },
              }}
              id={label + index}
              label={updatedLabel}
            />
          );
        })}
        {/* <Tab label="Co-Steward" />
          <Tab label="Participant" />
          <Tab label="New Participant Requests" /> */}
      </Tabs>
      {/* </Box> */}
    </>
  );
};

export default CustomTabs;
