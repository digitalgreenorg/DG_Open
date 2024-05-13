import { Box, Chip, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { dateTimeFormat } from "common/utils/utils";
// import DeleteIcon from "@mui/icons-material/Delete";
const ShowFilterChips = ({
  geographies,
  categorises,
  dates,

  // setDates,
  handleFromDate,
  handleToDate,
  setFromDate,
  setToDate,
  geography,
  setGeography,
  setGeographies,
  // setAllCategories,
  // setCategorises,
  handleCheckBox,
  // getAllCategoryAndSubCategory,
  // callApply,
  setUpdate,
}) => {
  // console.log(dates);
  // const [updater, setUpdate] = useState(0);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  const containerStyle = {
    marginLeft: mobile ? "0px" : "144px",
    marginRight: mobile ? "0px" : "144px",
    textAlign: "left",
    marginTop: "20px",
  };

  const handleDelete = (main, keyName, value, index, filter_type) => {
    console.log(main, keyName, value, filter_type);
    setUpdate((prev) => prev + 1);
    switch (filter_type) {
      case "date":
        handleToDate("");
        handleFromDate("");
        // setUpdate((prev) => prev + 1);
        // callApply();
        break;
      case "from_date":
        handleToDate("");
        handleFromDate("");

        // callApply();
        break;
      case "geography":
        let arr = [...geographies];

        let obj = { ...geography };
        console.log(typeof index);
        switch (index) {
          case 0:
            obj["country"] = null;
            obj["state"] = "";
            obj["city"] = "";
            arr.splice(index);
            console.log(obj, arr);
            break;
          case 1:
            obj["state"] = null;
            obj["city"] = null;
            arr.splice(index);
            break;

          case 2:
            obj["city"] = null;
            arr[2] = "";
            break;

          default:
            obj["country"] = null;
            obj["state"] = null;
            obj["city"] = null;
            arr.splice(index);
            break;
        }
        setGeography({ ...obj });
        setGeographies([...arr]);
        // callApply();
        break;
      case "category":
        handleCheckBox(keyName, value);
        // callApply();
        // getAllCategoryAndSubCategory();
        break;
      default:
        // code block
        return;
    }
  };
  // useEffect(() => {
  //   callApply();
  //   // console.log("use");
  // }, [geographies, categorises, dates]);
  return (
    <Box sx={containerStyle}>
      {geographies?.map((each, ind) => {
        if (!each) return;
        return (
          <Chip
            id={`geographies-filter-chips-id${ind}`}
            sx={{
              marginLeft: "5px",
              marginRight: "15px",
              marginBottom: "15px",
              visibility: ind == 0 ? "hidden" : "visible",
            }}
            key={each + ind}
            label={each}
            onDelete={() =>
              handleDelete(geographies, "", each, ind, "geography")
            }
          />
        );
      })}
      {Object.keys(categorises).map((key, index) => {
        return (
          <>
            {categorises[key].map((res, ind) => {
              return (
                <Chip
                  sx={{
                    marginLeft: "5px",
                    marginRight: "15px",
                    marginBottom: "15px",
                  }}
                  key={res + ind}
                  label={res}
                  onDelete={() =>
                    handleDelete(categorises, key, res, ind, "category")
                  }
                  id={`category-filter-chips-id${ind}`}
                />
              );
            })}
          </>
        );
      })}
      {dates?.map((each, index) => {
        console.log(dates);
        return (
          <>
            {each.fromDate ? (
              <Chip
                id={`date-filter-chips-id${index}`}
                sx={{
                  marginLeft: "5px",
                  marginRight: "15px",
                  marginBottom: "15px",
                }}
                label={` ${dateTimeFormat(each.fromDate, false)} - ${
                  each.toDate
                    ? dateTimeFormat(each.toDate, false)
                    : "Select end date"
                }`}
                onDelete={() =>
                  handleDelete(dates, "", each.fromDate, 0, "date")
                }
              />
            ) : (
              <></>
            )}
            {/* {each.toDate ? (
              <Chip
                sx={{
                  marginLeft: "5px",
                  marginRight: "15px",
                  marginBottom: "15px",
                }}
                label={`To : ${dateTimeFormat(each.toDate, false)}`}
                onDelete={() =>
                  handleDelete(dates, "", each.toDate, 1, "to_date")
                }
              />
            ) : (
              <></>
            )} */}
          </>
        );
      })}

      {/* {dates[0].fromDate ||
      dates[0].toDate ||
      Object.keys(categorises)?.length > 0 ||
      geographies.length > 0 ? (
        <Button
          sx={{
            fontFamily: "Arial",
            fontWeight: 700,
            fontSize: "14px",
            width: "86px",
            height: "36px",
            background: "#00A94F",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#00A94F",
              color: "#fffff",
            },
          }}
          // disabled={fromDate && toDate ? false : true}
          variant="contained"
          // onClick={() => handleClose()}
        >
          Apply
        </Button>
      ) : (
        ""
      )} */}
    </Box>
  );
};

export default ShowFilterChips;
