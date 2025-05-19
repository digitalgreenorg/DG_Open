import React, { useState, useContext, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import {
  TextField,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  Typography,
  Button,
} from "@material-ui/core";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import LocalStyle from "./Support.module.css";
import FileUploaderMain from "../Generic/FileUploader";
import document_upload from "../../Assets/Img/Farmstack V2.0/document_upload.svg";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import HTTPService from "../../Services/HTTPService";
import UrlConstants from "../../Constants/UrlConstants";
import {
  GetErrorKey,
  GetErrorHandlingRoute,
  getUserMapId,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "../../Utils/Common";
import { FarmStackContext } from "../Contexts/FarmStackContext";

export default function AskSupport(props) {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [queryField, setQueryField] = useState("");
  const [uploadedfile, setUploadedFile] = useState(null);
  const [titleError, setTitleError] = useState("");
  const [queryFieldError, setQueryFieldError] = useState("");
  const [fileError, setFileError] = useState("");
  const [key, setKey] = useState(0);
  const [preview, setPreview] = useState(null);
  const { callToast, callLoader } = useContext(FarmStackContext);
  const [filesizeError, setFileSizeError] = useState("");

  const handleChangeTitle = (e) => {
    setTitle(e.target.value.trimStart());
  };
  const handleUploadSupportFile = (file) => {
    setUploadedFile(file);
    setKey(key + 1);
    setFileError("");
    setFileSizeError("");
  };
  const handleCancelFile = () => {
    setUploadedFile(null);
    setPreview(null);
    setKey(key + 1);
    setFileError("");
    setFileSizeError("");
  };

  const handleClearForm = () => {
    if (isLoggedInUserCoSteward()) {
      history.push("/datahub/support");
    } else if (isLoggedInUserParticipant()) {
      history.push("/participant/support");
    }
    setTitle("");
    setSelectedCategory("");
    setQueryField("");
    setFileError("");
    setTitleError("");
    setQueryFieldError("");
    setKey(null);
    setPreview(null);
    setUploadedFile(null);
    setFileSizeError("");
  };

  const handleSupportViewRouteBreadCrumbs = () => {
    if (isLoggedInUserCoSteward()) {
      return `/datahub/support`;
    } else if (isLoggedInUserParticipant()) {
      return `/participant/support`;
    }
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    setTitleError("");
    setQueryFieldError("");
    setFileError("");
    setFileSizeError("");
    callLoader(true);

    var bodyFormData = new FormData();
    bodyFormData.append("ticket_title", title);
    bodyFormData.append("category", selectedCategory);
    bodyFormData.append("description", queryField);
    console.log(uploadedfile, "uploadedfile");
    if (uploadedfile) {
      bodyFormData.append("ticket_attachment", uploadedfile);
    }
    bodyFormData.append("user_map", getUserMapId());
    HTTPService(
      "POST",
      UrlConstants.base_url + UrlConstants.support_ticket,
      bodyFormData,
      true,
      true,
      false,
      false
    )
      .then((response) => {
        callLoader(false);
        console.log(response);
        if (response?.status == 201) {
          handleClearForm(true);
          callToast(
            "Your Ticket has been created successfully!",
            "success",
            true
          );
        }
      })
      .catch(async (e) => {
        callLoader(false);
        console.log(e);
        var returnValues = GetErrorKey(e, bodyFormData.keys());
        var errorKeys = returnValues[0];
        var errorMessages = returnValues[1];
        if (errorKeys.length > 0) {
          for (var i = 0; i < errorKeys.length; i++) {
            switch (errorKeys[i]) {
              case "ticket_title":
                setTitleError(errorMessages[i]);
                break;
              case "description":
                setQueryFieldError(errorMessages[i]);
                break;
              case "ticket_attachment":
                setFileError(errorMessages[i]);
                break;
              default:
                let error = GetErrorHandlingRoute(e);
                callToast(error?.message, "error", true);
                break;
            }
          }
        } else {
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
  useEffect(() => {
    if (!uploadedfile) {
      setPreview(undefined);
      return;
    }
    setFileError("");
    const objectUrl = URL.createObjectURL(uploadedfile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [uploadedfile]);

  return (
    <>
      <Row style={{ margin: "0 144px" }}>
        <Col>
          <div className="text-left mt-50">
            <span
              className="add_light_text cursor-pointer breadcrumbItem"
              data-testid="goback_to_support_page"
              onClick={() => history.push(handleSupportViewRouteBreadCrumbs())}
            >
              Support
            </span>
            <span className="add_light_text ml-16">
              <ArrowForwardIosIcon
                sx={{ fontSize: "14px !important", fill: "#00A94F" }}
              />
            </span>
            <span className="add_light_text ml-16 fw600">Ask Support</span>
          </div>
        </Col>
      </Row>
      <div className={LocalStyle.formAlign}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Typography
              className={`${GlobalStyle.size24} ${GlobalStyle.bold600}`}
              style={{ textAlign: "left", paddingLeft: "15px" }}
            >
              Ask Support
            </Typography>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6} md={6} xl={6}>
            <TextField
              id="support-title"
              className={LocalStyle.textFieldSupport}
              label="Title"
              fullWidth
              required
              variant="outlined"
              value={title}
              inputProps={{ maxLength: 50 }}
              onChange={(e) => handleChangeTitle(e)}
              error={titleError ? true : false}
              helperText={titleError ? titleError : ""}
            />
          </Col>
          <Col xs={12} sm={6} md={6} xl={6}>
            <FormControl
              required
              fullWidth
              className={LocalStyle.textFieldSupport}
              variant="outlined"
            >
              <InputLabel id="support-category"> Support Category</InputLabel>
              <Select
                required
                id="Support-category"
                data-testid={"component-under-test"}
                value={selectedCategory}
                name="Support Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Support Category"
                variant="outlined"
                style={{ textAlign: "left" }}
              >
                <MenuItem value={"certificate"} id="Certificate">
                  Certificate
                </MenuItem>
                <MenuItem value={"connectors"} id="connectors">
                  Connectors
                </MenuItem>
                <MenuItem value={"datasets"} id="datasets">
                  Datasets
                </MenuItem>
                <MenuItem value={"user_accounts"} id="User_accounts">
                  User_accounts
                </MenuItem>
                <MenuItem value={"usage_policy"} id="Usage_policy">
                  Usage_policy
                </MenuItem>
                <MenuItem value={"others"} id="Others">
                  Others
                </MenuItem>
              </Select>
            </FormControl>
          </Col>
        </Row>
        <Row>
          <Col lg={12} sm={12}>
            <TextField
              id="query-field_description"
              label="Describe your query"
              multiline
              required
              inputProps={{ maxLength: 512 }}
              fullWidth
              variant="outlined"
              minRows={4}
              placeholder="Category Description"
              className={LocalStyle.textFieldSupport}
              value={queryField}
              onChange={(e) => setQueryField(e.target.value.trimStart())}
              error={queryFieldError ? true : false}
              helperText={queryFieldError ? queryFieldError : ""}
            />
          </Col>
        </Row>
        <Row>
          <Col
            xs={12}
            sm={6}
            md={6}
            xl={6}
            style={{
              marginBottom: "20px",
              marginTop: "15px",
              maxWidth: "580px",
              marginLeft: "15px",
            }}
          >
            <FileUploaderMain
              key={key}
              isMultiple={false}
              texts={
                "Drop files here or click browse thorough your machine, supported files are JPEG, PNG, PDF, Doc and Docx file size not more than"
              }
              fileTypes={["pdf", "doc", "jpeg", "png", "docx"]}
              handleChange={handleUploadSupportFile}
              maxSize={2}
              setSizeError={() =>
                setFileSizeError("Maximum file size allowed is 2MB")
              }
              id="file_uploader-support"
            />
          </Col>
          <Col
            xs={12}
            sm={6}
            md={6}
            xl={6}
            style={{ marginBottom: "20px", marginTop: "15px" }}
          >
            <div
              className={
                GlobalStyle.bold600 +
                " " +
                GlobalStyle.font20 +
                " " +
                LocalStyle.text_left
              }
            >
              {uploadedfile && "List of uploaded files"}
            </div>
            {uploadedfile && (
              <div className={LocalStyle.text_left}>
                {uploadedfile && (
                  <div className={LocalStyle.each_preview_support}>
                    <div>
                      <img
                        id="document-logo"
                        height={"52px"}
                        width={"42px"}
                        className={LocalStyle.document_upload_logo}
                        src={document_upload}
                      />

                      <span
                        id="file-preview"
                        className={GlobalStyle.blue + " " + LocalStyle.link}
                        onClick={() => window.open(preview)}
                      >
                        {uploadedfile.name + " "}{" "}
                      </span>
                      <span id="filesize" className={GlobalStyle.light_text}>
                        {uploadedfile.size &&
                          (uploadedfile.size / 1000000).toFixed(2)}
                        MB
                      </span>
                    </div>
                    <CancelIcon
                      onClick={() => handleCancelFile()}
                      style={{ cursor: "pointer" }}
                      fontSize="small"
                      id="cancel-support-file"
                    />
                  </div>
                )}
              </div>
            )}
            <div
              className={
                GlobalStyle.size14 +
                " " +
                GlobalStyle.error +
                " " +
                LocalStyle.text_left
              }
            >
              {fileError ? fileError : filesizeError}
            </div>
          </Col>
        </Row>
        <Row>
          <Col style={{ textAlign: "right", margin: "20px" }}>
            <Button
              onClick={handleClearForm}
              className={`${GlobalStyle.outlined_button} ${LocalStyle.supportButton}`}
              id="cancel-button-support"
              variant="outlined"
              style={{ marginRight: "20px" }}
            >
              Cancel
            </Button>

            <Button
              disabled={queryField && title && selectedCategory ? false : true}
              onClick={(e) => handleCreateTicket(e)}
              className={`${GlobalStyle.primary_buttonSupport} ${LocalStyle.supportButton}`}
              id="Submit-button-support"
              variant="outlined"
            >
              Submit
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
}
