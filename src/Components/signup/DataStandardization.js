import { TextField } from "@material-ui/core";
import React, { useState } from "react";
import "./dataStandardization.css";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { Button } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import labels from "../../Constants/labels";

const DataStandardization = () => {
  const [tableRow, setTableRow] = useState([1]);
  const [dataPointCategoryNames, setDataPointCategoryNames] = useState([]);
  const [columnNames, setColumnNames] = useState({});

  //   Funcitons

  const hanldeTableAdd = () => {
    console.log("hanldeTableAdd click");
    console.log("columnNames in add table", columnNames);
    let newTableRow = [...tableRow];
    newTableRow.push(1);
    setTableRow(newTableRow);
    console.log("tableRow", tableRow, newTableRow);
  };

  const handleTableDelete = (index) => {
    let newTableRow = [...tableRow];
    newTableRow.splice(index, 1);
    setTableRow(newTableRow);
    let tmpDataPointCategoryNames = [...dataPointCategoryNames];
    tmpDataPointCategoryNames.splice(index, 1);
    setDataPointCategoryNames(tmpDataPointCategoryNames);
    let tmpColumnNames = { ...columnNames };
    tmpColumnNames[index] = [{}];
    setColumnNames(tmpColumnNames);
    console.log("tableRow", tableRow, newTableRow);
  };

  const handleTableRowAdd = (index) => {
    console.log("hanldeTable row Add click");
    let newTableRow = [...tableRow];
    newTableRow[index] = newTableRow[index] + 1;
    setTableRow(newTableRow);
    console.log("tableRow in handleTableRowAdd", tableRow, newTableRow);
  };

  const handleTableRowDelete = (index, keyIndex) => {
    console.log("index to row", index, keyIndex);
    let tmpColumnNames = columnNames;
    if (tmpColumnNames[index]?.[keyIndex]) tmpColumnNames[index][keyIndex] = {};
    setColumnNames(tmpColumnNames);
    let newTableRow = [...tableRow];
    newTableRow[index] = newTableRow[index] - 1;
    setTableRow(newTableRow);
    console.log("tableRow", tableRow, tmpColumnNames);
  };

  const handleDataPointCategoryNames = (value, index) => {
    let tmpDataPointName = [...dataPointCategoryNames];
    console.log(
      "tmpDataPointName[index] in handleDataPointCategoryNames",
      tmpDataPointName[index]
    );
    tmpDataPointName[index] = value;
    console.log(
      "tmpDataPointName[index] in handleDataPointCategoryNames",
      tmpDataPointName[index]
    );

    // let tmpColumnNames = {}
    //  tmpDataPointName.forEach((item, index)=>{
    //   console.log(item)
    //   tmpColumnNames[item] = [{}]
    // })
    // setColumnNames(tmpColumnNames)
    setDataPointCategoryNames(tmpDataPointName);
    // setColumnNames({...columnNames})
    console.log("columnNames", columnNames);
    console.log("dataPointCategoryNames", dataPointCategoryNames);
  };

  const handleColumnName = (value, tableKeyName, index) => {
    console.log("handleColumnName called");

    let newTmpColumnNames = { ...columnNames };
    dataPointCategoryNames.forEach((item, index) => {
      console.log(item);
      if (!newTmpColumnNames[index]) newTmpColumnNames[index] = [{}];
    });
    setColumnNames(newTmpColumnNames);

    let tmpColumnNames = newTmpColumnNames;
    console.log(
      "tmpColumnNames[tableKeyName]",
      tmpColumnNames[tableKeyName],
      tmpColumnNames,
      tableKeyName
    );
    if (!tmpColumnNames[dataPointCategoryNames.indexOf(tableKeyName)][index])
      tmpColumnNames[dataPointCategoryNames.indexOf(tableKeyName)].push({});

    // console.log('tmpColumnNames[dataPointCategoryNames.indexOf(tableKeyName)]',tmpColumnNames,dataPointCategoryNames.indexOf(tableKeyName),tmpColumnNames[dataPointCategoryNames.indexOf(tableKeyName)],tmpColumnNames[dataPointCategoryNames.indexOf(tableKeyName)][index]['columnName'])

    tmpColumnNames[dataPointCategoryNames.indexOf(tableKeyName)][index][
      "columnName"
    ]
      ? (tmpColumnNames[dataPointCategoryNames.indexOf(tableKeyName)][index][
          "columnName"
        ] = value)
      : (tmpColumnNames[dataPointCategoryNames.indexOf(tableKeyName)][index] = {
          ...tmpColumnNames[dataPointCategoryNames.indexOf(tableKeyName)][
            index
          ],
          columnName: value,
        });
    setColumnNames(tmpColumnNames);
    console.log(
      "tmpColumnNames",
      tmpColumnNames,
      newTmpColumnNames,
      columnNames
    );
  };

  const handleColumnDescription = (value, tableKeyName, index) => {
    console.log("handleColumnDescription called");

    let tmpColumnNames = { ...columnNames };
    console.log(
      "tmpColumnNames[tableKeyName]",
      tmpColumnNames[dataPointCategoryNames.indexOf(tableKeyName)],
      tmpColumnNames,
      tableKeyName
    );

    if (!tmpColumnNames[dataPointCategoryNames.indexOf(tableKeyName)][index])
      tmpColumnNames[dataPointCategoryNames.indexOf(tableKeyName)].push({});

    tmpColumnNames[dataPointCategoryNames.indexOf(tableKeyName)][index][
      "columnDescription"
    ]
      ? (tmpColumnNames[dataPointCategoryNames.indexOf(tableKeyName)][index][
          "columnDescription"
        ] = value)
      : (tmpColumnNames[dataPointCategoryNames.indexOf(tableKeyName)][index] = {
          ...tmpColumnNames[dataPointCategoryNames.indexOf(tableKeyName)][
            index
          ],
          columnDescription: value,
        });
    setColumnNames(tmpColumnNames);
    console.log("tmpColumnNames", tmpColumnNames, columnNames);
  };

  const handleSubmit = () => {
    console.log("submit click");
  };

  const handleClear = () => {
    setTableRow([1]);
    setDataPointCategoryNames([]);
    setColumnNames({});
  };

  console.log(
    "component re rendring",
    columnNames,
    columnNames[0]?.[0]?.columnName
  );

  return (
    <>
      <div>
        <div>
          <h1>Data Standardization</h1>
        </div>
        <div>
          {tableRow.map((row, index) => {
            console.log("row no in map", row, index);

            let tmpRowArray = new Array(row);
            tmpRowArray.fill(1);

            return (
              <>
                <div className="data_standardization_table">
                  <TextField
                    id={`data_standardization_table_name${index}`}
                    className="data_standardization_table_class_name"
                    label="Data point category"
                    variant="filled"
                    value={dataPointCategoryNames[index]}
                    onChange={(e) =>
                      handleDataPointCategoryNames(e.target.value, index)
                    }
                    style={{ width: "850px" }}
                    //   className="profilelastname"
                    //   onChange={props.handleprofilelastname}
                    //inputRef={props.profilelastname}
                    //   error={
                    //     props.ispropfilelastnameerror || props.lastNameErrorMessage
                    //   }
                    //   helperText={
                    //     props.ispropfilelastnameerror
                    //       ? "Enter Valid last name"
                    //       : props.lastNameErrorMessage
                    //   }
                    //   value={props.profilelastname}
                  />
                  {index === 0 ? (
                    <span onClick={hanldeTableAdd}>
                      <AddIcon
                        className="data_standardization_add_icon"
                        fontSize="large"
                      />
                    </span>
                  ) : (
                    <span onClick={() => handleTableDelete(index)}>
                      <ClearIcon
                        className="data_standardization_add_icon"
                        fontSize="large"
                      />
                    </span>
                  )}
                  {tmpRowArray.map((childRow, keyIndex) => {
                    return (
                      <>
                        <div>
                          <TextField
                            value={columnNames[index]?.[keyIndex]?.columnName}
                            onChange={(e) =>
                              handleColumnName(
                                e.target.value,
                                dataPointCategoryNames[index],
                                keyIndex
                              )
                            }
                            id={`data_standardization_table_row${keyIndex}`}
                            className="data_standardization_table_row_class_name"
                            label="Column/Key Name"
                            variant="outlined"
                            style={{ width: "300px" }}
                            //   className="profilelastname"
                            //   onChange={props.handleprofilelastname}
                            //inputRef={props.profilelastname}
                            //   error={
                            //     props.ispropfilelastnameerror || props.lastNameErrorMessage
                            //   }
                            //   helperText={
                            //     props.ispropfilelastnameerror
                            //       ? "Enter Valid last name"
                            //       : props.lastNameErrorMessage
                            //   }
                            //   value={props.profilelastname}
                          />
                          <TextField
                            value={
                              columnNames[index]?.[keyIndex]?.columnDescription
                            }
                            onChange={(e) =>
                              handleColumnDescription(
                                e.target.value,
                                dataPointCategoryNames[index],
                                keyIndex
                              )
                            }
                            id={`data_standardization_table_row_description${keyIndex}`}
                            className="data_standardization_table_row_description_class_name"
                            label="Column/Key Description"
                            variant="outlined"
                            style={{ width: "500px" }}
                            //   className="profilelastname"
                            //   onChange={props.handleprofilelastname}
                            //inputRef={props.profilelastname}
                            //   error={
                            //     props.ispropfilelastnameerror || props.lastNameErrorMessage
                            //   }
                            //   helperText={
                            //     props.ispropfilelastnameerror
                            //       ? "Enter Valid last name"
                            //       : props.lastNameErrorMessage
                            //   }
                            //   value={props.profilelastname}
                          />
                          {keyIndex === 0 ? (
                            <span onClick={() => handleTableRowAdd(index)}>
                              <AddIcon fontSize="medium" />
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                handleTableRowDelete(index, keyIndex)
                              }
                            >
                              <ClearIcon fontSize="medium" />
                            </span>
                          )}
                        </div>
                      </>
                    );
                  })}
                </div>
              </>
            );
          })}
        </div>
        <Row style={{ "margin-top": "20px", padding: "0 400px" }}>
          <Col

          // xs={12} sm={12} md={6} lg={3}
          >
            <Button
              onClick={handleSubmit}
              variant="contained"
              className="submitbtn"
            >
              {labels?.en?.common?.submit}
            </Button>
          </Col>
          <Col
          //  xs={12} sm={12} md={6} lg={6}
          >
            <Button
              onClick={handleClear}
              variant="outlined"
              className="cancelbtn"
            >
              {labels?.en?.data_satandardization?.clear_button}
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default DataStandardization;
