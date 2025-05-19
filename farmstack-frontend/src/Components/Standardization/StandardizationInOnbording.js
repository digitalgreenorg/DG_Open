import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import "./standardizationInOnbording.css";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import HTTPService from "../../Services/HTTPService";

import add_icon from "../../Assets/Img/Farmstack V2.0/add_icon.svg";

import {
  GetErrorHandlingRoute,
  getUserLocal,
  goToTop,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "../../Utils/Common";
import UrlConstant from "../../Constants/UrlConstants";
import Loader from "../Loader/Loader";
import { message } from "antd";
import { handleUnwantedSpace } from "../../Utils/Common";
import global_style from "../../Assets/CSS/global.module.css";
import styles from "../NewOnboarding/onboarding.module.css";
import { FarmStackContext } from "../Contexts/FarmStackContext";
import { Col, Row } from "react-bootstrap";
import CustomDeletePopper from "../DeletePopper/CustomDeletePopper";
import GlobalStyle from "../../Assets/CSS/global.module.css";
const StandardizationInOnbord = (props) => {
  const { callLoader, callToast } = useContext(FarmStackContext);
  const { inSettings, isaccesstoken, showBrandingScreen, isOnborading } = props;
  const [allDatapoints, setAllDataPoints] = useState([]);
  const [allAttributes, setAllAttributes] = useState({});
  const [allAttributesDes, setAllAttributesDes] = useState({});
  const [datapointName, setDatapointName] = useState("");
  const [datapointDes, setDatapointDes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
  const [editCategoryTitle, setEditCategoryTitle] = useState([]);
  const [datapointNameError, setDatapointNameError] = useState("");
  const [accordionDatapointNameError, setAccordionDatapointNameError] =
    useState([]);
  const [attributeErrorMessage, setAttributeErrorMessage] = useState([]);
  const history = useHistory();

  const [messageApi, contextHolder] = message.useMessage();

  const [anchorEl, setAnchorEl] = React.useState(
    Array(allDatapoints.length).fill(null)
  );
  const [open, setOpen] = React.useState(false);

  const handleDelete = (event, index) => {
    setAnchorEl((prevAnchorEl) => {
      const newAnchorEl = [...prevAnchorEl];
      newAnchorEl[index] = event.currentTarget;
      console.log("event is triggering", newAnchorEl, anchorEl, index);
      return newAnchorEl;
    });
  };
  const handleClose = (index) => {
    const newAnchorEls = [...anchorEl];
    newAnchorEls[index] = null;
    setAnchorEl(newAnchorEls);
    setOpen(false);
    console.log("newAnchorEls", newAnchorEls);
  };

  const handleDatapointCategoryName = (e) => {
    setDatapointNameError("");
    if (e.target.value.length < 51) setDatapointName(e.target.value);
  };

  const handleDatapointCategoryDescription = (e) => {
    if (e.target.value.length < 251) setDatapointDes(e.target.value);
  };

  const handleNameField = (e) => {
    handleUnwantedSpace(datapointName, e);
  };

  const handledescriptionKeydowndes = (e) => {
    handleUnwantedSpace(datapointDes, e);
  };

  const handleAddDatapoint = () => {
    if (!datapointName || !datapointDes) {
      return;
    }
    setSaveButtonEnabled(true);
    let tmpAllDatapoints = [...allDatapoints];
    let newDatapoint = {
      datapoint_category: datapointName,
      datapoint_description: datapointDes,
    };
    // Check if category name already exist or not
    let returnFromFuntion = false;
    tmpAllDatapoints.forEach((category, index) => {
      if (category.datapoint_category === datapointName) {
        setDatapointNameError("Category already exists!");
        returnFromFuntion = true;
        return;
      }
    });
    if (returnFromFuntion) return;

    let tmpAllAttributes = { ...allAttributes };
    let tmpAllAttributesDes = { ...allAttributesDes };

    let keys = Object.keys(allAttributes);

    tmpAllAttributes[keys.length] = [];
    tmpAllAttributesDes[keys.length] = [];

    setAllAttributes({ ...tmpAllAttributes });
    setAllAttributesDes({ ...tmpAllAttributesDes });

    tmpAllDatapoints.push(newDatapoint);
    setAllDataPoints(tmpAllDatapoints);
    setDatapointName("");
    setDatapointDes("");
    callToast("Please submit to save the changes!", "info", true);
  };
  const handleUpdateCategoryName = (index, newValue) => {
    setSaveButtonEnabled(true);

    let tmpAllDatapoints = [...allDatapoints];
    console.log("error array", accordionDatapointNameError);
    if (newValue.length < 51) {
      tmpAllDatapoints[index].datapoint_category = newValue.trimStart();
      setAllDataPoints(tmpAllDatapoints);
    } else {
      return;
    }
  };
  const handleNameExistsUpdate = (index, newValue) => {
    let tmpAllDatapoints = [...allDatapoints];
    let newCategoryName = newValue.trim();

    // Check if category name already exists or not
    let categoryAlreadyExists = tmpAllDatapoints.some((category, i) => {
      return i !== index && category.datapoint_category === newCategoryName;
    });

    if (categoryAlreadyExists) {
      let errorofnewValue = [...accordionDatapointNameError];
      errorofnewValue[
        index
      ] = `"${newCategoryName}" is already taken. Please choose a different name.`;
      setAccordionDatapointNameError(errorofnewValue);
    } else if (newCategoryName === "") {
      let errorofnewValue = [...accordionDatapointNameError];
      errorofnewValue[index] = "This field may not be blank";
      setAccordionDatapointNameError(errorofnewValue);
    } else {
      let tmpDatapointNameError = [...accordionDatapointNameError];
      tmpDatapointNameError[index] = "";
      setAccordionDatapointNameError(tmpDatapointNameError);
      handleUpdateCategoryName(index, newCategoryName);
      let tmp = [...editCategoryTitle];
      tmp[index] = false;
      console.log("edit title", tmp, editCategoryTitle);
      setEditCategoryTitle(tmp);
    }
    callToast("Please submit to save the changes!", "info", true);
  };

  const hanldeAttributeInputChange = (
    index,
    allAttributesArrIndex,
    newValue
  ) => {
    if (newValue.length >= 251) {
      return;
    }
    setSaveButtonEnabled(true);
    let tmpAllAttributes = { ...allAttributes };

    tmpAllAttributes[index][allAttributesArrIndex] = newValue.trimStart();
    setAllAttributes(tmpAllAttributes);
  };

  const handleAddDatapointAttribute = (index) => {
    if (!allAttributes[index] || !allAttributes[index][0]) {
      return;
    }
    setSaveButtonEnabled(true);

    let tmpAllAttributes = { ...allAttributes };
    const newAttribute = tmpAllAttributes[index][0].trimStart();
    if (
      tmpAllAttributes[index].slice(1).some((attr) => attr === newAttribute)
    ) {
      let nameAlreadyExist = [...attributeErrorMessage];
      nameAlreadyExist[
        index
      ] = `"${newAttribute}" already exists for datapoint`;
      setAttributeErrorMessage(nameAlreadyExist);
      return;
    }
    tmpAllAttributes[index].push(tmpAllAttributes[index][0]);
    tmpAllAttributes[index][0] = "";
    setAllAttributes(tmpAllAttributes);

    // For Des
    let tmpAllAttributesDes = { ...allAttributesDes };
    tmpAllAttributesDes[index].push(tmpAllAttributesDes[index][0]);
    tmpAllAttributesDes[index][0] = "";
    setAllAttributesDes(tmpAllAttributesDes);
    setAttributeErrorMessage("");
  };
  const handleDatapointAtticuteDelete = (index, arrIndex) => {
    let tmpAllAttributes = { ...allAttributes };
    tmpAllAttributes[index].splice(arrIndex, 1);
    setAllAttributes(tmpAllAttributes);
    setSaveButtonEnabled(true);
    console.log("tmpAllAttributes", tmpAllAttributes);
    callToast("Please submit to save the changes!", "info", true);
  };

  const confirm = (e, index, item) => {
    if (item?.id) {
      callLoader(true);
      HTTPService(
        "DELETE",
        UrlConstant.base_url +
          UrlConstant.standardization_delete_category +
          item.id +
          "/",
        "",
        false,
        true
      )
        .then((response) => {
          callLoader(false);
          console.log("otp valid", response);
          if (response.status === 204) {
            callToast("Datapoint deleted successfully!", "success", true);
            getStandardiziedTemplate();
          }
        })
        .catch(async (e) => {
          callLoader(false);
          let error = await GetErrorHandlingRoute(e);
          console.log("Error obj", error);
          console.log(e);
          if (error.toast) {
            callToast(
              error?.message || "Something went wrong",
              error?.status === 200 ? "success" : "error",
              true
            );
          }
          if (error.path) {
            history.push(error.path);
          }
          console.log("err", e);
        });
    } else {
      handleDatapointCategoryDelete(index);
    }
    e.stopPropagation();
    setAnchorEl((prevAnchorEl) => {
      const newAnchorEl = [...prevAnchorEl];
      newAnchorEl[index] = null;
      return newAnchorEl;
    });
  };
  const handleDatapointCategoryDelete = (index) => {
    let tmpAllDatapoints = [...allDatapoints];
    tmpAllDatapoints.splice(index, 1);
    setAllDataPoints(tmpAllDatapoints);

    let tmpAllAttributes = { ...allAttributes };
    tmpAllAttributes[index] = [];
    setAllAttributes(tmpAllAttributes);
    setSaveButtonEnabled(true);
    callToast("Please submit to save the changes!", "info", true);
  };

  //   API calls

  const handleSubmit = () => {
    let payload = [...allDatapoints];
    for (let index = 0; allDatapoints[index]; index++) {
      let attributeObj = {};
      for (let i = 1; i < allAttributes[index].length; i++) {
        attributeObj[allAttributes[index][i]] =
          allAttributesDes[index][i] ?? "";
      }
      payload[index]["datapoint_attributes"] = attributeObj;
    }
    let method, url;
    if (inSettings) {
      method = "PUT";
      url = UrlConstant.base_url + UrlConstant.standardization_update_data;
    } else if (
      isOnborading &&
      (!allDatapoints === null || allDatapoints.length > 0)
    ) {
      method = "PUT";
      url = UrlConstant.base_url + UrlConstant.standardization_update_data;
    } else {
      method = isOnborading ? "POST" : "POST";
      url = UrlConstant.base_url + UrlConstant.standardization_post_data;
    }
    setIsLoading(true);
    HTTPService(
      method,
      url,
      payload,
      false,
      true,
      isOnborading ? isaccesstoken : false
    )
      .then((response) => {
        setIsLoading(false);
        console.log("response", response);
        if (response.status == 201) {
          if (inSettings) {
            callToast("Standardization template updated!", "success", true);
          } else {
            // callToast("Onboarding successfull", "success", true);
          }
          if (isOnborading) {
            setOnBoardedTrue();
          } else if (inSettings) {
            getStandardiziedTemplate();
          }
        }
      })
      .catch(async (e) => {
        setIsLoading(false);
        let error = await GetErrorHandlingRoute(e);
        console.log("Error obj", error);
        console.log(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  };

  const getStandardiziedTemplate = () => {
    callLoader(true);
    let url = UrlConstant.base_url + UrlConstant.standardization_get_data;
    HTTPService("GET", url, false, false, true)
      .then((response) => {
        callLoader(false);
        if (response.status == 200) {
          setAllDataPoints(response?.data);
          let tmp = { ...allAttributes };
          let tmpDes = { ...allAttributesDes };
          response.data.forEach((item, index) => {
            tmp[index] = Object.keys(item.datapoint_attributes);
            tmp[index].push(tmp[index]?.[0]);
            tmp[index][0] = "";
            tmpDes[index] = Object.values(item.datapoint_attributes);
            tmpDes[index].push(tmpDes[index]?.[0]);
            tmpDes[index][0] = "";
          });
          setAllAttributes(tmp);
          setAllAttributesDes(tmpDes);
        }
      })
      .catch(async (e) => {
        callLoader(false);
        let error = await GetErrorHandlingRoute(e);
        console.log("Error obj", error);
        console.log(e.response);
        if (error.toast) {
          callToast(
            error?.message,
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path && history) {
          history.push(error.path);
        }
      });
  };

  const setOnBoardedTrue = () => {
    let data = {
      user_id: getUserLocal(),
      on_boarded: true,
    };
    var url = UrlConstant.base_url + UrlConstant.onboarded;
    var bodyFormData = new FormData();
    bodyFormData.append("user_id", getUserLocal());
    bodyFormData.append("on_boarded", true);

    // setIsLoader(true);
    HTTPService("POST", url, data, false, true, isaccesstoken)
      .then((response) => {
        callToast("Onboarded successfuly", "success", true);
        // setIsLoader(false);
        console.log("onboarded true response", response.data);
        if (isLoggedInUserAdmin()) {
          history.push("/datahub/new_datasets");
        } else if (isLoggedInUserParticipant()) {
          history.push("/participant/datasets");
        } else if (isLoggedInUserCoSteward()) {
          history.push("/datahub/new_datasets");
        }
      })
      .catch(async (e) => {
        let error = await GetErrorHandlingRoute(e);
        console.log("Error obj", error);
        console.log(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  };
  useEffect(() => {
    getStandardiziedTemplate();
    goToTop(0);
  }, []);

  return (
    <>
      {isLoading ? <Loader /> : ""}
      {contextHolder}
      <div className={styles.main_box}>
        <div className={styles.main_label}>
          <div>Datapoint details</div>
          <Typography
            className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
          >
            {props.inSettings
              ? "Create and update datapoints to standardise datasets."
              : "Enter the datapoints and datapoints attributes, we will show to others!"}
          </Typography>
        </div>
        <div className="data-point-input-box-container">
          <Row>
            <Col lg={12} sm={12} style={{ marginBottom: "20px" }}>
              <TextField
                required
                fullWidth
                value={datapointName}
                onChange={(e) => handleDatapointCategoryName(e)}
                onKeyDown={handleNameField}
                inputProps={{ maxLength: 250 }}
                id="datapoint-name-input-box-id"
                label="Datapoint name"
                variant="outlined"
                error={datapointNameError ? datapointNameError : ""}
                helperText={datapointNameError ? datapointNameError : ""}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12} sm={12} style={{ marginBottom: "20px" }}>
              <TextField
                fullWidth
                value={datapointDes}
                onChange={(e) => handleDatapointCategoryDescription(e)}
                onKeyDown={handledescriptionKeydowndes}
                inputProps={{ maxLength: 250 }}
                rows={4}
                multiline
                size="small"
                id="datapoint-name-input-box-description-id"
                label="Datapoint description"
                variant="outlined"
              />
            </Col>
          </Row>
        </div>
        <div className="datapoint-add-button-classname">
          <Button
            variant="contained"
            className={global_style.primary_button + " " + styles.next_button}
            id="add-datapoint-button"
            onClick={handleAddDatapoint}
            disabled={!datapointName}
          >
            Add
          </Button>
        </div>

        <div className="attribute-container">
          {allDatapoints?.length > 0 && (
            <div className={styles.main_label}>
              Datapoint attributes
              <Typography
                className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
              >
                {inSettings
                  ? "Customize and control datapoint attributes for accuracy and relevance."
                  : ""}
              </Typography>
            </div>
          )}
          {allDatapoints?.map((item, index) => {
            return (
              <>
                <Accordion className="accordion-main-classname">
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id={`datapoint-category-${index}-accordian`}
                    className="attribute-accordion-titile"
                    data-testid="accordion"
                  >
                    {editCategoryTitle[index] ? (
                      <TextField
                        value={item.datapoint_category}
                        required
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          handleUpdateCategoryName(index, e.target.value, e);
                        }}
                        sx={{
                          "&.MuiTextField-root": {
                            textAlign: "left",
                          },
                        }}
                        inputProps={{ maxLength: 250 }}
                        className="datapoint-name-input-box"
                        id={`datapoint-${index}-name-input-edit`}
                        label="Datapoint category name"
                        variant="outlined"
                        helperText={
                          accordionDatapointNameError[index]
                            ? accordionDatapointNameError[index]
                            : accordionDatapointNameError[index]
                        }
                        error={
                          accordionDatapointNameError[index]
                            ? accordionDatapointNameError[index]
                            : accordionDatapointNameError[index]
                        }
                      />
                    ) : (
                      <div>
                        <Typography
                          className="accordion-title text-left"
                          variant="h4"
                        >
                          {item.datapoint_category}
                        </Typography>
                      </div>
                    )}
                    <IconButton
                      onClick={(e) => {
                        let tmp = [...editCategoryTitle];
                        tmp[index] = true;
                        console.log("edit title", tmp, editCategoryTitle);
                        setEditCategoryTitle(tmp);
                      }}
                      id={`edit-${index}-datapoint`}
                      data-testid="editbutton"
                    >
                      <EditIcon />
                    </IconButton>
                    <CustomDeletePopper
                      DeleteItem={"Datapoint category"}
                      anchorEl={anchorEl[index]}
                      handleDelete={(e) => confirm(e, index, item)}
                      id={`delete-${index}-delete-popper-icon`}
                      data-testid={`delete-${index}-delete-popper-icon`}
                      open={
                        anchorEl[index] !== null &&
                        anchorEl[index] !== undefined
                      }
                      closePopper={() => handleClose(index)}
                      deletePopperId={`${index}-delete-popper-accordian-button-datapoint`}
                      cancelPopperId={`${index}-cancel-popper-accordian-button-datapoint`}
                    />
                    <IconButton
                      id={`delete-${index}-datapoint`}
                      onClick={(event) => handleDelete(event, index)}
                      data-testid="deletebutton"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="attribute-main-div">
                      <p className="standardization-accordion-description">
                        {item.datapoint_description}
                      </p>
                      <div
                        style={{ textAlign: "left" }}
                        className={
                          global_style.bold600 +
                          " " +
                          global_style.size20 +
                          " " +
                          styles.margintopbottom10
                        }
                      >
                        Add Datapoint attributes
                      </div>
                      <Row>
                        <Col lg={6}>
                          <TextField
                            sx={{
                              "&.MuiTextField-root": {
                                textAlign: "left",
                              },
                            }}
                            required
                            className="datapoint-attribute-input-box"
                            id={`datapoint-attribute-${index}-input-box-id`}
                            label="Datapoint attributes"
                            variant="outlined"
                            value={allAttributes[index]?.[0]}
                            onChange={(e) => {
                              hanldeAttributeInputChange(
                                index,
                                0,
                                e.target.value
                              );
                            }}
                            inputProps={{ maxLength: 250 }}
                            helperText={
                              attributeErrorMessage[index]
                                ? attributeErrorMessage[index]
                                : attributeErrorMessage[index]
                            }
                            error={
                              attributeErrorMessage[index]
                                ? attributeErrorMessage[index]
                                : attributeErrorMessage[index]
                            }
                          />
                        </Col>
                        <Col
                          lg={6}
                          style={{ textAlign: "left", display: "flex" }}
                        >
                          <img
                            style={{ alignSelf: "center", cursor: "pointer" }}
                            src={add_icon}
                            alt="add"
                            onClick={() => handleAddDatapointAttribute(index)}
                            id="add-subcategories-button"
                            aria-label="add_icon"
                          />
                        </Col>
                      </Row>

                      <Row>
                        {allAttributes?.[index]?.map((inputValue, arrIndex) => {
                          return (
                            <>
                              {arrIndex != 0 ? (
                                <Col
                                  lg={6}
                                  sm={12}
                                  className={styles.margintopbottom10}
                                >
                                  <TextField
                                    required
                                    disabled
                                    fullWidth
                                    InputProps={{
                                      endAdornment: (
                                        <>
                                          <IconButton
                                            onClick={(e) =>
                                              handleDatapointAtticuteDelete(
                                                index,
                                                arrIndex
                                              )
                                            }
                                            id={`delete-${arrIndex}-datapoint-attribute`}
                                            data-testid="delete_attribute_button"
                                          >
                                            <DeleteOutlineIcon />
                                          </IconButton>
                                        </>
                                      ),
                                    }}
                                    id={`datapoint-attribute-${arrIndex}-id`}
                                    label="Datapoint attributes"
                                    variant="outlined"
                                    value={inputValue}
                                  />
                                </Col>
                              ) : (
                                ""
                              )}
                            </>
                          );
                        })}
                      </Row>
                    </div>
                    <Row>
                      <Col style={{ textAlign: "right", margin: "20px" }}>
                        <CustomDeletePopper
                          DeleteItem={"Datapoint category"}
                          anchorEl={anchorEl[index]}
                          handleDelete={(e) => confirm(e, index, item)}
                          id={`delete-${index}-delete-popper-button`}
                          open={
                            anchorEl[index] !== null &&
                            anchorEl[index] !== undefined
                          }
                          closePopper={() => handleClose(index)}
                          deletePopperId={`${index}-delete-popper-datapoint-button`}
                          cancelPopperId={`${index}-cancel-popper-datapoint-button`}
                        />
                        <Button
                          id={`delete-${index}-button-datapoint`}
                          variant="outlined"
                          style={{ margin: "20px" }}
                          className={
                            global_style.secondary_button_error +
                            " " +
                            styles.delete_button_policy
                          }
                          onClick={(event) => handleDelete(event, index)}
                        >
                          Delete
                        </Button>
                        <Button
                          id={`edit-${index}-button-datapoint`}
                          data-testid="editinsideaccordion"
                          variant="outlined"
                          style={{ margin: "20px" }}
                          className={
                            global_style.primary_button +
                            " " +
                            styles.edit_button
                          }
                          onClick={(e) => {
                            if (editCategoryTitle[index]) {
                              handleNameExistsUpdate(
                                index,
                                item.datapoint_category
                              );
                            } else {
                              let tmp = [...editCategoryTitle];
                              tmp[index] = true;
                              console.log("edit title", tmp, editCategoryTitle);
                              setEditCategoryTitle(tmp);
                            }
                          }}
                        >
                          {editCategoryTitle[index] ? "Update" : "Edit"}
                        </Button>
                      </Col>
                    </Row>
                  </AccordionDetails>
                </Accordion>
              </>
            );
          })}
        </div>
      </div>
      <div className="datapoint-add-button-classname">
        {inSettings ? (
          <>
            <Button
              variant="contained"
              className={global_style.secondary_button}
              id="cancel-add-datapoint-button"
              onClick={() => history.push("/datahub/new_datasets")}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className={global_style.primary_button + " " + styles.next_button}
              id="addte-add-datapoint-button"
              onClick={handleSubmit}
              disabled={!allDatapoints.length || !saveButtonEnabled}
            >
              Submit
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              className={global_style.secondary_button}
              id="add-finish-later-datapoint-button"
              onClick={() => setOnBoardedTrue()}
              style={{ paddingRight: "25px" }}
            >
              Finish later
            </Button>
            <Button
              variant="contained"
              // className="datapoint-add-button"
              className={global_style.primary_button + " " + styles.next_button}
              id="add-next-datapoint-button"
              onClick={handleSubmit}
            >
              Finish
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default StandardizationInOnbord;
