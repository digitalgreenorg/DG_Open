import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import globalStyle from "../../Assets/CSS/global.module.css";
import ContainedButton from "../../Components/Button/ContainedButton";
import { validateInputField } from "../../Utils/Common";
import RegexConstants from "../../Constants/RegexConstants";
import { Affix } from "antd";
import styles from "../../Components/Datasets/IntegrationDatasets/dataset_integration.module.css";

const textFieldStyle = {
  width: "270px",
  height: "54px",
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#919EAB",
    },
    "&:hover fieldset": {
      borderColor: "#919EAB",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#919EAB",
    },
  },
};

const selectStyle = {
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
  ".MuiSvgIcon-root": {
    fill: "#637381 !important",
  },
};

const SelectConnector = ({
  text,
  subTitle,
  organisations,
  organisationName,
  setOrganisationName,
  template,
  dataset,
  setDataset,
  datasets,
  file,
  setFile,
  files,
  handleChangeSelector,
  connectorName,
  connectorDescription,
  empty,
  setTemplate,
  completeData,
  setCompleteData,
  setIsConditionForConnectorDataForSaveMet,
  connectorData,
  setConnectorData,
  counterForIntegrator,
}) => {
  const handleAddConnector = () => {
    let arr = [...completeData];
    // console.log("template", template, arr);
    arr.push(template);
    setCompleteData([...arr]);
    setTemplate({ ...empty });
    // console.log(arr, "ARR NEW");
  };

  return (
    <Box>
      <Typography
        className={`${globalStyle.bold600} ${globalStyle.size32}  ${globalStyle.dark_color} mt-50 text-left`}
        sx={{
          fontFamily: "Montserrat !important",
          lineHeight: "40px",
        }}
      >
        {text}
      </Typography>
      <Typography
        className={`${globalStyle.textDescription} text-left ${globalStyle.bold400} ${globalStyle.highlighted_text}`}
      >
        {subTitle}
      </Typography>
      {counterForIntegrator === completeData.length && (
        <div style={{ textAlign: "left", marginTop: "12px" }}>
          To choose other files for integration, click on integrate more
          datasets.
        </div>
      )}
      <Affix
        style={{
          backgrond: "white",
          transition: "all 2s",
          display:
            counterForIntegrator == completeData.length ? "none" : "block",
        }}
        offsetTop={90}
      >
        <Box
          className={`${styles.selectors} all_selectors_as_sticky d-flex justify-content-between align-items-baseline mt-20`}
        >
          <FormControl fullWidth sx={{ width: "270px", height: "54px" }}>
            <InputLabel>Select organisation</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id={"connectors-select-orgnisation-id"}
              value={template?.org_id}
              onChange={(e) => {
                setOrganisationName(e.target.value);
                handleChangeSelector(e.target.value, "org");
              }}
              sx={selectStyle}
              label="Select Organisation"
              placeholder="Select Organisation"
            >
              {organisations?.map((item, index) => {
                return (
                  <MenuItem
                    id={"connectors-select-orgnisation-id-option" + index}
                    data-testid={
                      "connectors-select-orgnisation-id-option" + index
                    }
                    key={item?.org_id}
                    value={item?.org_id}
                  >
                    {item?.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ width: "368px", height: "56px" }}>
            <InputLabel>Select dataset</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id={"connectors-select-dataset-id"}
              value={template?.dataset_id}
              onChange={(e) => {
                setDataset(e.target.value);
                handleChangeSelector(e.target.value, "dataset");
              }}
              autoFocus={template?.dataset_list?.length > 0 ? true : false}
              disabled={template?.dataset_list?.length > 0 ? false : true}
              sx={selectStyle}
              label="Select Dataset"
              placeholder="Select Dataset"
            >
              {template?.dataset_list?.map((item, index) => {
                return (
                  <MenuItem
                    id={"connectors-select-dataset-id-option" + index}
                    key={item?.id}
                    value={item?.id}
                  >
                    {item?.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ width: "270px", height: "56px" }}>
            <InputLabel>Select file</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id={"connectors-select-file-id"}
              value={template?.file_name}
              onChange={(e) => {
                handleChangeSelector(e.target.value, "file");
              }}
              autoFocus={template?.file_list?.length > 0 ? true : false}
              disabled={template?.file_list?.length > 0 ? false : true}
              sx={selectStyle}
              label="Select file"
              placeholder="Select file"
            >
              {template?.file_list?.map((item, index) => {
                return (
                  <MenuItem
                    id={"connectors-select-file-id-option" + index}
                    key={index}
                    value={item?.standardised_file ?? ""}
                  >
                    {item?.file_name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <ContainedButton
            text={"Add"}
            fontWeight={"700"}
            fontSize={"16px"}
            width={"171px"}
            height={"48px"}
            disabled={
              connectorData.name &&
              connectorData.desc &&
              template?.availabeColumns?.length > 0
                ? false
                : true
            }
            handleClick={handleAddConnector}
          />
        </Box>
      </Affix>
    </Box>
  );
};

export default SelectConnector;
