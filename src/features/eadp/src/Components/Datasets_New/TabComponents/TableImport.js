import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import DatasetFilerRow from "./DatasetFilterRow";

const TableImport = (props) => {
  const hasAnyColumnChecked = () => {
    const key = "checked";
    const hasValue = props?.allColumns.some(
      (obj) => obj.hasOwnProperty(key) && obj[key] === true
    );
    return hasValue;
  };
  const isColumnSelected = (fieldSet) => {
    return fieldSet.column_name !== null && fieldSet.column_name !== "";
  };
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: "Montserrat !important",
          fontWeight: "400",
          fontSize: "14px",
          lineHeight: "19.42px",
          color: "#3D4A52",
          textAlign: "left",
        }}
      >
        Connect to your {props.dbName} database and import tables to XLS files
        for your dataset. You can select the columns which you want to import.{" "}
        <span style={{ fontWeight: 600 }}>
          Please make sure that you are connecting to readonly {props.dbName}{" "}
          database.
        </span>
      </Typography>
      <Typography
        sx={{
          fontFamily: "Montserrat !important",
          fontWeight: "400",
          fontSize: "14px",
          lineHeight: "19.42px",
          color: "#3D4A52",
          textAlign: "left",
        }}
      >
        Please refer{" "}
        <span style={{ textDecoration: "underline", color: "#0038FF" }}>
          help
        </span>{" "}
        section to know how to connect to {props.dbName}.
      </Typography>
      <FormControl fullWidth className="mt-30">
        <InputLabel>Select table</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id={`${props.dbName}-upload-dataset-select-id`}
          value={props.tableName}
          onChange={props.handleTableChange}
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
          label="Select table"
          placeholder="Select table"
        >
          {props.menus?.map((menu, index) => (
            <MenuItem
              id={`${props.dbName}-upload-dataset-select-id-${index}`}
              value={menu}
            >
              {menu}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {props.allColumns?.length ? (
        <FormGroup
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            height: "160px",
            overflowY: "auto",
            width: "100%",
          }}
        >
          {props.allColumns.length > 0 &&
            props.allColumns.map((eachCol, index) => {
              console.log(eachCol);
              return (
                <FormControlLabel
                  sx={{
                    marginLeft: "0px",
                    marginRight: "0px",
                    flex: "0 0 33.333333%",
                  }}
                  control={
                    <Checkbox
                      sx={{
                        "&.Mui-checked": {
                          color: "#00A94F !important",
                        },
                      }}
                      key={index}
                      onChange={(e) => props.handleCheckBoxCheck(e, eachCol)}
                      checked={eachCol.checked}
                      id={`${props.dbName}-uploaded-data-checkbox-id-${index}`}
                    />
                  }
                  label={eachCol.value}
                />
              );
            })}
        </FormGroup>
      ) : (
        <></>
      )}
      {props.allColumns?.length ? (
        <>
          <Typography
            sx={{
              fontFamily: "Montserrat !important",
              fontWeight: "600",
              fontSize: "20px",
              lineHeight: "24px",
              color: "#000000",
              textAlign: "left",
              marginTop: "30px",
              marginBottom: "10px",
            }}
          >
            Selected Columns
          </Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              overflowX: "auto",
              margin: "5px 0px",
              height: "65px",
              border: "1px solid #DADADA",
              borderRadius: "8px",
            }}
          >
            {props.allColumns?.map((eachColSelected, index) => {
              return eachColSelected.checked ? (
                <Chip
                  sx={{ marginLeft: "5px", marginRight: "15px" }}
                  label={eachColSelected.value}
                  id={`${props.dbName}-upload-dataset-colum-id-${index}`}
                  data-testid="upload_dataset_colum"
                />
              ) : (
                ""
              );
            })}
          </div>
        </>
      ) : (
        <></>
      )}
      {props.allColumns?.length ? (
        <DatasetFilerRow
          fieldSets={props.fieldSets}
          setFieldSets={props.setFieldSets}
          showDeleteButton={props.showDeleteButton}
          setShowDeleteButton={props.setShowDeleteButton}
          allColumns={props.allColumns}
        />
      ) : (
        <></>
      )}
      <Typography
        sx={{
          fontFamily: "Montserrat !important",
          fontWeight: "600",
          fontSize: "20px",
          lineHeight: "24px",
          color: "#000000",
          textAlign: "left",
          marginTop: "30px",
        }}
      >
        Enter the filename to which you want to import the data*
      </Typography>
      <Typography
        sx={{
          fontFamily: "Montserrat !important",
          fontWeight: "400",
          fontSize: "14px",
          lineHeight: "19.42px",
          color: "#3D4A52",
          textAlign: "left",
          marginTop: "10px",
        }}
      >
        All imports will be XLS file type. If the data being imported exceeds 50
        MB then we will create multiple files post fixed with numbering.
        Example: filename_01.xls, filename_01.xls.
      </Typography>
      <TextField
        id={`${props.dbName}-upload-dataset-filename-id`}
        fullWidth
        required
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
            {!props.validator &&
            (!props.fileName !== null ||
              !props.fileName !== undefined ||
              !props.fileName !== "")
              ? ""
              : "Please enter the file name."}
          </Typography>
        }
        sx={{
          marginTop: "30px",
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
        }}
        placeholder="File name"
        value={props.fileName}
        onChange={(e) => props.setFileName(e.target.value.trimStart())}
      />
      <Box sx={{ marginTop: "31px", textAlign: "end" }}>
        <Button
          sx={{
            fontFamily: "Montserrat",
            fontWeight: 700,
            fontSize: "16px",
            width: "44px",
            height: "48px",
            border: "none",
            borderRadius: "8px",
            color: "#00A94F",
            textTransform: "none",
            "&:hover": {
              background: "none",
              border: "none",
            },
          }}
          variant="outlined"
          onClick={() => props.handleDisconnect()}
          id={`${props.dbName}-upload-dataset-disconnect-btn`}
        >
          Disconnect
        </Button>
        <Button
          sx={{
            fontFamily: "Montserrat",
            fontWeight: 700,
            fontSize: "16px",
            width: "171px",
            height: "48px",
            border: "1px solid rgba(0, 171, 85, 0.48)",
            borderRadius: "8px",
            color: "#00A94F",
            textTransform: "none",
            marginLeft: "60px",
            "&:hover": {
              background: "none",
              border: "1px solid rgba(0, 171, 85, 0.48)",
            },
          }}
          variant="outlined"
          disabled={
            props.fileName && props.tableName && hasAnyColumnChecked()
              ? false
              : true
          }
          onClick={() => props.handleImport()}
          id={`${props.dbName}-upload-dataset-import-btn`}
        >
          Import
        </Button>
      </Box>
    </Box>
  );
};

export default TableImport;
