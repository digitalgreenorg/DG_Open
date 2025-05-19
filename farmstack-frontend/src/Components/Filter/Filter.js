import React, { useState, useEffect } from "react";
import style from "./filter.module.css";
import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const contentDetailsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
};
const Filter = ({
  type,
  dataType,
  content,
  geography,
  setGeography,
  geographies,
  setGeographies,
  countries,
  states,
  cities,
  setShowFilter,
  setUpdate,
}) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const miniLaptop = useMediaQuery(theme.breakpoints.down("lg"));

  const containerStyle = {
    marginLeft: mobile || tablet || miniLaptop ? "0px" : "144px",
    marginRight: mobile || tablet || miniLaptop ? "0px" : "144px",
  };

  return (
    <div style={containerStyle}>
      <Card
        sx={{
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          padding: "15px",
        }}
      >
        <Box className="pt-20">
          {dataType === "list" ? (
            <>
              <Box
                sx={
                  type === "categories"
                    ? {
                        width: "100%",
                        maxHeight: "400px",
                        overflow: "auto",
                      }
                    : {
                        width: "100%",
                        ...contentDetailsStyle,
                        maxHeight: "400px",
                        overflow: "auto",
                      }
                }
              >
                {content?.map((acc, index) => {
                  return (
                    <Box className="text-left" key={index}>
                      <Typography
                        sx={{
                          marginLeft: "12px",
                          fontSize: "15px",
                          fontWeight: "600",
                        }}
                      >
                        {acc.title}
                      </Typography>
                      <Box
                        sx={type === "categories" ? contentDetailsStyle : {}}
                      >
                        {acc?.details?.map((detail, index) => (
                          <Box
                            id={`${acc?.title[0]}-${detail}-${index}`}
                            key={index}
                          >
                            {detail}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </>
          ) : (
            <Box className={mobile ? "" : "d-flex justify-content-between"}>
              <FormControl
                fullWidth
                sx={{
                  width: mobile ? "250px" : "330px",
                  // position: "absolute",
                  // visibility: "collapse",
                }}
                className="mt-30"
              >
                <InputLabel id="test-select-label">Select Country</InputLabel>
                {console.log(
                  geography?.country?.name,
                  "geography?.country?.name",
                  geographies
                )}
                <Select
                  labelId="demo-simple-select-label"
                  id="dataset-filter-by-country-id"
                  data-testid={"select_country_test"}
                  value={geography?.country?.name}
                  renderValue={() => geographies[0]}
                  onChange={(e) => {
                    setUpdate((prev) => prev + 1);
                    setGeography((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }));
                    let arr = [...geographies];
                    arr[0] = e.target.value.name;
                    arr[1] = "";
                    arr[2] = "";
                    setGeographies(arr);
                    // if (!geographies.includes(e.target.value.name)) {
                    //   let tempGeo = [...geographies];
                    //   tempGeo.push(e.target.value.name);
                    //   setGeographies(tempGeo);
                    // } else {
                    //   setGeographies(
                    //     geographies.filter(
                    //       (item) => item.name !== e.target.value.name
                    //     )
                    //   );
                    // }
                  }}
                  sx={{
                    textAlign: "left",
                    "&.MuiInputBase-root": {
                      height: "56px",
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "#919EAB",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#919EAB",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#919EAB",
                    },
                  }}
                  label="Select Country"
                  placeholder="Select Country"
                >
                  {countries?.map((item, index) => {
                    // console.log(item);
                    return (
                      <MenuItem
                        id={`dataset-filter-country-id${index}`}
                        key={index}
                        value={item}
                      >
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                sx={{ width: mobile ? "250px" : "330px" }}
                className="mt-30"
              >
                <InputLabel id="test-select-label">Select State</InputLabel>

                <Select
                  renderValue={() => geographies[1]}
                  labelId="demo-simple-select-label"
                  id="select-country-in-geography-id"
                  value={geography?.state?.name}
                  onChange={(e) => {
                    setUpdate((prev) => prev + 1);
                    setGeography((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }));
                    let arr = [...geographies];
                    arr[1] = e.target.value.name;
                    arr[2] = "";
                    setGeographies(arr);
                    // if (!geographies.includes(e.target.value.name)) {
                    //   let tempGeo = [...geographies];
                    //   tempGeo.push(e.target.value.name);
                    //   setGeographies(tempGeo);
                    // } else {
                    //   setGeographies(
                    //     geographies.filter(
                    //       (item) => item.name !== e.target.value.name
                    //     )
                    //   );
                    // }
                  }}
                  sx={{
                    textAlign: "left",
                    "&.MuiInputBase-root": {
                      height: "56px",
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "#919EAB",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#919EAB",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#919EAB",
                    },
                  }}
                  label="Select County"
                  placeholder="Select County"
                >
                  {states?.map((item, index) => (
                    <MenuItem
                      id={`select-country-in-geography-id${index}`}
                      key={index}
                      value={item}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                sx={{ width: mobile ? "250px" : "330px" }}
                className="mt-30"
              >
                <InputLabel id="test-select-label">Select City</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="select-state-in-geography-id"
                  renderValue={() => geographies[2]}
                  value={geography?.city?.name}
                  onChange={(e) => {
                    setUpdate((prev) => prev + 1);
                    setGeography((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }));
                    let arr = [...geographies];
                    arr[2] = e.target.value.name;
                    setGeographies(arr);
                    // if (!geographies.includes(e.target.value.name)) {
                    //   let tempGeo = [...geographies];
                    //   tempGeo.push(e.target.value.name);
                    //   setGeographies(tempGeo);
                    // } else {
                    //   setGeographies(
                    //     geographies.filter(
                    //       (item) => item.name !== e.target.value.name
                    //     )
                    //   );
                    // }
                  }}
                  sx={{
                    textAlign: "left",
                    "&.MuiInputBase-root": {
                      height: "56px",
                    },
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "#919EAB",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#919EAB",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#919EAB",
                    },
                  }}
                  label="Select Sub County"
                  placeholder="Select Sub County"
                >
                  {cities?.map((item, index) => (
                    <MenuItem
                      id={`select-state-in-geography-id${index}`}
                      key={index}
                      value={item}
                    >
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          <Box
            className={`mt-20 mb-20 ${
              mobile ? "text-center" : "text-right mr-20"
            }`}
          >
            <Button
              sx={{
                fontFamily: "Montserrat",
                fontWeight: 700,
                fontSize: "14px",
                border: "1px solid rgba(0, 171, 85, 0.48)",
                color: "#00A94F",
                width: "86px",
                height: "36px",
                borderRadius: "8px",
                textTransform: "none",
                marginRight: "30px",
                "&:hover": {
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0, 171, 85, 0.48)",
                },
              }}
              variant="outlined"
              onClick={() => setShowFilter(false)}
              id="dataset-close-filter-id"
            >
              Close
            </Button>
          </Box>
        </Box>
      </Card>
    </div>
  );
};

export default Filter;
