import React, { useState } from "react";
import {
  Box,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckBoxWithText from "./CheckBoxWithText";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const StandardiseRow = ({
  keyName,
  index,
  datapointAttributes,
  setDatapointAttributes,
  templates,
  setTemplates,
  template,
  setTemplate,
  datapointCategories,
  datapointCategory,
  setDatapointCategory,
  handleMaskCheckBox,
  datapointCategoryChange,
  standardisedColum,
  setStandardisedColumn,
  maskedColumns,
}) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const miniLaptop = useMediaQuery(theme.breakpoints.down("lg"));
  const [isSelectorOpen, setisSelectorOpen] = useState(false);
  const clearCategory = (index) => {
    let tmpStandardisedColum = [...standardisedColum];
    tmpStandardisedColum[index] = "";
    setStandardisedColumn(tmpStandardisedColum);

    let tmpArr = [...datapointCategory];
    tmpArr[index] = "";
    setDatapointCategory(tmpArr);

    let tempAttr = [...datapointAttributes];
    tempAttr[index] = [];
    setDatapointAttributes(tempAttr);
  };

  return (
    <div className="mt-50" key={index}>
      <Box className="d-flex justify-content-between align-items-center w-100 mb-20">
        <Tooltip arrow title={keyName}>
          <Typography
            className="ml-16"
            sx={{
              fontFamily: "Montserrat !important",
              fontWeight: "400",
              fontSize: "20px",
              lineHeight: "24px",
              color: "#000000",
              textAlign: "left",
              width: mobile || tablet ? "100%" : "135px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {keyName}
          </Typography>
        </Tooltip>
        <Box className={mobile || tablet || miniLaptop ? "m-3" : ""}>
          <FormControl fullWidth sx={{ width: "273px" }}>
            <InputLabel>Datapoint category</InputLabel>
            <Select
              id={`standardise-datapoint-category${index}`}
              labelId="demo-simple-select-label"
              className="datapoint-category-classname"
              key={index}
              value={
                datapointCategory?.[index] ? datapointCategory?.[index] : ""
              }
              renderValue={() =>
                datapointCategory?.[index].datapoint_category
                  ? datapointCategory?.[index].datapoint_category
                  : ""
              }
              onChange={(e) => datapointCategoryChange(e.target.value, index)}
              open={isSelectorOpen}
              onClose={() => setisSelectorOpen(false)}
              sx={{
                textAlign: "left",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "#919EAB",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#919EAB",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#919EAB",
                },
                ".MuiOutlinedInput-input": {
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "185px",
                },
                ".MuiPopover-root": {
                  display: isSelectorOpen ? "block" : "none",
                },
              }}
              label="Datapoint category"
              placeholder="Datapoint category"
              endAdornment={
                <InputAdornment position="end">
                  {datapointCategory?.[index]?.datapoint_category ? (
                    <HighlightOffIcon
                      sx={{
                        // marginRight: "25px",
                        cursor: "pointer",
                      }}
                      id={`standardise-clear-datapoint-category${index}`}
                      onClick={() => clearCategory(index)}
                    />
                  ) : (
                    <></>
                  )}
                  <span onBlur={() => setisSelectorOpen(!isSelectorOpen)}>
                    <ExpandMoreIcon
                      sx={{ cursor: "pointer" }}
                      id={`standardise-select-datapoint-category${index}`}
                      onClick={() => setisSelectorOpen(!isSelectorOpen)}
                    />
                  </span>
                </InputAdornment>
              }
              IconComponent={(props) => {
                return <></>;
              }}
            >
              {datapointCategories?.map((item, optIndex) => (
                <MenuItem
                  id={`standardise-datapoint-category-option-${
                    index + optIndex
                  }`}
                  key={item.datapoint_category}
                  value={item}
                  sx={{
                    maxWidth: "800px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item?.datapoint_category.length <= 90
                    ? item?.datapoint_category
                    : item?.datapoint_category?.substring(0, 90) + "..."}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box className={mobile || tablet || miniLaptop ? "m-3" : ""}>
          <FormControl fullWidth sx={{ width: "273px" }}>
            <InputLabel>Datapoint Attribute</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id={`standardise-datapoint-attribute${index}`}
              key={index}
              value={
                standardisedColum?.[index] ? standardisedColum?.[index] : ""
              }
              onChange={(e) => {
                let tmpArr = [...standardisedColum];
                tmpArr[index] = e.target.value;
                setStandardisedColumn(tmpArr);
              }}
              sx={{
                textAlign: "left",
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
              label="Datapoint Attribute"
              placeholder="Datapoint Attribute"
              IconComponent={(props) => {
                return (
                  <ExpandMoreIcon
                    {...props}
                    id={`standardise-select-datapoint-attribute${index}`}
                  />
                );
              }}
            >
              {datapointAttributes[index]?.map((item, optIndex) => (
                <MenuItem
                  id={`standardise-datapoint-attribute-${index + optIndex}`}
                  key={item}
                  value={item}
                  sx={{
                    maxWidth: "800px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item?.length <= 90 ? item : item?.substring(0, 90) + "..."}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box className="mr-16">
          <CheckBoxWithText
            text={"Mask"}
            checked={maskedColumns.includes(keyName)}
            keyName={keyName}
            keyIndex={index}
            keyIndexPassed={true}
            handleCheckBox={handleMaskCheckBox}
            id={`standardise-column}`}
          />
        </Box>
      </Box>
      <Divider />
    </div>
  );
};

export default StandardiseRow;
