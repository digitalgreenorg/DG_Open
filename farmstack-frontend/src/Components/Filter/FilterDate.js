import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ClickAwayListener from "@mui/base/ClickAwayListener";

const FilterDate = ({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  dates,
  setDates,
  setShowFilter,
  callApply,
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
  const [fromDateError, setFromDateError] = useState(false);
  const [toDateError, setToDateError] = useState(false);

  const handleClose = () => {
    callApply();
    setShowFilter(false);
  };
  const handleFromDate = (value) => {
    let currentDate = new Date();
    let formattedDate = moment(value).format("DD/MM/YYYY");

    //  Get the current year
    const selectedYear = moment(value).year();
    const minAllowedYear = 1900;

    if (
      moment(formattedDate, "DD/MM/YYYY", true).isValid() &&
      moment(value).isSameOrBefore(currentDate) &&
      selectedYear >= minAllowedYear
    ) {
      let tempDates = [...dates];
      tempDates[0].fromDate = value;
      setDates(tempDates);
      setFromDate(value);
      setFromDateError(false);
      // setUpdate((prev) => prev + 1);
    } else {
      setFromDateError(true);
      setFromDate("");
    }
  };

  const handleToDate = (value) => {
    let formattedDate = moment(value).format("DD/MM/YYYY");
    if (
      moment(formattedDate, "DD/MM/YYYY", true).isValid() &&
      moment(value).isSameOrAfter(fromDate) &&
      moment(value).isSameOrBefore(new Date())
    ) {
      let tempDates = [...dates];
      tempDates[0].toDate = value;
      setDates(tempDates);
      setToDate(value);
      setToDateError(false);
      setUpdate((prev) => prev + 1);
    } else {
      setToDateError(true);
      setToDate("");
    }
  };
  // useEffect(() => {
  //   callApply();
  // }, [dates]);

  console.log(fromDate, "fromDate", toDate);
  return (
    <div style={containerStyle}>
      <Card
        sx={{
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          padding: "15px",
        }}
      >
        <Box className="pt-20">
          <Box
            sx={
              mobile
                ? { marginTop: "20px" }
                : {
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }
            }
          >
            <div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  key={fromDate}
                  inputFormat="dd/MM/yyyy"
                  placeholder="Start Date"
                  label="Start Date"
                  maxDate={new Date()}
                  value={fromDate ?? null}
                  onChange={(value) => handleFromDate(value)}
                  data-testid="filter-by-date-from-date"
                  PaperProps={{
                    sx: {
                      borderRadius: "16px !important",
                      "& .MuiPickersDay-root": {
                        "&.Mui-selected": {
                          backgroundColor: "#007B55 !important",
                        },
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      id="filter-by-date-from-date"
                      {...params}
                      variant="outlined"
                      sx={{
                        width: mobile ? "250px" : "388px",
                        svg: { color: "#00A94F" },
                        "& .MuiInputBase-input": {
                          height: "36px",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#919EAB !important",
                          },
                          "&:hover fieldset": {
                            borderColor: "#919EAB",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#919EAB",
                          },
                        },
                      }}
                      helperText={
                        <Typography
                          sx={{
                            fontFamily: "Montserrat !important",
                            fontWeight: "400",
                            fontSize: "12px",
                            lineHeight: "18px",
                            color: "#FF0000",
                            textAlign: "left",
                          }}
                        >
                          {fromDateError
                            ? "Please enter the valid start date of the data capture interval."
                            : ""}
                        </Typography>
                      }
                    />
                  )}
                  // error={props.dataCaptureStartErrorMessage ? true : false}
                />
              </LocalizationProvider>
            </div>

            <div
              style={{
                marginLeft: mobile ? "0px" : "24px",
                marginTop: mobile ? "20px" : "0px",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  key={toDate}
                  inputFormat="dd/MM/yyyy"
                  label="End Date"
                  maxDate={new Date()}
                  minDate={fromDate}
                  value={toDate ?? null}
                  onChange={(value) => handleToDate(value)}
                  PaperProps={{
                    sx: {
                      borderRadius: "16px !important",
                      "& .MuiPickersDay-root": {
                        "&.Mui-selected": {
                          backgroundColor: "#007B55 !important",
                        },
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="filter-by-date-to-date"
                      variant="outlined"
                      sx={{
                        width: mobile ? "250px" : "388px",
                        svg: { color: "#00A94F" },
                        "& .MuiInputBase-input": {
                          height: mobile ? "30px" : "36px",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#919EAB !important",
                          },
                          "&:hover fieldset": {
                            borderColor: "#919EAB",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#919EAB",
                          },
                        },
                      }}
                      helperText={
                        <Typography
                          sx={{
                            fontFamily: "Montserrat !important",
                            fontWeight: "400",
                            fontSize: "12px",
                            lineHeight: "18px",
                            color: "#FF0000",
                            textAlign: "left",
                          }}
                        >
                          {toDateError
                            ? "Please enter the valid end date of the data capture interval."
                            : ""}
                        </Typography>
                      }
                    />
                  )}
                  // error={props.dataCaptureStartErrorMessage ? true : false}
                />
              </LocalizationProvider>
            </div>
          </Box>
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
                height: mobile ? "30px" : "36px",
                borderRadius: "8px",
                textTransform: "none",
                marginRight: "30px",
                "&:hover": {
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0, 171, 85, 0.48)",
                },
              }}
              variant="outlined"
              onClick={() => {
                if (
                  !dates[0]?.fromDate ||
                  !dates[0]?.toDate ||
                  fromDateError ||
                  toDateError
                ) {
                  setDates([{ fromDate: null, toDate: null }]);
                  setFromDate("");
                  setToDate("");
                }
                setShowFilter(false);
              }}
              id="date-filter-close-btn-id"
            >
              Close
            </Button>
          </Box>
        </Box>
      </Card>
    </div>
  );
};

export default FilterDate;
