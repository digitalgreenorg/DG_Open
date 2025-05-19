import {
  Button,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";
import globalStyle from "../../../../Assets/CSS/global.module.css";
import local_style from "./modalbody.module.css";
// Custom cell renderer for the input field
const StyledTableCell = styled(TableCell)(({ theme, width }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#D8FBDE",
    color: theme.palette.common.black,
    width: width == "small" ? "15%" : "30%",
    overflowWrap: "anywhere",
    fontFamily: "Montserrat",
    fontWeight: "700",
    fontSize: "20px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    overflowWrap: "anywhere",
    textAlign: "left",
  },
}));
const StyledTableRow = styled(TableRow)(({ theme, width }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const ModalBody = (props) => {
  const { patchConfig, setPatchConfig } = props;

  //rename input change functionality
  const handleChangeRenameName = (e, index, originalName) => {
    let obj = { ...patchConfig?.renames };
    obj[originalName] = e.target.value.trimStart();
    setPatchConfig({ ...patchConfig, renames: { ...obj } });
  };

  //Select checkbox handleChange functionality
  const handleChange = (event, index, colName) => {
    let arrayOfAlreadySelectedNotSelected = [...patchConfig?.selected];

    //finding for the existance of the element
    let indexForCheckingExistance = arrayOfAlreadySelectedNotSelected?.indexOf(
      colName?.trim()
    );

    //actions to remove the element if exist else add to particular index
    if (indexForCheckingExistance >= 0) {
      arrayOfAlreadySelectedNotSelected.splice(indexForCheckingExistance, 1);
    } else {
      arrayOfAlreadySelectedNotSelected.splice(index, 0, colName?.trim());
    }

    //updation to patchConfig
    setPatchConfig({
      ...patchConfig,
      selected: arrayOfAlreadySelectedNotSelected,
    });
  };

  //This function will reset all the columns to be selected by default and all the renaming will be reset to empty
  const resetAllNameToDefault = () => {
    let renames = { ...patchConfig?.renames };
    for (var key in renames) {
      renames[key] = "";
    }
    let selected = patchConfig?.availabeColumns;
    console.log(
      "🚀 ~ file: ModalBody.jsx:85 ~ resetAllNameToDefault ~ selected:",
      selected
    );
    //all the available columns are as it is and rest is set to default.
    setPatchConfig({ ...patchConfig, renames, selected });
  };

  return (
    <TableContainer
      className={globalStyle.font_family}
      style={{ height: "400px" }}
      component={Paper}
    >
      <Table
        sx={{ minWidth: "100%" }}
        className={globalStyle.font_family}
        aria-label="customized table"
      >
        <TableHead>
          <TableRow>
            <StyledTableCell width={"small"}>Select</StyledTableCell>
            <StyledTableCell>From</StyledTableCell>
            <StyledTableCell>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>To</span>
                <Button
                  onClick={() => resetAllNameToDefault()}
                  className={
                    globalStyle.secondary_button +
                    " " +
                    local_style.clear_all_button
                  }
                >
                  Reset all
                </Button>
              </div>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* populating all the columns available for renaming so that user can make some action on it. */}
          {patchConfig?.availabeColumns?.map((eachCol, index) => {
            console.log(eachCol);
            return (
              <StyledTableRow key={eachCol}>
                <StyledTableCell width={"small"}>
                  {" "}
                  <Checkbox
                    checked={patchConfig?.selected?.includes(eachCol)}
                    onChange={(e) => handleChange(e, index, eachCol)}
                  />
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {eachCol}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {" "}
                  <TextField
                    size="small"
                    label="New column name"
                    inputProps={{
                      maxLength: 50,
                    }}
                    value={patchConfig?.renames[eachCol] ?? ""}
                    placeholder="Enter column name"
                    onChange={(e) => handleChangeRenameName(e, index, eachCol)}
                  />
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ModalBody;
