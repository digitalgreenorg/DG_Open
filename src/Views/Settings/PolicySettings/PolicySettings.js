import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import THEME_COLORS from "../../../Constants/ColorConstants";
import RichTextEditor from "react-rte";
import { FileUploader } from "react-drag-drop-files";
import LinearProgress from "@mui/material/LinearProgress";
import UploadPolicyFile from "./UploadPolicyFile";
import CancelIcon from "@mui/icons-material/Cancel";
import UrlConstant from "../../../Constants/UrlConstants";
import axios from "axios";
import Button from "@mui/material/Button";
import HTTPService from "../../../Services/HTTPService";
import HandleSessionTimeout, { getTokenLocal } from "../../../Utils/Common";
import { Link, useHistory } from "react-router-dom";
import Loader from "../../../Components/Loader/Loader";
import { GetErrorHandlingRoute } from "../../../Utils/Common";

const useStyles = {
  marginrowtop: { "margin-top": "20px" },
  marginrowtop8px: { "margin-top": "0px" },
};

export default function PolicySettings(props) {
  let accesstoken = getTokenLocal();
  const useStyles = {
    btncolor: {
      color: "white",
      "text-transform": "capitalize",
      "border-color": THEME_COLORS.THEME_COLOR,
      "background-color": THEME_COLORS.THEME_COLOR,
      float: "right",
      "border-radius": 0,
    },
    btn: {
      width: "420px",
      height: "42px",
      "margin-top": "30px",
      background: "#ffffff",
      opacity: "0.5",
      border: "2px solid #c09507",
      color: "black",
    },
    tabmargin: { "margin": "0px auto" },
    // marginrowtop: {"margin-top": "5%", "margin-bottom": "20px"},
    marginheading: { "margin-top": "2.5%", "margin-bottom": "1%" },
    marginrow: { "margin-bottom": "5%" },
    // marginrowtop50px: { "margin-top": "50px" },
    // marginrowtop10px: { "margin-top": "10px" },
    headingtext: {
      "font-weight": "700",
      "font-size": "20px",
      "margin-left": "15px",
      "font-family:": "Open Sans",
      "margin-top": "10px",
      "margin-bottom": "10px",
    },
    uploadMessage: {
      "font-family:": "Open Sans",
      "font-style": "normal",
      "font-weight": "400",
    },
    progress: { display: "flex" },
    progressbar: { "margin-left": "18%", width: "275px", flex: "3" },
    progresscancel: { "margin-top": "-3%", flex: "1" },
  };
  const toolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: [
      "INLINE_STYLE_BUTTONS",
      "BLOCK_TYPE_BUTTONS",
      //   "LINK_BUTTONS",
      "BLOCK_TYPE_DROPDOWN",
      //   "HISTORY_BUTTONS",
    ],
    INLINE_STYLE_BUTTONS: [
      { label: "Bold", style: "BOLD", className: "custom-css-class" },
      { label: "Italic", style: "ITALIC" },
      { label: "Underline", style: "UNDERLINE" },
    ],
    BLOCK_TYPE_DROPDOWN: [
      { label: "Normal", style: "unstyled" },
      { label: "Heading Large", style: "header-one" },
      { label: "Heading Medium", style: "header-two" },
      { label: "Heading Small", style: "header-three" },
    ],
    BLOCK_TYPE_BUTTONS: [
      { label: "UL", style: "unordered-list-item" },
      { label: "OL", style: "ordered-list-item" },
    ],
  };
  const fileTypes = ["doc", "pdf"];

  const [govLawDesc, setgovLawDesc] = useState("");
  const [govLawFile, setgovLawFile] = useState(null);

  const [warrantiesDesc, setWarrantiesDesc] = useState("");
  const [warrantiesFile, setwarrantiesfile] = useState(null);

  const [liabalityDesc, setLiabalityDesc] = useState("");
  const [liabalityFile, setliabalityfile] = useState(null);

  const [privacyDesc, setPrivacyDesc] = useState("");
  const [privacyFile, setprivacyfile] = useState(null);

  const [termDesc, setTermDesc] = useState("");
  const [termFile, settermfile] = useState(null);

  const [editorGovLawValue, setEditorGovLawValue] = React.useState(
    RichTextEditor.createValueFromString(govLawDesc, "html")
  );
  const [editorWarrantiesValue, seteditorWarrantiesValue] = React.useState(
    RichTextEditor.createValueFromString(warrantiesDesc, "html")
  );
  const [editorLiabalityValue, setEditorLiabalityValue] = React.useState(
    RichTextEditor.createValueFromString(liabalityDesc, "html")
  );
  const [editorPrivacyValue, setEditorPrivacyValue] = React.useState(
    RichTextEditor.createValueFromString(privacyDesc, "html")
  );
  const [editorTermValue, setEditorTermValue] = React.useState(
    RichTextEditor.createValueFromString(termDesc, "html")
  );
  const [govuploadProgress, setgovuploadProgress] = useState(0);
  const [warrantyloadProgress, setwarrantyloadProgress] = useState(0);
  const [liabiltyloadProgress, setliabiltyloadProgress] = useState(0);
  const [privacyProgress, setprivacyProgress] = useState(0);
  const [tosloadProgress, settosloadProgress] = useState(0);

  const [govLawFileUrl, setGovLawFileUrl] = useState("");
  const [warrantyFileUrl, setWarrantyFileUrl] = useState("");
  const [liabilityFileUrl, setLiabilityFileUrl] = useState("");
  const [privacyFileUrl, setPrivacyFileUrl] = useState("");
  const [termsFileUrl, setTermsFileUrl] = useState("");

  const [isPostMethod, setIsPostMethod] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  const history = useHistory();

  useEffect(() => {
    getPolicies();
  }, []);
  const getPolicies = () => {
    setIsLoader(true);
    HTTPService(
      "GET",
      UrlConstant.base_url + UrlConstant.policies_save_upload,
      "",
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("response : ", response.data);
        if (response.data.content == null && response.data.documents == null) {
          setIsPostMethod(true);
          console.log("post");
        }

        setGovLawFileUrl(
          response.data.documents ? response.data.documents.governing_law : ""
        );
        setTermsFileUrl(response.data.documents ? response.data.documents.tos : "");
        setPrivacyFileUrl(
          response.data.documents ? response.data.documents.privacy_policy : ""
        );
        setLiabilityFileUrl(
          response.data.documents ? response.data.documents.limitations_of_liabilities : ""
        );
        setWarrantyFileUrl(
          response.data.documents ? response.data.documents.warranty : ""
        );

        console.log("govLawFileUrl", govLawFileUrl);
        console.log(termsFileUrl);
        console.log("privacyFileUrl", privacyFileUrl);
        console.log("liabilityFileUrl", liabilityFileUrl);
        console.log("warrantyFileUrl", warrantyFileUrl);

        setgovLawDesc(
          response.data.content ? response.data.content.governing_law : ""
        );
        setPrivacyDesc(
          response.data.content ? response.data.content.privacy_policy : ""
        );
        setTermDesc(response.data.content ? response.data.content.tos : "");
        setLiabalityDesc(
          response.data.content
            ? response.data.content.limitations_of_liabilities
            : ""
        );
        setWarrantiesDesc(
          response.data.content ? response.data.content.warranty : ""
        );

        // console.log('govLawDesc',govLawDesc)
        // console.log('privacyDesc',privacyDesc)
        // console.log('termDesc',termDesc)
        // console.log('liabalityDesc',liabalityDesc)
        // console.log('warrantiesDesc',warrantiesDesc)

        setEditorGovLawValue(
          RichTextEditor.createValueFromString(
            response.data.content ?
              response.data.content.governing_law : "",
            "html"
          )
        );
        setEditorPrivacyValue(
          RichTextEditor.createValueFromString(
            response.data.content ?
              response.data.content.privacy_policy : "",
            "html"
          )
        );
        setEditorTermValue(
          RichTextEditor.createValueFromString(
            response.data.content ? response.data.content.tos : "",
            "html"
          )
        );
        setEditorLiabalityValue(
          RichTextEditor.createValueFromString(
            response.data.content
              ? response.data.content.limitations_of_liabilities
              : "",
            "html"
          )
        );
        seteditorWarrantiesValue(
          RichTextEditor.createValueFromString(
            response.data.content ? response.data.content.warranty : "",
            "html"
          )
        );
      })
      .catch((e) => {
        setIsLoader(false);
        console.log(e);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  const handlegovLawChange = (value) => {
    setEditorGovLawValue(value);
    setgovLawDesc(value.toString("html"));
    console.log(value.toString("html"));
  };

  const handleWarrantiesChange = (value) => {
    seteditorWarrantiesValue(value);
    setWarrantiesDesc(value.toString("html"));
    console.log(warrantiesDesc.toString());
  };

  const handleLiabalityChange = (value) => {
    setEditorLiabalityValue(value);
    setLiabalityDesc(value.toString("html"));
    console.log(value.toString("html"));
  };

  const handlePrivacyChange = (value) => {
    setEditorPrivacyValue(value);
    setPrivacyDesc(value.toString("html"));
    console.log(value.toString("html"));
  };

  const handleTermChange = (value) => {
    setEditorTermValue(value);
    setTermDesc(value.toString("html"));
    console.log(value.toString("html"));
  };

  const handlegovLawFileChange = async (file) => {
    setgovLawFile(file);
    setGovLawFileUrl("");
    console.log(file);

    const options = {
      onUploadProgress: (progressEvent) => {
        console.log(progressEvent.loaded);
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        console.log(`${loaded}kb of ${total}kb | ${percent}%`);
        setgovuploadProgress(percent);
      },
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${accesstoken}`,
      },
    };

    var bodyFormData = new FormData();
    bodyFormData.append("governing_law", file);

    console.log("branding data", bodyFormData);
    let url = UrlConstant.base_url + UrlConstant.policies_files_upload;

    if (file.size < 2097152) {
      await axios
        .post(url, bodyFormData, options)
        .then((response) => {
          console.log("response");
          console.log("governing law details", response.data);
          //   console.log(response.json());
          console.log(response.status);
          if (response.status === 201) {
            // setEmail(false);
            // setError(false);
          } else {
            // setError(true);
          }
        })
        .catch((e) => {
          console.log(e);
          //   setError(true);
        });
    }
  };
  const handlegovupCancel = async (e) => {
    console.log("clicked on gov up cancel btn");
    let url = UrlConstant.base_url + UrlConstant.delete_policies_drop_document;

    await axios
      .delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accesstoken}`,
        },
        data: { id: "governing_law" },
      })
      .then((response) => {
        console.log("response");
        console.log("tos", response.data);
        //   console.log(response.json());
        console.log(response.status);
        if (response.status === 204) {
          console.log("gov law delete success");
          setgovLawFile(null);
          setgovuploadProgress(0);
          setGovLawFileUrl("")
          // setEmail(false);
          // setError(false);
        } else {
          // setError(true);
        }
      })
      .catch((e) => {
        console.log(e);
        //   setError(true);
      });
  };
  const handlewarrantiesFileChange = async (file) => {
    setwarrantiesfile(file);
    setWarrantyFileUrl("");
    console.log(file);

    const options = {
      onUploadProgress: (progressEvent) => {
        console.log(progressEvent.loaded);
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        console.log(`${loaded}kb of ${total}kb | ${percent}%`);
        setwarrantyloadProgress(percent);
      },
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${accesstoken}`,
      },
    };

    var bodyFormData = new FormData();
    bodyFormData.append("warranty", file);

    console.log("warranty", bodyFormData);
    let url = UrlConstant.base_url + UrlConstant.policies_files_upload;

    if (file.size < 2097152) {
      await axios
        .post(url, bodyFormData, options)
        .then((response) => {
          console.log("response");
          console.log("warranty", response.data);
          //   console.log(response.json());
          console.log(response.status);
          if (response.status === 201) {
            // setEmail(false);
            // setError(false);
          } else {
            // setError(true);
          }
        })
        .catch((e) => {
          console.log(e);
          //   setError(true);
        });
    }
  };
  const handlewarrantyCancel = async (e) => {
    console.log("clicked on warranties cancel btn");
    let url = UrlConstant.base_url + UrlConstant.delete_policies_drop_document;

    await axios
      .delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accesstoken}`,
        },
        data: { id: "warranty" },
      })
      .then((response) => {
        console.log("response");
        console.log("tos", response.data);
        //   console.log(response.json());
        console.log(response.status);
        if (response.status === 204) {
          console.log("warranty delete success");
          // setEmail(false);
          setwarrantiesfile(null);
          setwarrantyloadProgress(0);
          setWarrantyFileUrl("");
          // setError(false);
        } else {
          // setError(true);
        }
      })
      .catch((e) => {
        console.log(e);
        //   setError(true);
      });
  };
  const handleliabalityFileChange = async (file) => {
    setliabalityfile(file);
    setLiabilityFileUrl("");
    console.log(file);

    const options = {
      onUploadProgress: (progressEvent) => {
        console.log(progressEvent.loaded);
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        console.log(`${loaded}kb of ${total}kb | ${percent}%`);
        setliabiltyloadProgress(percent);
      },
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${accesstoken}`,
      },
    };

    var bodyFormData = new FormData();
    bodyFormData.append("limitations_of_liabilities", file);

    console.log("limitations_of_liabilities", bodyFormData);
    let url = UrlConstant.base_url + UrlConstant.policies_files_upload;

    if (file.size < 2097152) {
      await axios
        .post(url, bodyFormData, options)
        .then((response) => {
          console.log("response");
          console.log("limitations_of_liabilities", response.data);
          //   console.log(response.json());
          console.log(response.status);
          if (response.status === 201) {
            // setEmail(false);
            // setError(false);
          } else {
            // setError(true);
          }
        })
        .catch((e) => {
          console.log(e);
          //   setError(true);
        });
    }
  };

  const handleliabiltyCancel = async (e) => {
    console.log("clicked on liability cancel btn");
    let url = UrlConstant.base_url + UrlConstant.delete_policies_drop_document;

    await axios
      .delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accesstoken}`,
        },
        data: { id: "limitations_of_liabilities" },
      })
      .then((response) => {
        console.log("response");
        console.log("tos", response.data);
        //   console.log(response.json());
        console.log(response.status);
        if (response.status === 204) {
          console.log("warranty delete success");
          // setEmail(false);
          setliabalityfile(null);
          setliabiltyloadProgress(0);
          setLiabilityFileUrl("");
          // setError(false);
        } else {
          // setError(true);
        }
      })
      .catch((e) => {
        console.log(e);
        //   setError(true);
      });
  };

  const handleprivacyFileChange = async (file) => {
    setprivacyfile(file);
    setPrivacyFileUrl("");
    console.log(file);

    const options = {
      onUploadProgress: (progressEvent) => {
        console.log(progressEvent.loaded);
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        console.log(`${loaded}kb of ${total}kb | ${percent}%`);
        setprivacyProgress(percent);
      },
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${accesstoken}`,
      },
    };

    var bodyFormData = new FormData();
    bodyFormData.append("privacy_policy", file);

    console.log("privacy_policy", bodyFormData);
    let url = UrlConstant.base_url + UrlConstant.policies_files_upload;

    if (file.size < 2097152) {
      await axios
        .post(url, bodyFormData, options)
        .then((response) => {
          console.log("response");
          console.log("privacy_policy", response.data);
          //   console.log(response.json());
          console.log(response.status);
          if (response.status === 201) {
            // setEmail(false);
            // setError(false);
          } else {
            // setError(true);
          }
        })
        .catch((e) => {
          console.log(e);
          //   setError(true);
        });
    }
  };
  const handleprivacyCancel = async (e) => {
    console.log("clicked on privacy cancel btn");
    let url = UrlConstant.base_url + UrlConstant.delete_policies_drop_document;

    await axios
      .delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accesstoken}`,
        },
        data: { id: "privacy_policy" },
      })
      .then((response) => {
        console.log("response");
        console.log("tos", response.data);
        //   console.log(response.json());
        console.log(response.status);
        if (response.status === 204) {
          console.log("warranty delete success");
          // setEmail(false);
          setprivacyfile(null);
          setprivacyProgress(0);
          setPrivacyFileUrl("");
          // setError(false);
        } else {
          // setError(true);
        }
      })
      .catch((e) => {
        console.log(e);
        //   setError(true);
      });
  };
  const handletermFileChange = async (file) => {
    settermfile(file);
    setTermsFileUrl("");
    console.log(file);

    const options = {
      onUploadProgress: (progressEvent) => {
        console.log(progressEvent.loaded);
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        console.log(`${loaded}kb of ${total}kb | ${percent}%`);
        settosloadProgress(percent);
      },
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${accesstoken}`,
      },
    };

    var bodyFormData = new FormData();
    bodyFormData.append("tos", file);

    console.log("tos", bodyFormData);
    let url = UrlConstant.base_url + UrlConstant.policies_files_upload;

    if (file.size < 2097152) {
      await axios
        .post(url, bodyFormData, options)
        .then((response) => {
          console.log("response");
          console.log("tos", response.data);
          //   console.log(response.json());
          console.log(response.status);
          if (response.status === 201) {
            // setEmail(false);
            // setError(false);
          } else {
            // setError(true);
          }
        })
        .catch((e) => {
          console.log(e);
          //   setError(true);
        });
    }
  };
  const handletosCancel = async (e) => {
    console.log("clicked on tos cancel btn");
    let url = UrlConstant.base_url + UrlConstant.delete_policies_drop_document;

    await axios
      .delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accesstoken}`,
        },
        data: { id: "tos" },
      })
      .then((response) => {
        console.log("response");
        console.log("tos", response.data);
        //   console.log(response.json());
        console.log(response.status);
        if (response.status === 204) {
          console.log("warranty delete success");
          // setEmail(false);
          settermfile(null);
          settosloadProgress(0);
          setTermsFileUrl("");
          // setError(false);
        } else {
          // setError(true);
        }
      })
      .catch((e) => {
        console.log(e);
        //   setError(true);
      });
  };
  const handlePoliciesSubmit = async (e) => {
    e.preventDefault();
    let url = UrlConstant.base_url + UrlConstant.policies_save_upload;
    var bodyFormData = new FormData();
    bodyFormData.append("privacy_policy", privacyDesc);
    bodyFormData.append("tos", termDesc);
    bodyFormData.append("governing_law", govLawDesc);
    bodyFormData.append("limitations_of_liabilities", liabalityDesc);
    bodyFormData.append("warranty", warrantiesDesc);
    // console.log(setprivacydesc);

    console.log(accesstoken);
    if (isPostMethod) {
      await axios
        .post(url, bodyFormData, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${accesstoken}`,
          },
        })
        .then((response) => {
          console.log("response");
          console.log("tos", response.data);
          //   console.log(response.json());
          console.log(response.status);
          if (response.status === 201) {
            console.log("submitted form");
            props.setisPolicyUpdateSuccess();
          } else {
            // setError(true);
          }
        })
        .catch((e) => {
          console.log(e);
          //   setError(true);
        });
      setIsPostMethod(false);
    } else {
      await axios
        .put(url, bodyFormData, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: `Bearer ${accesstoken}`,
          },
        })
        .then((response) => {
          console.log("response");
          console.log("tos", response.data);
          //   console.log(response.json());
          console.log(response.status);
          if (response.status === 201) {
            console.log("submitted form");
            props.setisPolicyUpdateSuccess();
          } else {
            // setError(true);
          }
        })
        .catch((e) => {
          console.log(e);
          //   setError(true);
        });
    }
  };

  const policysettingcancelbtn = () => {
    getPolicies();
    history.push("/datahub/settings/3");
    window.location.reload();
  };

  return (
    <div style={useStyles.tabmargin}>
      {isLoader ? <Loader /> : ""}
      <form noValidate autoComplete="off" onSubmit={handlePoliciesSubmit}>
        <Row style={useStyles.marginheading}>
          <span style={useStyles.headingtext}>Upload content *</span>
        </Row>
        <Row style={useStyles.marginrow}>
          <Col xs="12" sm="6" md="6" lg="6">
            <div className="invite-participant-text-editor policyrte">
              <RichTextEditor
                toolbarConfig={toolbarConfig}
                value={editorGovLawValue}
                onChange={handlegovLawChange}
                required
                id="body-text"
                name="bodyText"
                type="string"
                multiline
                variant="filled"
                style={{
                  minHeight: 410,
                  //   width: 420,
                  border: "1px solid black",
                  //   zIndex: 4,
                }}
              />
            </div>
          </Col>
          <Col xs="12" sm="6" md="6" lg="6">
            <FileUploader
              handleChange={handlegovLawFileChange}
              name="file"
              types={fileTypes}
              children={
                <UploadPolicyFile
                  uploaddes="Supports: .doc, .pdf not more than 2MB file size"
                  uploadtitle="Upload governing laws (Required)"
                />
              }
            />
            {/* <p className="filename"> */}
            <p style={useStyles.uploadMessage}>
              {govLawFile ? (
                govLawFile.size ? (
                  `File name: ${govLawFile.name}`
                ) : (
                  ""
                )
              ) : govLawFileUrl ? (
                <Link
                  to={{ pathname: UrlConstant.base_url + govLawFileUrl }}
                  target="_blank">
                  Governing laws
                </Link>
              ) : (
                "No file uploaded yet"
              )}
            </p>
            {/* <p className="oversizemb"> */}
            <p>
              {govLawFile != null && govLawFile.size > 2097152
                ? "File uploaded is more than 2MB!"
                : ""}
            </p>
            {/* <div className="govlawprogress"> */}
            <div style={useStyles.progress}>
              <div style={useStyles.progressbar}>
                <LinearProgress
                  variant="determinate"
                  value={govLawFileUrl ? 100 : govuploadProgress}
                  color="success"
                />
                <p className="govupper">{govLawFileUrl ? "100" : govuploadProgress}%</p>
                {/* <p>{govuploadProgress}%</p> */}
              </div>
              {/* <p className="govupclose"> */}
              <div style={useStyles.progresscancel}>
                <p>
                  {(govLawFileUrl || govLawFile) &&
                    <CancelIcon onClick={handlegovupCancel} />}
                </p>
              </div>
            </div>
          </Col>
        </Row>
        <Row style={useStyles.marginrow}>
          <Col xs="12" sm="6" md="6" lg="6">
            <div className="invite-participant-text-editor policyrte">
              <RichTextEditor
                toolbarConfig={toolbarConfig}
                value={editorWarrantiesValue}
                onChange={handleWarrantiesChange}
                required
                id="body-text"
                name="bodyText"
                type="string"
                multiline
                variant="filled"
                style={{
                  minHeight: 450,
                  width: 420,
                  border: "1px solid black",
                  zIndex: 4,
                }}
              />
            </div>
          </Col>
          <Col xs="12" sm="6" md="6" lg="6">
            <FileUploader
              handleChange={handlewarrantiesFileChange}
              name="file"
              types={fileTypes}
              children={
                <UploadPolicyFile
                  uploaddes="Supports: .doc, .pdf not more than 2MB file size"
                  uploadtitle="Upload warranties (Required) "
                />
              }
            // maxSize={2}
            />
            {/* <p className="filename"> */}
            <p style={useStyles.uploadMessage}>
              {warrantiesFile ? (
                warrantiesFile.size ? (
                  `File name: ${warrantiesFile.name}`
                ) : (
                  ""
                )
              ) : warrantyFileUrl ? (
                <a href={UrlConstant.base_url + warrantyFileUrl}>Warranties</a>
              ) : (
                "No file uploaded yet"
              )}
            </p>
            {/* <p className="oversizemb"> */}
            <p>
              {warrantiesFile != null && warrantiesFile.size > 2097152
                ? "File uploaded is more than 2MB!"
                : ""}
            </p>
            {/* <div className="warrantyprogress"> */}
            <div style={useStyles.progress}>
              <div style={useStyles.progressbar}>
                <LinearProgress
                  variant="determinate"
                  value={warrantyFileUrl ? 100 : warrantyloadProgress}
                  color="success"
                />
                {/* <p className="warrantyper">{warrantyloadProgress}%</p> */}
                <p>{warrantyFileUrl ? "100" : warrantyloadProgress}%</p>
              </div>
              <div style={useStyles.progresscancel}>
                {/* <p className="warrantyclose"> */}
                <p>
                  {(warrantyFileUrl || warrantiesFile) && (
                    <CancelIcon onClick={handlewarrantyCancel} />
                  )}
                </p>
              </div>
            </div>
          </Col>
        </Row>
        <Row style={useStyles.marginrow}>
          <Col xs="12" sm="6" md="6" lg="6">
            <div className="invite-participant-text-editor policyrte">
              <RichTextEditor
                toolbarConfig={toolbarConfig}
                value={editorLiabalityValue}
                onChange={handleLiabalityChange}
                required
                id="body-text"
                name="bodyText"
                type="string"
                multiline
                variant="filled"
                style={{
                  minHeight: 410,
                  width: 420,
                  border: "1px solid black",
                  zIndex: 4,
                }}
              />
            </div>
          </Col>
          <Col xs="12" sm="6" md="6" lg="6">
            <FileUploader
              handleChange={handleliabalityFileChange}
              name="file"
              types={fileTypes}
              children={
                <UploadPolicyFile
                  uploaddes="Supports: .doc, .pdf not more than 2MB file size"
                  uploadtitle="Upload limitations of liabilities (Required) "
                />
              }
            // maxSize={2}
            />
            {/* <p className="filename"> */}
            <p style={useStyles.uploadMessage}>
              {liabalityFile ? (
                liabalityFile.size ? (
                  `File name: ${liabalityFile.name}`
                ) : (
                  ""
                )
              ) : liabilityFileUrl ? (
                <a
                  href={UrlConstant.base_url + liabilityFileUrl}
                  target="_blank">
                  Limitations of liabilities
                </a>
              ) : (
                "No file uploaded yet"
              )}
            </p>
            {/* <p className="oversizemb"> */}
            <p>
              {liabalityFile != null && liabalityFile.size > 2097152
                ? "File uploaded is more than 2MB!"
                : ""}
            </p>
            {/* <div className="liabiltyprogress"> */}
            <div style={useStyles.progress}>
              <div style={useStyles.progressbar}>
                <LinearProgress
                  variant="determinate"
                  value={liabilityFileUrl ? 100 : liabiltyloadProgress}
                  color="success"
                />
                <p className="liabiltyper">{liabilityFileUrl ? "100" : liabiltyloadProgress}%</p>
              </div>
              <div style={useStyles.progresscancel}>
                {/* <p className="liabiltyclose"> */}
                <p>
                  {(liabilityFileUrl || liabalityFile) && (
                    <CancelIcon onClick={handleliabiltyCancel} />
                  )}
                </p>
              </div>
            </div>
          </Col>
        </Row>
        <Row style={useStyles.marginrow}>
          <Col xs="12" sm="6" md="6" lg="6">
            <div className="invite-participant-text-editor policyrte">
              <RichTextEditor
                toolbarConfig={toolbarConfig}
                value={editorPrivacyValue}
                onChange={handlePrivacyChange}
                required
                id="body-text"
                name="bodyText"
                type="string"
                multiline
                variant="filled"
                style={{
                  minHeight: 410,
                  width: 420,
                  border: "1px solid black",
                  zIndex: 4,
                }}
              />
            </div>
          </Col>
          <Col xs="12" sm="6" md="6" lg="6">
            <FileUploader
              handleChange={handleprivacyFileChange}
              name="file"
              types={fileTypes}
              children={
                <UploadPolicyFile
                  uploaddes="Supports: .doc, .pdf not more than 2MB file size"
                  uploadtitle="Upload privacy policy (Required) "
                />
              }
            // maxSize={2}
            />
            {/* <p className="filename"> */}
            <p style={useStyles.uploadMessage}>
              {privacyFile ? (
                privacyFile.size ? (
                  `File name: ${privacyFile.name}`
                ) : (
                  ""
                )
              ) : privacyFileUrl ? (
                <a href={UrlConstant.base_url + privacyFileUrl} target="_blank">
                  Privacy policy
                </a>
              ) : (
                "No file uploaded yet"
              )}
            </p>
            {/* <p className="oversizemb"> */}
            <p>
              {privacyFile != null && privacyFile.size > 2097152
                ? "File uploaded is more than 2MB!"
                : ""}
            </p>
            <div style={useStyles.progress}>
              {/* <div className="privacyprogress"> */}
              <div style={useStyles.progressbar}>
                <LinearProgress
                  variant="determinate"
                  value={privacyFileUrl ? 100 : privacyProgress}
                  color="success"
                />
                <p className="privacyper">{privacyFileUrl ? "100" : privacyProgress}%</p>
              </div>
              <div style={useStyles.progresscancel}>
                {/* <p className="privacyclose"> */}
                <p>
                  {(privacyFile || privacyFileUrl) && <CancelIcon onClick={handleprivacyCancel} />}
                </p>
              </div>
            </div>
          </Col>
        </Row>
        <Row style={useStyles.marginrow}>
          <Col xs="12" sm="6" md="6" lg="6">
            <div className="invite-participant-text-editor policyrte">
              <RichTextEditor
                toolbarConfig={toolbarConfig}
                value={editorTermValue}
                onChange={handleTermChange}
                required
                id="body-text"
                name="bodyText"
                type="string"
                multiline
                variant="filled"
                style={{
                  minHeight: 410,
                  width: 420,
                  border: "1px solid black",
                  zIndex: 4,
                }}
              />
            </div>
          </Col>
          <Col xs="12" sm="6" md="6" lg="6">
            <FileUploader
              handleChange={handletermFileChange}
              name="file"
              types={fileTypes}
              children={
                <UploadPolicyFile
                  uploaddes="Supports: .doc, .pdf not more than 2MB file size"
                  uploadtitle="Upload terms of use (Required)"
                />
              }
            // maxSize={2}
            />
            {/* <p className="filename"> */}
            <p style={useStyles.uploadMessage}>
              {termFile ? (
                termFile.size ? (
                  `File name: ${termFile.name}`
                ) : (
                  ""
                )
              ) : termsFileUrl ? (
                <a href={UrlConstant.base_url + termsFileUrl} target="_blank">
                  Terms of use
                </a>
              ) : (
                "No file uploaded yet"
              )}
            </p>
            {/* <p className="oversizemb"> */}
            <p>
              {termFile != null && termFile.size > 2097152
                ? "File uploaded is more than 2MB!"
                : ""}
            </p>
            <div style={useStyles.progress}>
              {/* <div className="tosprogress"> */}
              <div style={useStyles.progressbar}>
                <LinearProgress
                  variant="determinate"
                  value={termsFileUrl ? 100 : tosloadProgress}
                  color="success"
                />
                <p className="tosper">{termsFileUrl ? "100" : tosloadProgress}%</p>
              </div>
              <div style={useStyles.progresscancel}>
                {/* <p className="tosclose"> */}
                <p>{(termFile || termsFileUrl) && <CancelIcon onClick={handletosCancel} />}</p>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={3}></Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            {editorGovLawValue.getEditorState().getCurrentContent().hasText() &&
              (govLawFile || govLawFileUrl) &&
              editorWarrantiesValue
                .getEditorState()
                .getCurrentContent()
                .hasText() &&
              (warrantiesFile || warrantyFileUrl) &&
              editorLiabalityValue
                .getEditorState()
                .getCurrentContent()
                .hasText() &&
              (liabalityFile || liabilityFileUrl) &&
              editorPrivacyValue.getEditorState().getCurrentContent().hasText() &&
              (privacyFile || privacyFileUrl) &&
              editorTermValue.getEditorState().getCurrentContent().hasText() &&
              (termFile || termsFileUrl) ? (
              <Button
                variant="contained"
                style={{ textTransform: "none" }}
                className="submitbtn"
                type="submit">
                <span
                  className="signupbtnname"
                  style={{ textTransform: "none" }}>
                  Submit
                </span>
              </Button>
            ) : (
              <Button
                variant="outlined"
                style={{ textTransform: "none" }}
                disabled
                className="disbalesubmitbtn">
                Submit
              </Button>
            )}
          </Col>
        </Row>
        <Row style={useStyles.marginrowtop8px}>
          <Col xs={12} sm={12} md={6} lg={3}></Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            <Button
              variant="outlined"
              className="cancelbtn"
              type="button"
              style={{ textTransform: "none" }}
              onClick={policysettingcancelbtn}>
              Cancel
            </Button>
          </Col>
        </Row>
      </form>
    </div>
  );
}
