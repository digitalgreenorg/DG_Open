import React, { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
const TopNavigationWithToggleButtons = ({
  tabOptions,
  activeTab,
  setActiveTab,
  handleTabChange,
  mobile,
  tablet,
  miniLaptop,
}) => {
  return (
    <>
      <ToggleButtonGroup
        value={activeTab}
        exclusive
        onChange={handleTabChange}
        aria-label="text alignment"
        sx={{
          textTransform: "capitalize !important",
          marginRight: mobile ? "auto" : "1px",

          "& .Mui-selected": {
            backgroundColor: "#00A94F !important",
            // textTransform: "capitalize !important",
            color: "white !important",
            textTransform: "none !important",
            fontFamily: "Montserrat !important",
            fontWeight: "600",
          },
        }}
      >
        {tabOptions.map((eachFilter, index) => {
          return (
            <ToggleButton
              disableTouchRipple={!eachFilter?.status}
              disabled={!eachFilter?.status}
              value={eachFilter.value}
              aria-label="left aligned"
              key={index}
              sx={{
                textTransform: "none !important",
                fontFamily: "Montserrat !important",
                fontWeight: "600",
                height: "34px",
              }}
            >
              {eachFilter.label}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </>
  );
};

export default TopNavigationWithToggleButtons;
