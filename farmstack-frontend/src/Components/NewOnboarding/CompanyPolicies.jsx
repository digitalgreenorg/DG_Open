import React, { useContext, useEffect, useState } from "react";
import styles from "./onboarding.module.css";
import { Col, Row } from "react-bootstrap";
import { Button, TextField, Typography } from "@mui/material";
import global_style from "../../Assets/CSS/global.module.css";

import FileUploaderMain from "../Generic/FileUploader";
import RichTextEditor from "react-rte";
import CancelIcon from "@mui/icons-material/Cancel";
import document_upload from "../../Assets/Img/Farmstack V2.0/document_upload.svg";
import ControlledAccordions from "../Catergories/ControlledAccordions";
import HTTPService from "../../Services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";
import { FarmStackContext } from "../Contexts/FarmStackContext";
import {
  GetErrorHandlingRoute,
  GetErrorKey,
  goToTop,
} from "../../Utils/Common";
import { CSSTransition } from "react-transition-group";
import { Popconfirm } from "antd";
import CustomDeletePopper from "../DeletePopper/CustomDeletePopper";
import { useHistory } from "react-router-dom";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import Divider from "@mui/material/Divider";
import AccordionBody from "./AccordionBody";

const CompanyPolicies = (props) => {
  const { callLoader, callToast } = useContext(FarmStackContext);
  const [sizeError, setSizeError] = useState("");
  const { setActiveStep, isVisible } = props;
  const [policyName, setPolicyName] = useState("");
  const [policyNameError, setPolicyNameError] = useState("");
  const [fileError, setFileError] = useState("");
  //rich text editor
  const [companyPolicyDescription, setcompanyPolicyDescription] = useState("");
  const [uploadedPolicy, setUploadedPolicy] = useState(null);
  const [preview, setPreview] = useState(null);
  const [allPolicies, setAllPolicies] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(isVisible);

  const [key, setKey] = useState();
  const history = useHistory();

  const handleUploadPolicy = (file) => {
    console.log("function is calling");
    setUploadedPolicy(file);
    setKey(key + 1);
    console.log("file during upload", uploadedPolicy, key);
    setFileError("");
  };
  const handleDeletePolicy = (index) => {
    setUploadedPolicy(null);
    setPreview(null);
    setKey(key + 1);
    setFileError("");
    console.log("file during delete", uploadedPolicy, key);
  };

  const deletePolicyDetail = (e, index) => {
    if (e) {
      e.stopPropagation();
    }
    let arr = allPolicies;
    //id to delete
    let id = arr[index].id;
    submitPolicy("DELETE", id);
  };
  const handleAddPolicy = (e) => {
    // e.preventDefault();
    setFileError("");
    setPolicyNameError("");
    submitPolicy("POST");
  };
  const refreshInputs = () => {
    setPolicyName("");
    setcompanyPolicyDescription("");
    setUploadedPolicy(null);
    setPreview(null);
    setEditorGovLawValue(RichTextEditor.createValueFromString("", "html"));
  };
  const submitPolicy = async (method, policy_id) => {
    let url;
    let payload;
    if (method == "POST") {
      url = UrlConstant.base_url + UrlConstant.datahub_policy;
      payload = new FormData();
      payload.append("description", companyPolicyDescription);
      payload.append("name", policyName);
      if (uploadedPolicy) {
        payload.append("file", uploadedPolicy);
      }
    } else if (method == "DELETE" && policy_id) {
      url = UrlConstant.base_url + UrlConstant.datahub_policy + policy_id + "/";
      payload = "";
    }
    callLoader(true);
    return await HTTPService(method, url, payload, true, true, false, false)
      .then((response) => {
        console.log(response);
        callLoader(false);
        if (
          props.isPolicySettings &&
          (response.status === 201 || response.status === 200)
        ) {
          callToast("Policy settings updated successfully!", "success", true);
        } else if (props.isPolicySettings && response.status === 204) {
          callToast("Policy deleted successfully", "success", true);
        } else if (response.status === 201) {
          callToast("Policy details added successfully!", "success", true);
        }
        if (method == "POST") {
          //after getting the response correclty trying to create accordion detail
          let arr = [...allPolicies, response.data];
          setAllPolicies([...arr]);
          refreshInputs();
        } else if (method == "DELETE") {
          getListOfPolicies();
        }
      })
      .catch(async (e) => {
        callLoader(false);
        var returnValues = GetErrorKey(e, payload.keys());
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            switch (errorKeys[i]) {
              case "name":
                setPolicyNameError(errorMessages[i]);
                break;
              case "description":
                setdescriptionError(errorMessages[i]);
                break;
              case "file":
                setFileError(errorMessages[i]);
                break;
              default:
                let error = await GetErrorHandlingRoute(e);
                if (error) {
                  callToast(
                    error?.message,
                    error?.status === 200 ? "success" : "error",
                    true
                  );
                }
                break;
            }
          }
        } else {
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
        }
      });
  };

  const getListOfPolicies = () => {
    callLoader(true);
    let url = UrlConstant.base_url + UrlConstant.datahub_policy;
    let method = "GET";
    HTTPService(method, url, "", false, true, false, true)
      .then((response) => {
        callLoader(false);
        //after getting the response correclty trying to create accordion detail
        let arr = [...response.data];
        // arr = arr.sort((policyA, policyB) => policyA.name - policyB.name);
        setAllPolicies([...arr]);
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
      });
  };

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!uploadedPolicy) {
      setPreview(undefined);
      return;
    }
    setFileError("");
    const objectUrl = URL.createObjectURL(uploadedPolicy);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [uploadedPolicy]);

  const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: [
      "BLOCK_TYPE_DROPDOWN",
      "INLINE_STYLE_BUTTONS",
      "BLOCK_TYPE_BUTTONS",
      "LINK_BUTTONS",
      "HISTORY_BUTTONS",
    ],
    BLOCK_TYPE_DROPDOWN: [
      { label: "Font", style: "unstyled" },
      { label: "Heading Large", style: "header-one" },
      { label: "Heading Medium", style: "header-two" },
      { label: "Heading Small", style: "header-three" },
    ],
    INLINE_STYLE_BUTTONS: [
      { label: "Bold", style: "BOLD", className: "custom-css-class" },
      { label: "Italic", style: "ITALIC" },
      { label: "Underline", style: "UNDERLINE" },
    ],
    BLOCK_TYPE_BUTTONS: [
      { label: "UL", style: "unordered-list-item" },
      { label: "OL", style: "ordered-list-item" },
    ],
  };

  const [companyPolicyValue, setEditorGovLawValue] = React.useState(
    RichTextEditor.createValueFromString(companyPolicyDescription, "html")
  );
  const [descriptionError, setdescriptionError] = useState("");
  const [enableButton, setEnableButton] = useState(false);

  const handlegovLawChange = (value) => {
    setEditorGovLawValue(value);
    setcompanyPolicyDescription(value.toString("html"));
    if (value.toString("html") !== "<p><br></p>") {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
    setdescriptionError("");
  };
  useEffect(() => {
    getListOfPolicies();
    goToTop(0);
  }, []);
  return (
    <div className={styles.main_box}>
      {!props.isPolicySettings ? (
        <div className={styles.main_label}>Company Policies</div>
      ) : (
        <Row className={styles.main_label}>
          <Col xs={12} sm={6} md={6} xl={6}>
            {props.isPolicySettings ? "Policy Settings" : "Company Policies"}
            <Typography
              className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
            >
              {props.isPolicySettings
                ? "Update your organization's data sharing policies."
                : ""}
            </Typography>
          </Col>
          <Col xs={12} sm={6} md={6} xl={6} style={{ textAlign: "right" }}>
            <Button
              id="addnew-policy-button"
              aria-label="add_policy"
              onClick={() => setIsFormVisible(true)}
              className={`custom_button`}
            >
              + Add New Policy
            </Button>
          </Col>
        </Row>
      )}
      {props.isPolicySettings ? (
        ""
      ) : (
        <div className={styles.sub_label}>
          Enter your company policies, we will show to others! You can add text
          and file upload also
        </div>
      )}

      {!props.isPolicySettings ? (
        <>
          <div className={styles.all_inputs}>
            <Row>
              <Col lg={12} sm={12} style={{ marginBottom: "20px" }}>
                <TextField
                  fullWidth
                  required
                  placeholder="Policy name"
                  label="Policy name"
                  variant="outlined"
                  id="policyName"
                  name="policyName"
                  value={policyName}
                  onChange={(e) => {
                    setPolicyName(e.target.value.trimStart());
                    setPolicyNameError("");
                  }}
                  error={policyNameError ? true : false}
                  helperText={policyNameError}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={12} sm={12} style={{ margin: "20px 0px" }}>
                <RichTextEditor
                  placeholder="Description"
                  toolbarConfig={toolbarConfig}
                  value={companyPolicyValue}
                  onChange={handlegovLawChange}
                  required
                  className="rich_text_editor"
                  id="rich_text_editor"
                  name="bodyText"
                  type="string"
                  multiline
                  variant="filled"
                  style={{
                    textAlign: "left",
                    minHeight: 410,
                    border: "1px solid black",
                  }}
                />
                <span style={{ color: "red", fontSize: "12px" }}>
                  {descriptionError}
                </span>
              </Col>
            </Row>
            <Row>
              <Col lg={12} sm={12} style={{ marginBottom: "20px" }}>
                <Divider>or</Divider>
              </Col>
            </Row>
            <Row>
              <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
                <FileUploaderMain
                  key={key}
                  isMultiple={false}
                  texts={
                    <span>
                      {"Drop files here or click "}
                      <a
                        href="#"
                        style={{
                          textDecoration: "underline",
                          color: "#00A94F",
                          display: "inline-block",
                        }}
                      >
                        {" browse "}
                      </a>
                      {" through your machine, File size not more than"}
                    </span>
                  }
                  fileTypes={["pdf", "doc"]}
                  handleChange={handleUploadPolicy}
                  maxSize={25}
                  setSizeError={() =>
                    setFileError("Maximum file size allowed is 25MB")
                  }
                  id="upload-policy-file"
                />
              </Col>
              <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
                <div
                  className={
                    global_style.bold600 +
                    " " +
                    global_style.font20 +
                    " " +
                    styles.text_left
                  }
                  style={{ marginBottom: "20px" }}
                >
                  {uploadedPolicy && "Uploaded file"}
                </div>
                {uploadedPolicy && (
                  <div className={styles.text_left + " " + styles.preview_box}>
                    {uploadedPolicy && (
                      <div className={styles.each_preview_policy}>
                        <div>
                          <img
                            id="document-logo"
                            height={"52px"}
                            width={"42px"}
                            className={styles.document_upload_logo}
                            src={document_upload}
                          />

                          <span
                            id="file-preview"
                            data-testid="file-preview"
                            className={global_style.blue + " " + styles.link}
                            onClick={() => window.open(preview)}
                            style={{ width: "100%" }}
                          >
                            {uploadedPolicy.name + " "}{" "}
                          </span>
                          <span
                            id="filesize"
                            className={global_style.light_text}
                          >
                            {uploadedPolicy.size &&
                              (uploadedPolicy.size / 1000000).toFixed(2)}
                            MB
                          </span>
                        </div>
                        <CancelIcon
                          onClick={() => handleDeletePolicy()}
                          style={{ cursor: "pointer" }}
                          fontSize="small"
                          id="cancel-policy-file"
                          data-testid="cancel-policy-file"
                        />
                      </div>
                    )}
                  </div>
                )}
                <div
                  className={
                    global_style.size14 +
                    " " +
                    global_style.error +
                    " " +
                    styles.text_left
                  }
                >
                  {fileError}
                </div>
              </Col>
            </Row>
          </div>
          <div className={styles.button_grp}>
            <Button
              id="add-policy-button"
              disabled={
                ((companyPolicyDescription && enableButton) ||
                  uploadedPolicy) &&
                policyName
                  ? false
                  : true
              }
              onClick={() => handleAddPolicy()}
              className={global_style.primary_button + " " + styles.next_button}
            >
              Add
            </Button>
          </div>
          <hr className={styles.guestDividerHr}></hr>
        </>
      ) : (
        <>
          {isFormVisible && (
            <>
              <div className={styles.all_inputs}>
                <Row>
                  <Col lg={12} sm={12} style={{ marginBottom: "20px" }}>
                    <TextField
                      fullWidth
                      required
                      placeholder="Policy name"
                      label="Policy name"
                      variant="outlined"
                      id="policyName"
                      name="policyName"
                      value={policyName}
                      onChange={(e) => {
                        setPolicyName(e.target.value.trimStart());
                        setPolicyNameError("");
                      }}
                      error={policyNameError ? true : false}
                      helperText={policyNameError}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} sm={12} style={{ margin: "20px 0px" }}>
                    <RichTextEditor
                      placeholder="Description"
                      toolbarConfig={toolbarConfig}
                      value={companyPolicyValue}
                      onChange={handlegovLawChange}
                      required
                      className="rich_text_editor"
                      id="rich_text_editor"
                      name="bodyText"
                      type="string"
                      multiline
                      variant="filled"
                      style={{
                        textAlign: "left",
                        minHeight: 410,
                        border: "1px solid black",
                      }}
                    />
                    <span
                      style={{
                        color: "red",
                        fontSize: "12px",
                        textAlign: "left",
                      }}
                    >
                      {descriptionError}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} sm={12} style={{ marginBottom: "20px" }}>
                    <Divider>or</Divider>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
                    <FileUploaderMain
                      key={key}
                      isMultiple={false}
                      texts={
                        <span>
                          {"Drop files here or click "}
                          <a
                            href="#"
                            style={{
                              textDecoration: "underline",
                              color: "#00A94F",
                              display: "inline-block",
                            }}
                          >
                            {" browse "}
                          </a>
                          {" through your machine, File size not more than"}
                        </span>
                      }
                      fileTypes={["pdf", "doc"]}
                      handleChange={handleUploadPolicy}
                      maxSize={25}
                      setSizeError={() =>
                        setFileError("Maximum file size allowed is 25MB")
                      }
                      id="upload-policy-file"
                    />
                  </Col>
                  <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
                    <div
                      className={
                        global_style.bold600 +
                        " " +
                        global_style.font20 +
                        " " +
                        styles.text_left
                      }
                      style={{ marginBottom: "20px" }}
                    >
                      {uploadedPolicy && "Uploaded file"}
                    </div>
                    {uploadedPolicy && (
                      <div
                        className={styles.text_left + " " + styles.preview_box}
                      >
                        {uploadedPolicy && (
                          <div className={styles.each_preview_policy}>
                            <div>
                              <img
                                id="uploadfile-logo"
                                height={"52px"}
                                width={"42px"}
                                className={styles.document_upload_logo}
                                src={document_upload}
                              />

                              <span
                                id="preview-file"
                                data-testid="preview-file"
                                className={
                                  global_style.blue + " " + styles.link
                                }
                                onClick={() => window.open(preview)}
                              >
                                {uploadedPolicy.name + " "}{" "}
                              </span>
                              <span
                                id="filesize"
                                className={global_style.light_text}
                              >
                                {uploadedPolicy.size &&
                                  (uploadedPolicy.size / 1000000).toFixed(2)}
                                MB
                              </span>
                            </div>
                            <CancelIcon
                              onClick={() => handleDeletePolicy()}
                              style={{ cursor: "pointer" }}
                              fontSize="small"
                              id="cancel-policy-file"
                              data-testid="cancel-policy-file"
                            />
                          </div>
                        )}
                      </div>
                    )}
                    <div
                      className={
                        global_style.size14 +
                        " " +
                        global_style.error +
                        " " +
                        styles.text_left
                      }
                    >
                      {fileError}
                    </div>
                  </Col>
                </Row>
              </div>
              <div className={styles.button_grp}>
                <Button
                  id="add-policy-button"
                  disabled={
                    (uploadedPolicy ||
                      (companyPolicyDescription && enableButton)) &&
                    policyName
                      ? false
                      : true
                  }
                  onClick={() => handleAddPolicy()}
                  className={
                    global_style.primary_button + " " + styles.next_button
                  }
                >
                  {" "}
                  Add
                </Button>
              </div>
              <hr className={styles.guestDividerHr}></hr>
            </>
          )}
        </>
      )}
      {!props.isPolicySettings ? (
        <>
          {allPolicies.length > 0 && (
            <div className={styles.main_label}>Catalogs</div>
          )}{" "}
        </>
      ) : (
        ""
      )}
      <Row style={{ marginBottom: "20px 0px" }}>
        <Col lg={12} sm={12}>
          {allPolicies.map((each_policy, index) => {
            // console.log(allPolicies, each_policy);
            return (
              <ControlledAccordions
                data={each_policy}
                index={index}
                heading={each_policy.name}
                Component={AccordionBody}
                accordionDelete={deletePolicyDetail}
                isHeadEditing={false}
                handleEditHeading={() => {}}
                onOpenHideDelete={true}
                getListOfPolicies={getListOfPolicies}
              />
            );
          })}
        </Col>
      </Row>
      {!props.isPolicySettings ? (
        <div className={styles.button_grp}>
          <Button
            onClick={() => setActiveStep((prev) => prev + 1)}
            className={global_style.secondary_button}
            id="policy-button-onboard-finishlater"
            style={{ paddingRight: "25px" }}
          >
            {" "}
            Finish later
          </Button>
          <Button
            disabled={allPolicies.length > 0 ? false : true}
            onClick={() => setActiveStep((prev) => prev + 1)}
            className={global_style.primary_button + " " + styles.next_button}
            id="policy-button-onboard-next"
          >
            {" "}
            Next
          </Button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default CompanyPolicies;
