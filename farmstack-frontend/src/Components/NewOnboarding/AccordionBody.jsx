import React from "react";
import { useState, useEffect, useContext } from "react";
import RichTextEditor from "react-rte";
import { Button, TextField } from "@mui/material";
import global_style from "../../Assets/CSS/global.module.css";
import styles from "./onboarding.module.css";
import { Col, Row } from "react-bootstrap";
import FileUploaderMain from "../Generic/FileUploader";
import CancelIcon from "@mui/icons-material/Cancel";
import document_upload from "../../Assets/Img/Farmstack V2.0/document_upload.svg";
import HTTPService from "../../Services/HTTPService";
import UrlConstant from "../../Constants/UrlConstants";
import { FarmStackContext } from "../Contexts/FarmStackContext";
import { ClickAwayListener } from "@mui/base";

import {
  GetErrorHandlingRoute,
  GetErrorKey,
  goToTop,
} from "../../Utils/Common";
import { useHistory } from "react-router-dom";
import Divider from "@mui/material/Divider";
import CustomDeletePopper from "../DeletePopper/CustomDeletePopper";
import { CSSTransition } from "react-transition-group";

function AccordionBody(props) {
  const { data, index, deletePolicyDetail, toolbarConfig, getListOfPolicies } =
    props;
  const [isEditModeOn, setEditModeOn] = useState(true);
  const [uploadedPolicyE, setUploadedPolicyE] = useState(null);
  const [previewE, setPreviewE] = useState(null);
  const [isLogoLinkE, setIsLogoLinkE] = useState(false);
  const [policyDesc, setPolicyDesc] = useState(data.description);
  const [policyDescValue, setEditorpolicyDescValue] = React.useState(
    RichTextEditor.createValueFromString(policyDesc, "html")
  );
  const [policySize, setPolicySize] = useState("");
  const [policyNameUnderAccordion, setPolicyNameUnderAccordion] = useState(
    data.name
  );
  const [dataOfFile, setDataOfFile] = useState(data.file);
  const [localKey, setLocalKey] = useState(0);
  const [fileSizeErrorE, setFileSizeErrorE] = useState("");
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const { callLoader, callToast } = useContext(FarmStackContext);
  const [editPolicyNameError, setEditPolicyNameError] = useState([]);
  const [editPolicyDescriptionError, setEditPolicyDescriptionError] = useState(
    []
  );
  const [editPolicyFileError, setEditPolicyFileError] = useState([]);

  const history = useHistory();
  const confirm = (e, index) => {
    deletePolicyDetail(e, index);
    props.setExpanded(false);
    setAnchorEl(null);
    setOpen(false);
  };
  const handleDeletePopper = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  const closePopper = () => {
    setOpen(false);
  };
  const handleUploadPolicyE = (file) => {
    console.log("handleUploadPolicyE called with file:", file);
    setUploadedPolicyE(file);
    // data[index].file = file;
    setPolicySize(file.size);
    setIsLogoLinkE(false);
    setLocalKey(localKey + 1);
    setFileSizeErrorE("");
    setEditPolicyFileError((prevErrors) => {
      const updatedErrors = [...prevErrors];
      updatedErrors[index] = "";
      return updatedErrors;
    });
  };
  useEffect(() => {
    goToTop(0);
  }, []);

  const handleDeleteFile = () => {
    console.log("isfile deleted", uploadedPolicyE);
    setUploadedPolicyE(null);
    setDataOfFile(null);
    setPreviewE(null);
    setPolicySize("");
    setIsLogoLinkE(false);
    setLocalKey(localKey + 1);
    setFileSizeErrorE("");
    setEditPolicyFileError((prevErrors) => {
      const updatedErrors = [...prevErrors];
      updatedErrors[index] = "";
      return updatedErrors;
    });
  };
  useEffect(() => {
    if (uploadedPolicyE) {
      const objectUrl = URL.createObjectURL(uploadedPolicyE);
      setPreviewE(objectUrl);
      setIsLogoLinkE(false);
    } else if (dataOfFile) {
      setPreviewE(dataOfFile);
      setIsLogoLinkE(true);
    } else {
      setPreviewE(null);
      setIsLogoLinkE(false);
    }
  }, [uploadedPolicyE, dataOfFile]);

  const handleDescChange = (value) => {
    setEditorpolicyDescValue(value);
    setPolicyDesc(value.toString("html"));
    setSaveButtonEnabled(value.toString("html") !== "");
    setEditPolicyDescriptionError((prevErrors) => {
      const updatedErrors = [...prevErrors];
      updatedErrors[index] = "";
      return updatedErrors;
    });
  };
  const handleChangePolicyName = (e) => {
    setPolicyNameUnderAccordion(e.target.value.trimStart());
    setEditPolicyNameError((prevErrors) => {
      const updatedErrors = [...prevErrors];
      updatedErrors[index] = "";
      return updatedErrors;
    });
  };
  const handleSave = (e) => {
    e.preventDefault();
    let payload = new FormData();
    payload.append("description", policyDesc);
    payload.append("name", policyNameUnderAccordion);
    !isLogoLinkE && payload.append("file", uploadedPolicyE || "");
    callLoader(true);
    HTTPService(
      "PATCH",
      UrlConstant.base_url + UrlConstant.datahub_policy + data.id + "/",
      payload,
      true,
      true,
      false,
      false
    )
      .then((response) => {
        callLoader(false);
        console.log(response);
        if (response.status === 200) {
          callToast("Policy settings updated successfully!", "success", true);
          getListOfPolicies();
        }
      })
      .catch(async (e) => {
        callLoader(false);
        console.log(e);
        var returnValues = GetErrorKey(e, payload.keys());
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            switch (errorKeys[i]) {
              case "name":
                console.log("response_error", errorMessages[i]);
                setEditPolicyNameError((prevErrors) => {
                  const updatedErrors = [...prevErrors];
                  updatedErrors[index] = errorMessages[i];
                  return updatedErrors;
                });
                break;
              case "description":
                setEditPolicyDescriptionError((prevErrors) => {
                  const updatedErrors = [...prevErrors];
                  updatedErrors[index] = errorMessages[i];
                  return updatedErrors;
                });
                break;
              case "file":
                setEditPolicyFileError((prevErrors) => {
                  const updatedErrors = [...prevErrors];
                  updatedErrors[index] = errorMessages[i];
                  return updatedErrors;
                });
                break;
            }
          }
        } else {
          console.log(e);
          let error = await GetErrorHandlingRoute(e);
          console.log(e);
          if (error?.toast) {
            callToast(
              "Something went wrong",
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

  return (
    <div style={{ textAlign: "left" }}>
      <Row>
        <Col>
          <TextField
            fullWidth
            required
            placeholder="Policy name"
            label="Policy name"
            variant="outlined"
            id={`${index}-policyName-update`}
            name="policyName"
            value={policyNameUnderAccordion}
            onChange={(e) => handleChangePolicyName(e)}
            error={Boolean(editPolicyNameError[index])} // Check if error exists for the specific index
            helperText={editPolicyNameError[index]}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12} sm={12} style={{ margin: "20px 0px" }}>
          <RichTextEditor
            placeholder="Description"
            toolbarConfig={toolbarConfig}
            value={policyDescValue}
            onChange={handleDescChange}
            required
            className="rich_text_editor"
            id={`${index}rich_text_editor-update`}
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
            {editPolicyDescriptionError[index]
              ? editPolicyDescriptionError[index]
              : ""}
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} sm={12} style={{ marginBottom: "20px" }}>
          <Divider>or</Divider>
        </Col>
      </Row>
      <Row>
        <CSSTransition
          appear={isEditModeOn}
          in={isEditModeOn}
          timeout={{
            appear: 600,
            enter: 700,
            exit: 100,
          }}
          mountOnEnter
          classNames="step"
          unmountOnExit
        >
          <Col lg={6} sm={12} style={{ marginBottom: "20px" }}>
            <FileUploaderMain
              key={localKey}
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
              handleChange={handleUploadPolicyE}
              maxSize={25}
              setSizeError={() =>
                setFileSizeErrorE("Maximum file size allowed is 25MB")
              }
              id={`${index}-file-update`}
            />
          </Col>
        </CSSTransition>
        <Col
          lg={isEditModeOn ? 6 : 12}
          sm={12}
          style={{ marginBottom: "20px" }}
        >
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
            {previewE && "Uploaded file"}
          </div>

          {uploadedPolicyE || dataOfFile ? (
            <div className={styles.text_left + " " + styles.preview_box}>
              {previewE && (
                <div className={styles.each_preview_policy}>
                  <div>
                    <img
                      id="document-upload-logo"
                      height={"52px"}
                      width={"42px"}
                      className={styles.document_upload_logo}
                      src={document_upload}
                    />

                    <span
                      id="file-preview"
                      className={
                        global_style.blue +
                        " " +
                        styles.link +
                        " " +
                        global_style.ellipses
                      }
                      style={{ width: "100%" }}
                      onClick={() => window.open(previewE)}
                    >
                      {uploadedPolicyE?.name
                        ? uploadedPolicyE?.name
                        : dataOfFile
                        ? dataOfFile?.split("/").at(-1)
                        : ""}
                    </span>
                    <span id="file-size" className={global_style.light_text}>
                      {policySize && (policySize / 1000000).toFixed(2) + "MB"}
                    </span>
                  </div>
                  <CancelIcon
                    onClick={() => handleDeleteFile()}
                    style={{ cursor: "pointer" }}
                    fontSize="small"
                    id={`${index}-cancel-uploaded-file-icon`}
                  />
                </div>
              )}
            </div>
          ) : null}
          <div
            className={
              global_style.size14 +
              " " +
              global_style.error +
              " " +
              styles.text_left
            }
          >
            {editPolicyFileError[index]
              ? editPolicyFileError[index]
              : fileSizeErrorE}
          </div>
        </Col>
      </Row>
      <div
        style={{
          display: "flex",
          marginTop: "20px",
          justifyContent: "right",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <>
          <CustomDeletePopper
            DeleteItem={policyNameUnderAccordion}
            anchorEl={anchorEl}
            handleDelete={(e) => confirm(e, index)}
            id={"delete-popper-id"}
            open={open}
            closePopper={closePopper}
            deletePopperId={`${index}-delete-popper-policy-button`}
            cancelPopperId={`${index}-cancel-popper-policy-button`}
          />
          <Button
            className={
              global_style.secondary_button_error +
              " " +
              styles.delete_button_policy
            }
            onClick={handleDeletePopper}
            id="delete-button-policy"
          >
            Delete
          </Button>
        </>

        {isEditModeOn ? (
          <Button
            disabled={
              (uploadedPolicyE || dataOfFile || policyDesc !== "<p><br></p>") &&
              policyNameUnderAccordion
                ? false
                : true
            }
            onClick={(e) => handleSave(e)}
            className={global_style.primary_button + " " + styles.edit_button}
            id="save-button-policy"
          >
            {/* <a style={{ color: "white" }} href={data.file ? data.file : ""}> */}
            Save
            {/* </a> */}
          </Button>
        ) : (
          <Button
            onClick={(prev) => setEditModeOn(true)}
            className={global_style.outlined_button + " " + styles.edit_button}
            id="edit-button-policy"
          >
            {/* <a style={{ color: "white" }} href={data.file ? data.file : ""}> */}
            Edit
            {/* </a> */}
          </Button>
        )}
      </div>
    </div>
  );
}
export default AccordionBody;
