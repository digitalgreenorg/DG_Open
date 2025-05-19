import React, { useContext, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Col, Row } from "react-bootstrap";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "../../Services/HTTPService";
import { FarmStackContext } from "../../Components/Contexts/FarmStackContext";
import { getUserMapId } from "../../Utils/Common";

const Generate = ({
  userType,
  resourceId,
  getResource,
  isOther,
  usagePolicies,
}) => {
  const { callLoader, callToast } = useContext(FarmStackContext);
  const [showGenerateApi, setShowGenerateApi] = React.useState(false);
  const [endPointUrl, setEndPointUrl] = React.useState(
    `${UrlConstant.base_url}microsite/datasets_file/resource/`
  );
  const [apiKey, setApiKey] = React.useState("");
  const [isEmbeddings, setIsEmbeddings] = React.useState(false);
  const [approvalType, setApprovalType] = React.useState("");
  const [copiedMessage, setCopiedMessage] = React.useState("");

  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // callToast(`Text copied to clipboard: ${text}`, "info", true);
        setCopiedMessage("copied to clipboard!");
        console.log("Text copied to clipboard:", text);
      })
      .catch((error) => {
        callToast(`Text copied to clipboard: ${text}`, "error", true);
        console.error("Error copying text to clipboard:", error);
      });
  }
  const createCurl = (api, curlUrl) => {
    let url = curlUrl ? curlUrl : endPointUrl;
    let curl = `curl --location '${url}' \
    --header 'api-key: ${api}'`;
    copyToClipboard(curl);
  };

  const generateToken = async () => {
    let url = UrlConstant.base_url + UrlConstant.resource_ask_for_permission;
    let body = {
      user_organization_map: getUserMapId(),
      resource: resourceId,
      type: isEmbeddings ? "embeddings" : "resource",
    };
    callLoader(true);
    console.log("🚀 ~ generateToken ~ body:", body);

    await HTTPService(
      "POST",
      url,
      body,
      false,
      userType === "guest" ? false : true
    )
      .then((response) => {
        console.log("🚀 ~ .then ~ response:", response);
        callLoader(false);
        getResource();
      })
      .catch((err) => {
        callLoader(false);
        callToast("Something went wrong while recalling.", "error", true);
      });
  };

  useEffect(() => {
    if (usagePolicies?.length) {
      let isResourceApproved = usagePolicies?.some(
        (policy) => policy.approval_status === "approved"
      );
      let isResourceRequested = usagePolicies.some(
        (policy) => policy.approval_status === "requested"
      );
      let isResourceRejected = usagePolicies.some(
        (policy) => policy.approval_status === "rejected"
      );
      if (isResourceApproved) {
        const approvedPolicy = usagePolicies.find(
          (policy) => policy.approval_status === "approved"
        );
        if (approvedPolicy) {
          let api_key = approvedPolicy?.api_key;
          setApiKey(api_key);
        }
        setApprovalType("approved");
      } else if (isResourceRequested) {
        setApprovalType("requested");
      } else if (isResourceRejected) {
        setApprovalType("rejected");
      }
    }
  }, []);

  useEffect(() => {
    if (copiedMessage) {
      const timer = setTimeout(() => {
        setCopiedMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [copiedMessage]);

  return (
    <Box>
      <Row>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          style={{
            marginTop: "30px",
            marginBottom: showGenerateApi ? "30px" : "0px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={6}
            sx={{
              padding: "65px !important",
              width: "670px",
              border: "dotted",
            }}
          >
            {approvalType === "approved" ? (
              <>
                <Typography
                  sx={{
                    textAlign: "left",
                    fontSize: "20px",
                    fontFamily: "Montserrat",
                    fontWeight: 600,
                  }}
                >
                  Generate API
                </Typography>
                <TextField
                  fullWidth
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
                  placeholder={`Endpoint URL Preview`}
                  label={`Endpoint URL Preview`}
                  value={endPointUrl}
                  disabled={true}
                  required
                  onChange={(e) => {
                    if (e.target.value.toString().length) {
                      setEndPointUrl(e.target.value.trimStart());
                    }
                  }}
                  id="add-dataset-name"
                />
                <TextField
                  fullWidth
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
                  placeholder={`API Key`}
                  label={`API Key`}
                  value={apiKey}
                  required
                  onChange={(e) => {
                    if (e.target.value.toString().length) {
                      setApiKey(e.target.value.trimStart());
                    }
                  }}
                  id="add-dataset-name"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <img
                          src={require("../../Assets/Img/copy.svg")}
                          style={{ cursor: "pointer" }}
                          onClick={() => copyToClipboard(apiKey)}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                {copiedMessage && (
                  <Typography
                    sx={{
                      marginTop: "12px",
                      textAlign: "left",
                      color: "#218F76",
                      fontWeight: 600,
                    }}
                  >
                    {copiedMessage}
                  </Typography>
                )}
                <Divider
                  sx={{ marginTop: "25px", border: "1px solid #E5E7EB" }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                    gap: "20px",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    sx={{
                      background: "#01A94F",
                      color: "#FFF",
                      textTransform: "none",
                      height: "42px",
                      fontFamily: "Montserrat",
                      width: "180px",
                      borderRadius: "100px",
                      ":hover": {
                        background: "#01A94F",
                      },
                    }}
                    onClick={() => createCurl(apiKey)}
                  >
                    Copy Curl
                  </Button>
                  <Button
                    sx={{
                      background: "#f7917a",
                      color: "#FFF",
                      textTransform: "none",
                      height: "42px",
                      width: "180px",
                      fontFamily: "Montserrat",
                      borderRadius: "100px",
                      ":hover": {
                        background: "#f7917a",
                      },
                    }}
                    onClick={() =>
                      createCurl(
                        apiKey,
                        `${UrlConstant.base_url}microsite/datasets_file/resource_bot/?query=PASS_YOUR_QUERY`
                      )
                    }
                  >
                    Copy Chat Query Curl
                  </Button>
                </div>
              </>
            ) : (
              approvalType === "requested" && "Request has already been sent."
            )}
            {!usagePolicies?.length || approvalType === "rejected" ? (
              <>
                <Box>
                  <InfoIcon />
                </Box>
                <Typography
                  className="mt10"
                  sx={{ color: "#A3B0B8", fontSize: "13px" }}
                >
                  Click on{" "}
                  <strong>
                    {" "}
                    {isOther ? "Request access token" : "Generate Token"}
                  </strong>{" "}
                  {isOther
                    ? "to create an access request."
                    : "to view API details."}
                </Typography>
                {!showGenerateApi && (
                  <>
                    <Box sx={{ marginTop: "12px" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{
                              "&.Mui-checked": {
                                // color: "#4759FF !important",
                              },
                              "& .MuiSvgIcon-root": {
                                // fill: "#4759FF",
                              },
                            }}
                            defaultChecked={true}
                            checked={isEmbeddings}
                            onChange={() => setIsEmbeddings(!isEmbeddings)}
                          />
                        }
                        label="With Embeddings"
                        sx={{
                          ".MuiFormControlLabel-label": {
                            color: "darkslategrey",
                            fontSize: "15px",
                          },
                        }}
                      />
                    </Box>
                    <Button
                      sx={{
                        background: "#01A94F",
                        color: "#FFF",
                        textTransform: "none",
                        height: "30px",
                        fontFamily: "Montserrat",
                        borderRadius: "100px",
                        padding: "25px 45px",
                        marginTop: "5px",
                        ":hover": {
                          background: "#01A94F",
                        },
                      }}
                      onClick={() => generateToken()}
                    >
                      {isOther ? "Request access token" : "Generate Token"}
                    </Button>
                  </>
                )}
              </>
            ) : (
              <></>
            )}
          </Paper>
        </Col>
      </Row>
    </Box>
  );
};

export default Generate;
