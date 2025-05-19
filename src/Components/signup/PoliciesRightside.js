import React, { useState } from "react";
import "./PoliciesRightside.css";
import RichTextEditor from "react-rte";
import { FileUploader } from "react-drag-drop-files";
import UploadOrgLogo from "./UploadOrgLogo";
import Button from "@mui/material/Button";

import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import UrlConstant from "../../Constants/UrlConstants";
import CancelIcon from "@mui/icons-material/Cancel";
import { useHistory } from "react-router-dom";
import { GetErrorHandlingRoute } from "../../Utils/Common";
import Footer from "../Footer/Footer";

export default function PoliciesRightside(props) {
  const [govLawdesc, setgovLawdesc] = useState("");
  const [govLawfile, setgovLawFile] = useState(null);
  const [govLawdescbtn, setGovLawdescbtn] = useState(false);

  const [warrantiesdesc, setwarrantiesdesc] = useState("");
  const [warrantiesfile, setwarrantiesfile] = useState(null);
  const [warrantiesdescbtn, setWarrantiesdescbtn] = useState(false);

  const [liabalitydesc, setliabalitydesc] = useState("");
  const [liabalityfile, setliabalityfile] = useState(null);
  const [liabalitydescbtn, setLiabalitydescbtn] = useState(false);

  const [privacydesc, setprivacydesc] = useState("");
  const [privacyfile, setprivacyfile] = useState(null);
  const [privacydescbtn, setPrivacydescbtn] = useState(false);

  const [termdesc, settermdesc] = useState("");
  const [termfile, settermfile] = useState(null);
  const [termdescbtn, setTermdescbtn] = useState(false);

  const [policiesnextbutton, setpoliciesnextbutton] = useState(false);

  const [editorgovLawValue, setEditorgovLawValue] = React.useState(
    RichTextEditor.createValueFromString(govLawdesc, "html")
  );
  const [editorwarrantiesValue, seteditorwarrantiesValue] = React.useState(
    RichTextEditor.createValueFromString(warrantiesdesc, "html")
  );
  const [editorLiabalityValue, setEditorLiabalityValue] = React.useState(
    RichTextEditor.createValueFromString(liabalitydesc, "html")
  );
  const [editorprivacyValue, setEditorprivacyValue] = React.useState(
    RichTextEditor.createValueFromString(privacydesc, "html")
  );
  const [editortermValue, setEditortermValue] = React.useState(
    RichTextEditor.createValueFromString(termdesc, "html")
  );
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

  const [govuploadProgress, setgovuploadProgress] = useState(0);
  const [warrantyloadProgress, setwarrantyloadProgress] = useState(0);
  const [liabiltyloadProgress, setliabiltyloadProgress] = useState(0);
  const [privacyProgress, setprivacyProgress] = useState(0);
  const [tosloadProgress, settosloadProgress] = useState(0);

  const history = useHistory();

  const fileTypes = ["doc", "pdf"];
  const handlegovLawChange = (value) => {
    setEditorgovLawValue(value);
    setgovLawdesc(value.toString("html"));
    if (value.toString("html") !== "<p><br></p>") {
      setGovLawdescbtn(true);
    } else {
      setGovLawdescbtn(false);
    }
    console.log(value.toString("html"));
  };
  const handlegovLawFileChange = async (file) => {
    setgovLawFile(file);
    console.log(file);
    console.log("checking", props.isaccesstoken);

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
        Authorization: `Bearer ${props.isaccesstoken}`,
      },
    };

    var bodyFormData = new FormData();
    bodyFormData.append("governing_law", file);

    console.log("branding data", bodyFormData);
    let url = UrlConstant.base_url + UrlConstant.policies_files_upload;
    let token = props.isaccesstoken;
    console.log("waseem token man", token);

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
          history.push(GetErrorHandlingRoute(e));
          //   setError(true);
        });
    }
  };
  const handlewarrantiesChange = (value) => {
    seteditorwarrantiesValue(value);
    setwarrantiesdesc(value.toString("html"));
    if (value.toString("html") !== "<p><br></p>") {
      setWarrantiesdescbtn(true);
    } else {
      setWarrantiesdescbtn(false);
    }
    // console.log(value.toString("html"));
    // warrantiesdesc.toString();
    console.log(warrantiesdesc.toString());
  };
  const handlewarrantiesFileChange = async (file) => {
    setwarrantiesfile(file);
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
        Authorization: `Bearer ${props.isaccesstoken}`,
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
          history.push(GetErrorHandlingRoute(e));
          //   setError(true);
        });
    }
  };
  const handleliabalityChange = (value) => {
    setEditorLiabalityValue(value);
    setliabalitydesc(value.toString("html"));
    if (value.toString("html") !== "<p><br></p>") {
      setLiabalitydescbtn(true);
    } else {
      setLiabalitydescbtn(false);
    }
    console.log(value.toString("html"));
  };

  const handleliabalityFileChange = async (file) => {
    setliabalityfile(file);
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
        Authorization: `Bearer ${props.isaccesstoken}`,
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
          history.push(GetErrorHandlingRoute(e));
          //   setError(true);
        });
    }
  };
  const handleprivacyChange = (value) => {
    setEditorprivacyValue(value);
    setprivacydesc(value.toString("html"));
    if (value.toString("html") !== "<p><br></p>") {
      setPrivacydescbtn(true);
    } else {
      setPrivacydescbtn(false);
    }
    console.log(value.toString("html"));
  };
  const handleprivacyFileChange = async (file) => {
    setprivacyfile(file);
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
        Authorization: `Bearer ${props.isaccesstoken}`,
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
          history.push(GetErrorHandlingRoute(e));
          //   setError(true);
        });
    }
  };

  const handletermChange = (value) => {
    setEditortermValue(value);
    settermdesc(value.toString("html"));
    if (value.toString("html") !== "<p><br></p>") {
      setTermdescbtn(true);
    } else {
      setTermdescbtn(false);
    }
    console.log(value.toString("html"));
  };

  const handletermFileChange = async (file) => {
    settermfile(file);
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
        Authorization: `Bearer ${props.isaccesstoken}`,
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
          history.push(GetErrorHandlingRoute(e));
          //   setError(true);
        });
    }
  };

  const handlePoliciesSubmit = async (e) => {
    e.preventDefault();
    let url = UrlConstant.base_url + UrlConstant.policies_save_upload;
    var bodyFormData = new FormData();
    bodyFormData.append("privacy_policy", privacydesc);
    bodyFormData.append("tos", termdesc);
    bodyFormData.append("governing_law", govLawdesc);
    bodyFormData.append("limitations_of_liabilities", liabalitydesc);
    bodyFormData.append("warranty", warrantiesdesc);
    // console.log(setprivacydesc);
    await axios
      .post(url, bodyFormData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${props.isaccesstoken}`,
        },
      })
      .then((response) => {
        console.log("response");
        console.log("tos", response.data);
        //   console.log(response.json());
        console.log(response.status);
        if (response.status === 201) {
          console.log("submitted form");
          props.showBrandingScreen();
          // setEmail(false);
          // setError(false);
        } else {
          // setError(true);
        }
      })
      .catch((e) => {
        console.log(e);
        history.push(GetErrorHandlingRoute(e));
        //   setError(true);
      });
  };

  const handlegovupCancel = async (e) => {
    console.log("clicked on gov up cancel btn");
    let url = UrlConstant.base_url + UrlConstant.delete_policies_drop_document;

    await axios
      .delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.isaccesstoken}`,
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
          // setEmail(false);
          // setError(false);
        } else {
          // setError(true);
        }
      })
      .catch((e) => {
        console.log(e);
        history.push(GetErrorHandlingRoute(e));
        //   setError(true);
      });
  };
  const handlewarrantyCancel = async (e) => {
    console.log("clicked on warranties cancel btn");
    let url = UrlConstant.base_url + UrlConstant.delete_policies_drop_document;

    await axios
      .delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.isaccesstoken}`,
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
          // setError(false);
        } else {
          // setError(true);
        }
      })
      .catch((e) => {
        console.log(e);
        history.push(GetErrorHandlingRoute(e));
        //   setError(true);
      });
  };
  const handleliabiltyCancel = async (e) => {
    console.log("clicked on liability cancel btn");
    let url = UrlConstant.base_url + UrlConstant.delete_policies_drop_document;

    await axios
      .delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.isaccesstoken}`,
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
          // setError(false);
        } else {
          // setError(true);
        }
      })
      .catch((e) => {
        console.log(e);
        history.push(GetErrorHandlingRoute(e));
        //   setError(true);
      });
  };
  const handleprivacyCancel = async (e) => {
    console.log("clicked on privacy cancel btn");
    let url = UrlConstant.base_url + UrlConstant.delete_policies_drop_document;

    await axios
      .delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.isaccesstoken}`,
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
          // setError(false);
        } else {
          // setError(true);
        }
      })
      .catch((e) => {
        console.log(e);
        history.push(GetErrorHandlingRoute(e));
        //   setError(true);
      });
  };
  const handletosCancel = async (e) => {
    console.log("clicked on tos cancel btn");
    let url = UrlConstant.base_url + UrlConstant.delete_policies_drop_document;

    await axios
      .delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.isaccesstoken}`,
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
          // setError(false);
        } else {
          // setError(true);
        }
      })
      .catch((e) => {
        console.log(e);
        history.push(GetErrorHandlingRoute(e));
        //   setError(true);
      });
  };

  const finishLaterPoliciesScreen = () => {
    console.log("clicked on finish later policies screen");
    props.showBrandingScreen();
  };

  return (
    <div className="policies">
      <p className="policiesHeader">Company Policies</p>
      <form noValidate autoComplete="off" onSubmit={handlePoliciesSubmit}>
        <div className="governingdes">
          <p className="governingtitle">
            Governing Laws<sup>*</sup>
          </p>
          <div className="toolbarConfig">
            <RichTextEditor
              toolbarConfig={toolbarConfig}
              value={editorgovLawValue}
              onChange={handlegovLawChange}
              required
              id="body-text"
              name="bodyText"
              type="string"
              multiline
              variant="filled"
              style={{
                minHeight: 410,
                width: 420,
                marginTop: 20,
                marginBottom: 20,
                border: "1px solid black",
                zIndex: 4,
                textAlign: "left",
              }}
            />
          </div>
        </div>
        <div className="filegovlaw">
          <FileUploader
            handleChange={handlegovLawFileChange}
            name="file"
            types={fileTypes}
            children={
              <UploadOrgLogo
                uploaddes="Supports: .doc, .pdf not more than 2MB file size"
                uploadtitle="Upload Governing Laws (Required)"
              />
            }
            // maxSize={2}
          />
          <p className="filename">
            {govLawfile
              ? govLawfile.size
                ? `File name: ${govLawfile.name}`
                : ""
              : "No file uploaded yet"}
          </p>
          <p className="oversizemb">
            {govLawfile != null && govLawfile.size > 2097152
              ? "File uploaded is more than 2MB!"
              : ""}
          </p>
          <div className="govlawprogress">
            <LinearProgress
              variant="determinate"
              value={govuploadProgress}
              color="success"
            />
            <p className="govupper">{govuploadProgress}%</p>
          </div>
          <p className="govupclose">
            {govLawfile && <CancelIcon onClick={handlegovupCancel} />}
          </p>
        </div>
        <div className="warrantiesdes">
          <p className="warrantiestitle">
            Warranties<sup>*</sup>
          </p>
          <div className="toolbarConfig">
            <RichTextEditor
              toolbarConfig={toolbarConfig}
              value={editorwarrantiesValue}
              onChange={handlewarrantiesChange}
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
        </div>
        <div className="filewarranties">
          <FileUploader
            handleChange={handlewarrantiesFileChange}
            name="file"
            types={fileTypes}
            children={
              <UploadOrgLogo
                uploaddes="Supports: .doc, .pdf not more than 2MB file size"
                uploadtitle="Upload Warranties (Required)"
              />
            }
            //   maxSize={2}
          />
          <p className="filename">
            {warrantiesfile
              ? warrantiesfile.size
                ? `File name: ${warrantiesfile.name}`
                : ""
              : "No file uploaded yet"}
          </p>
          <p className="oversizemb">
            {warrantiesfile != null && warrantiesfile.size > 2097152
              ? "File uploaded is more than 2MB!"
              : ""}
          </p>

          <div className="warrantyprogress">
            <LinearProgress
              variant="determinate"
              value={warrantyloadProgress}
              color="success"
            />
            <p className="warrantyper">{warrantyloadProgress}%</p>
          </div>
          <p className="warrantyclose">
            {warrantiesfile && <CancelIcon onClick={handlewarrantyCancel} />}
          </p>
        </div>

        <div className="liabiltydes">
          <p className="liabiltytitle">
            Limitation of Liabilities<sup>*</sup>
          </p>
          <div className="toolbarConfig">
            <RichTextEditor
              toolbarConfig={toolbarConfig}
              value={editorLiabalityValue}
              onChange={handleliabalityChange}
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
        </div>
        <div className="fileliabilty">
          <FileUploader
            handleChange={handleliabalityFileChange}
            name="file"
            types={fileTypes}
            children={
              <UploadOrgLogo
                uploaddes="Supports: .doc, .pdf not more than 2MB file size"
                uploadtitle="Upload limitation of Liabilities (Required)"
              />
            }
            //   maxSize={2}
          />
          <p className="filename">
            {liabalityfile
              ? liabalityfile.size
                ? `File name: ${liabalityfile.name}`
                : ""
              : "No file uploaded yet"}
          </p>
          <p className="oversizemb">
            {liabalityfile != null && liabalityfile.size > 2097152
              ? "File uploaded is more than 2MB!"
              : ""}
          </p>
          <div className="liabiltyprogress">
            <LinearProgress
              variant="determinate"
              value={liabiltyloadProgress}
              color="success"
            />
            <p className="liabiltyper">{liabiltyloadProgress}%</p>
          </div>
          <p className="liabiltyclose">
            {liabalityfile && <CancelIcon onClick={handleliabiltyCancel} />}
          </p>
        </div>

        <div className="privacydes">
          <p className="privacytitle">
            Privacy Policy<sup>*</sup>
          </p>
          <div className="toolbarConfig">
            <RichTextEditor
              toolbarConfig={toolbarConfig}
              value={editorprivacyValue}
              onChange={handleprivacyChange}
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
        </div>
        <div className="fileprivacy">
          <FileUploader
            handleChange={handleprivacyFileChange}
            name="file"
            types={fileTypes}
            children={
              <UploadOrgLogo
                uploaddes="Supports: .doc, .pdf not more than 2MB file size"
                uploadtitle="Upload Privacy Policy (Required)"
              />
            }
            //   maxSize={2}
          />
          <p className="filename">
            {privacyfile
              ? privacyfile.size
                ? `File name: ${privacyfile.name}`
                : ""
              : "No file uploaded yet"}
          </p>
          <p className="oversizemb">
            {privacyfile != null && privacyfile.size > 2097152
              ? "File uploaded is more than 2MB!"
              : ""}
          </p>
          <div className="privacyprogress">
            <LinearProgress
              variant="determinate"
              value={privacyProgress}
              color="success"
            />
            <p className="privacyper">{privacyProgress}%</p>
          </div>
          <p className="privacyclose">
            {privacyfile && <CancelIcon onClick={handleprivacyCancel} />}
          </p>
        </div>

        <div className="termdes">
          <p className="termtitle">
            Terms of Use<sup>*</sup>
          </p>
          <div className="toolbarConfig">
            <RichTextEditor
              toolbarConfig={toolbarConfig}
              value={editortermValue}
              onChange={handletermChange}
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
        </div>
        <div className="termprivacy">
          <FileUploader
            handleChange={handletermFileChange}
            name="file"
            types={fileTypes}
            children={
              <UploadOrgLogo
                uploaddes="Supports: .doc, .pdf not more than 2MB file size"
                uploadtitle="Upload Terms of Use (Required)"
              />
            }
            //   maxSize={2}
          />
          <p className="filename">
            {termfile
              ? termfile.size
                ? `File name: ${termfile.name}`
                : ""
              : "No file uploaded yet"}
          </p>
          <p className="oversizemb">
            {termfile != null && termfile.size > 2097152
              ? "File uploaded is more than 2MB!"
              : ""}
          </p>
          <div className="tosprogress">
            <LinearProgress
              variant="determinate"
              value={tosloadProgress}
              color="success"
            />
            <p className="tosper">{tosloadProgress}%</p>
          </div>
          <p className="tosclose">
            {termfile && <CancelIcon onClick={handletosCancel} />}
          </p>
        </div>

        <div>
          {/* <Button variant="contained" className="policiesbtn" type="submit">
            <span className="signupbtnname">Next</span>
          </Button> */}
          {govLawdescbtn &&
          warrantiesdescbtn &&
          liabalitydescbtn &&
          privacydescbtn &&
          termdescbtn &&
          privacydesc.length > 2 &&
          termdesc.length > 2 &&
          govLawdesc.length > 2 &&
          liabalitydesc.length > 2 &&
          warrantiesdesc.length > 2 &&
          govLawfile &&
          warrantiesfile &&
          liabalityfile &&
          privacyfile &&
          termfile ? (
            <Button variant="contained" className="policiesbtn" type="submit">
              <span className="signupbtnname">Next</span>
            </Button>
          ) : (
            <Button variant="outlined" disabled className="disablepoliciesbtn">
              Next
            </Button>
          )}
        </div>
        {/* <div>
          <Button
            variant="outlined"
            className="finishlaterpoliciesbtn"
            type="button"
            onClick={finishLaterPoliciesScreen}>
            Finish later
          </Button>
        </div> */}
      </form>
      <div className="footerimg2">
        <svg
          width={150}
          height={127}
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <g opacity={0.1} fill="#E7B100">
            <circle cx={5.814} cy={5.728} r={5.728} />
            <circle cx={40.181} cy={5.728} r={5.728} />
            <circle cx={74.547} cy={5.728} r={5.728} />
            <circle cx={108.914} cy={5.728} r={5.728} />
            <circle cx={143.28} cy={5.728} r={5.728} />
            <circle cx={5.814} cy={28.631} r={5.728} />
            <circle cx={40.181} cy={28.631} r={5.728} />
            <circle cx={74.547} cy={28.631} r={5.728} />
            <circle cx={108.914} cy={28.631} r={5.728} />
            <circle cx={143.28} cy={28.631} r={5.728} />
            <circle cx={5.814} cy={51.549} r={5.728} />
            <circle cx={40.181} cy={51.549} r={5.728} />
            <circle cx={74.547} cy={51.549} r={5.728} />
            <circle cx={108.914} cy={51.549} r={5.728} />
            <circle cx={143.28} cy={51.549} r={5.728} />
            <circle cx={5.814} cy={74.461} r={5.728} />
            <circle cx={40.181} cy={74.461} r={5.728} />
            <circle cx={74.547} cy={74.461} r={5.728} />
            <circle cx={108.914} cy={74.461} r={5.728} />
            <circle cx={143.28} cy={74.461} r={5.728} />
            <circle cx={5.814} cy={97.365} r={5.728} />
            <circle cx={40.181} cy={97.365} r={5.728} />
            <circle cx={74.547} cy={97.365} r={5.728} />
            <circle cx={108.914} cy={97.365} r={5.728} />
            <circle cx={143.28} cy={97.365} r={5.728} />
            <circle cx={5.814} cy={120.282} r={5.728} />
            <circle cx={40.181} cy={120.282} r={5.728} />
            <circle cx={74.547} cy={120.282} r={5.728} />
            <circle cx={108.914} cy={120.282} r={5.728} />
            <circle cx={143.28} cy={120.282} r={5.728} />
          </g>
        </svg>
      </div>
      <div style={{ position: "absolute", top: "3400px" }}>
        <Footer />
      </div>
    </div>
  );
}
