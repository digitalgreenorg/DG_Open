import React, { useState, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "../dataset_integration.module.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import { Checkbox, Fab, FormControlLabel, TextField } from "@mui/material";
import { CheckLg } from "react-bootstrap-icons";
import CardDetail from "../CardDetail/CardDetail";
import {
  dateTimeFormat,
  handleUnwantedSpace,
  toTitleCase,
  validateInputField,
} from "../../../../Utils/Common";
import { Button, Affix, Alert } from "antd";
import RegexConstants from "../../../../Constants/RegexConstants";
import Join from "../Join/Join";
import leftG from "../../../../Assets/Img/Join type/Color/Left.svg";
import leftB from "../../../../Assets/Img/Join type/Normal state/left.svg";
import rightB from "../../../../Assets/Img/Join type/Normal state/right.svg";
import rightG from "../../../../Assets/Img/Join type/Color/right.svg";
import fullB from "../../../../Assets/Img/Join type/Normal state/outer.svg";
import fullG from "../../../../Assets/Img/Join type/Color/outer.svg";
import innerB from "../../../../Assets/Img/Join type/Normal state/inner.svg";
import innerG from "../../../../Assets/Img/Join type/Color/inner.svg";
import analytics from "../../../../Assets/Img/analytics.png";
import settinggif from "../../../../Assets/Img/setting.gif";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BorderColorIcon from "@mui/icons-material/BorderColor";

const DatasetSelect = (props) => {
  const {
    setIsAllConditionForSaveMet,
    temporaryDeletedCards,
    setTemporaryDeletedCards,
    connectorTimeData,
    isEditModeOn,
    setIsConditionForConnectorDataForSaveMet,
    isEdited,
    setIsEdited,
    setIsEditModeOn,
    setIsDatasetIntegrationListModeOn,
    integrateMore,
    empty,
    template,
    setTemplate,
    counterForIntegrator,
    completedJoinData,
    setCompleteJoinData,
    resetAll,
    generateData,
    orgList,
    joinType,
    setJoinType,
    setCompleteData,
    setConnectorData,
    connectorData,
    completeData,
    setFinalDataNeedToBeGenerated,
    finalDataNeedToBeGenerated,
    listOfFilesSelected,
    allDatasetNameList,
    listOfDatasetSelected,
    handleChangeDatasetNameSelector,
    listOfDatsetFileAvailableForColumn,
  } = props;
  const [errorConnectorName, setErrorConnectorName] = useState("");
  const [errorConnectorDesc, setErrorConnectorDesc] = useState("");
  const [value, setValue] = useState("Join by");
  const [show, setShow] = useState(false);
  const [indexShow, setIndex] = useState(-1);

  const handleChange = (e) => {
    let value = e.target.name;
    if (value == "name") {
      if (e.target.value && connectorData.desc) {
        setIsConditionForConnectorDataForSaveMet(true);
      } else {
        setIsConditionForConnectorDataForSaveMet(false);
      }
      setErrorConnectorName("");
      validateInputField(e.target.value, RegexConstants.connector_name)
        ? setConnectorData({
            ...connectorData,
            [e.target.name]: e.target.value,
          })
        : e.preventDefault();
    } else {
      if (e.target.value && connectorData.name) {
        setIsConditionForConnectorDataForSaveMet(true);
      } else {
        setIsConditionForConnectorDataForSaveMet(false);
      }
      setErrorConnectorDesc("");
      validateInputField(e.target.value, RegexConstants.connector_name)
        ? setConnectorData({
            ...connectorData,
            [e.target.name]: e.target.value,
          })
        : e.preventDefault();
    }
  };

  const [selectAll, setSelectAll] = useState(false);
  const [totalCounter, setTotalCounter] = useState(-1);
  const [selectedColumns, setSelectedColumns] = useState({});
  const [top, setTop] = useState(0);
  const changeAllSelect = (file) => {
    //console.log(selectedColumns)
    if (selectedColumns[file.name]) {
      let obj = { ...selectedColumns };
      delete obj[file.name];
      setSelectedColumns({ ...obj });
    } else {
      let obj = { ...selectedColumns };
      obj[file.name] = file.columns;
      setSelectedColumns({ ...obj });
    }
  };
  const [joinTypeArr, setJoinTypeArr] = useState([
    { name: "left", black: leftB, green: leftG },
    { name: "right", black: rightB, green: rightG },
    { name: "inner", black: innerB, green: innerG },
    { name: "outer", black: fullB, green: fullG },
  ]);
  const selectThisType = (name) => {
    setJoinType(name);
  };
  const handleChangeColumns = (e, file, col) => {
    //console.log(e.target.checked, file, col)
    let obj = { ...finalDataNeedToBeGenerated };
    if (obj[file]) {
      if (e.target.checked && !obj[file].includes(col)) {
        obj[file] = [...obj[file], col];
      } else {
        let ind = obj[file].indexOf(col);
        if (ind > -1) {
          obj[file].splice(ind, 1);
        }
      }
    } else {
      if (e.target.checked) {
        obj[file] = [col];
      } else {
        let ind = obj[file].indexOf(col);
        obj[file].splice(ind, 1);
      }
    }
    setFinalDataNeedToBeGenerated({ ...obj });
  };

  //after all selection field is filled this func will be triggered when clicked on add
  const addNewForm = () => {
    let arr = [...completeData];
    console.log("template", template, arr);
    arr.push(template);
    setCompleteData([...arr]);
    setTotalCounter((prev) => prev + 1);
    setTemplate({ ...empty });
    console.log(arr, "ARR NEW");
  };

  //datasetname no space handler
  const handleConnectorNameKeydown = (e) => {
    if (e.target.name == "name") {
      handleUnwantedSpace(connectorData.name, e);
    } else {
      handleUnwantedSpace(connectorData.desc, e);
    }
  };
  const handleMoreDataShow = (index, condition, e, whatToShow) => {
    e.stopPropagation();
    if (condition) {
      setIndex(index);
      setShow(true);
      // if(whatToShow=="table_result"){
      //     setShowTable
      // }
    } else {
      setIndex(-1);
      setShow(false);
    }
  };

  return (
    <Container
      style={{ background: "rgb(252, 252, 252)" }}
      className="dataset_selector_in_integration"
    >
      <Row style={{ marginBottom: "25px" }}>
        <Col
          lg={1}
          onClick={() => {
            resetAll();
          }}
          className={styles.backButtonMainDiv + " backButtonMainDiv"}
        >
          <ArrowBackIcon className={styles.backArrowIcon}></ArrowBackIcon>{" "}
          <div className={styles.backButtonText}>Back</div>
        </Col>
      </Row>
      <Row className={styles.select_dataset_logo}>
        <Col lg={12}>
          Dataset integration details
          {isEditModeOn && (
            <sub className={styles.subTime}>
              {"Last updated on: " +
                dateTimeFormat(connectorTimeData.last_updated, true)}
            </sub>
          )}
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <TextField
            inputProps={{ maxLength: 250 }}
            onKeyDown={handleConnectorNameKeydown}
            error={errorConnectorName ? true : false}
            disabled={isEditModeOn ? true : false}
            helperText={errorConnectorName ? errorConnectorName : ""}
            style={{ marginBottom: "25px" }}
            value={connectorData.name}
            onChange={handleChange}
            name="name"
            fullWidth
            id="outlined-basic"
            label="Connector name"
            required
            autoFocus
            variant="outlined"
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <TextField
            onKeyDown={handleConnectorNameKeydown}
            error={errorConnectorDesc ? true : false}
            style={{ marginBottom: "25px" }}
            required
            value={connectorData.desc}
            onChange={handleChange}
            multiline
            name="desc"
            helperText={errorConnectorDesc ? errorConnectorDesc : ""}
            rows={4}
            fullWidth
            placeholder="Connector description not more than 512 character"
            id="outlined-basic"
            label="Connector description"
            variant="outlined"
            inputProps={{ maxLength: 512 }}
          />
        </Col>
      </Row>

      <Row className={styles.select_dataset_logo}>
        <Col lg={12}>Select datasets for connector</Col>
      </Row>
      {counterForIntegrator === completeData.length && (
        <div style={{ textAlign: "left" }}>
          To choose other files for integration, click on integrate more
          datasets.
        </div>
      )}
      <Row>
        <Col lg={12} sm={12} sx={12}>
          <Affix
            style={{
              backgrond: "white",
              transition: "all 2s",
              display:
                counterForIntegrator == completeData.length ? "none" : "block",
            }}
            offsetTop={top}
          >
            <Row className={styles.selectors + " all_selectors_as_sticky"}>
              <Col lg={3}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  style={{
                    cursor:
                      completeData.length == counterForIntegrator + 1
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  <InputLabel id="org_name_label">
                    Organization name{" "}
                    <span className="MuiInputLabel-asterisk">*</span>
                  </InputLabel>
                  <Select
                    disabled={
                      completeData.length == counterForIntegrator + 1
                        ? true
                        : false
                    }
                    required
                    labelId="demo-simple-select-label"
                    id="org_name_selector"
                    value={template?.org_id}
                    label="Organization name *"
                    onChange={(e) =>
                      handleChangeDatasetNameSelector(
                        e,
                        completeData.length - 1,
                        "org"
                      )
                    }
                  >
                    {orgList?.map((each_org, ind) => {
                      return (
                        <MenuItem key={ind} value={each_org?.id}>
                          {each_org?.name ? each_org?.name : ""}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Col>
              <Col lg={3}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="dataset_name_label">
                    Dataset name{" "}
                    <span className="MuiInputLabel-asterisk">*</span>
                  </InputLabel>
                  <Select
                    defaultValue=""
                    labelId="demo-simple-select-label"
                    id="dataset_name_selector"
                    value={template?.dataset_id}
                    label="Dataset name"
                    autoFocus={
                      template?.dataset_list?.length > 0 ? true : false
                    }
                    disabled={template?.dataset_list?.length > 0 ? false : true}
                    onChange={(e) =>
                      handleChangeDatasetNameSelector(
                        e,
                        completeData.length - 1,
                        "dataset"
                      )
                    }
                  >
                    {template?.dataset_list?.map((eachDatasetName, ind) => {
                      return (
                        <MenuItem key={ind} value={`${eachDatasetName.id}`}>
                          {eachDatasetName.name + ""}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Col>
              <Col lg={3}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="file_name_label">
                    File name <span className="MuiInputLabel-asterisk">*</span>
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="file_name_selector"
                    value={template?.file_name ? template?.file_name : ""}
                    label="File name"
                    autoFocus={template?.file_list?.length > 0 ? true : false}
                    disabled={template?.file_list?.length > 0 ? false : true}
                    onChange={(e) =>
                      handleChangeDatasetNameSelector(
                        e,
                        completeData.length - 1,
                        "file"
                      )
                    }
                  >
                    {template?.file_list?.map((eachDataset, ind) => {
                      return (
                        <MenuItem key={ind} value={eachDataset.file}>
                          {eachDataset.file_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Col>
              <Col lg={3}>
                <Button
                  id="addMoreFileButton"
                  disabled={
                    connectorData.name &&
                    connectorData.desc &&
                    template?.availabeColumns?.length > 0
                      ? false
                      : true
                  }
                  onClick={addNewForm}
                  className={styles.button}
                >
                  Add
                </Button>
              </Col>
            </Row>
          </Affix>
          <hr />
          {completeData?.length > 0 &&
            completeData.map((each, index) => {
              console.log("EACH", each);
              return (
                <span style={{ position: "relative" }} key={index}>
                  {
                    <CardDetail
                      setIsAllConditionForSaveMet={setIsAllConditionForSaveMet}
                      temporaryDeletedCards={temporaryDeletedCards}
                      setTemporaryDeletedCards={setTemporaryDeletedCards}
                      generateData={generateData}
                      completedJoinData={completedJoinData}
                      setCompleteJoinData={setCompleteJoinData}
                      setTotalCounter={setTotalCounter}
                      orgList={orgList}
                      completeData={completeData}
                      setCompleteData={setCompleteData}
                      data={each}
                      index={index}
                    />
                  }
                  {index < completeData.length - 1 && (
                    <span
                      style={{
                        border: index == indexShow && "1.5px solid #C09507",
                      }}
                      class={styles.vl}
                    ></span>
                  )}
                  {index < completeData.length - 1 && (
                    <span
                      span
                      id="settingIconForHover"
                      onClick={(e) => handleMoreDataShow(index, true, e)}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: !show ? "pointer" : "",
                        height: `${
                          show && index == indexShow ? "400px" : "50px"
                        }`,
                        overflow: "hidden",
                        width: `${
                          show && index == indexShow && value == "Join by"
                            ? "700px"
                            : show && index == indexShow
                            ? "1000px"
                            : "50px"
                        }`,
                        margin: "auto",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "50px 50px",
                        backgroundPosition: "center",
                      }}
                      className={
                        index == indexShow
                          ? styles.hoveredOne
                          : styles.alwaysHave
                      }
                    >
                      {
                        <span>
                          <Join
                            value={value}
                            setValue={setValue}
                            result={each["result"] ? each["result"] : []}
                            handleMoreDataShow={handleMoreDataShow}
                            indexShow={indexShow}
                            index={index}
                            each={each}
                            next={completeData[index + 1]}
                            resetAll={resetAll}
                            joinType={joinType}
                            setJoinType={setJoinType}
                            connectorData={connectorData}
                            completeData={completeData}
                            setCompleteData={setCompleteData}
                            finalDataNeedToBeGenerated={
                              finalDataNeedToBeGenerated
                            }
                            generateData={generateData}
                            listOfDatsetFileAvailableForColumn={
                              listOfDatsetFileAvailableForColumn
                            }
                            listOfDatasetSelected={listOfDatasetSelected}
                            listOfFilesSelected={listOfFilesSelected}
                          />
                          {indexShow != index && (
                            <img
                              className={styles.settingGif}
                              src={settinggif}
                              alt=""
                            />
                          )}
                        </span>
                      }
                    </span>
                  )}
                  {index !== indexShow && index < completeData.length - 1 && (
                    <span
                      className={styles.eachSideJoinData}
                      style={{
                        position: "absolute",
                        left: "40px",
                        bottom: "23px",
                        width: "514px",
                        height: "112px",
                        border: "1px solid #C09507",
                        borderRadius: "10px",
                        padding: "10px 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ width: "80%" }}>
                        <div
                          style={{
                            textAlign: "left",
                            marginBottom: "20px",
                            fontWeight: "600",
                          }}
                        >
                          Joined by{" "}
                          <BorderColorIcon
                            className={styles.edit_btn}
                            onClick={(e) => handleMoreDataShow(index, true, e)}
                            cursor="pointer"
                            fontSize="large"
                          />{" "}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                            gap: "35px",
                            textAlign: "left",
                          }}
                        >
                          <span className={styles.detail_joins}>
                            <div> Left column </div>
                            <div>
                              {each?.left_on?.length > 0
                                ? toTitleCase(each?.left_on[0])
                                : "Not selected"}
                            </div>
                          </span>
                          <span className={styles.detail_joins}>
                            <div>Right column </div>
                            <div>
                              {" "}
                              {each?.right_on?.length > 0
                                ? toTitleCase(each?.right_on[0])
                                : "Not selected"}
                            </div>
                          </span>
                          <span className={styles.detail_joins}>
                            <div> Join type </div>
                            <div>
                              {" "}
                              {each?.type ? each?.type : "Not selected"}
                            </div>
                          </span>
                        </div>
                      </div>
                      {/* <span className={styles.result_btn_shortcut_outer}> */}
                      <Button
                        onClick={(e) => {
                          setValue("Integrated data");
                          handleMoreDataShow(index, true, e, "table_result");
                        }}
                        className={styles.result_btn_shortcut}
                        disabled={each["result"]?.length > 0 ? false : true}
                      >
                        {console.log("each result", each["result"])}
                        <img
                          style={{
                            cursor: "pointer",
                            opacity: each["result"]?.length <= 0 ? 0.4 : 1,
                          }}
                          src={analytics}
                          height="50px"
                          width={"50px"}
                          alt=""
                        />
                      </Button>
                      {/* </span> */}
                    </span>
                  )}
                  {index !== indexShow &&
                    index < completeData.length - 1 &&
                    each.left_on?.length <= 0 && (
                      <span
                        style={{
                          position: "absolute",
                          right: "40px",
                          bottom: "0px",
                          width: "514px",
                          height: "112px",
                          borderRadius: "10px",
                          padding: "10px 20px",
                        }}
                      >
                        <Alert
                          message="Please select join details to save the connector"
                          type="error"
                        />
                      </span>
                    )}
                  {index < completeData.length - 1 && (
                    <span
                      style={{
                        border: index == indexShow && "1.5px solid #C09507",
                      }}
                      class={styles.vl}
                    ></span>
                  )}
                </span>
              );
            })}
        </Col>
      </Row>
    </Container>
  );
};

export default DatasetSelect;
