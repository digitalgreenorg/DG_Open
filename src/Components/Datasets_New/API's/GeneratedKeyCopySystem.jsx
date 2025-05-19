import { Button } from "@mui/material";
import React, { useContext, useState } from "react";
import global_style from "../../../Assets/CSS/global.module.css";
import local_style from "./generate_key_copy_sysytem.module.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { FarmStackContext } from "../../Contexts/FarmStackContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import UrlConstant from "../../../Constants/UrlConstants";
const GeneratedKeyCopySystem = (props) => {
  const { data } = props;
  const { callToast } = useContext(FarmStackContext);
  const history = useHistory();
  const [textToCopy, setTextToCopy] = useState(data?.api_key);

  function copyToClipboard(text) {
    // Try to copy the text to the clipboard
    navigator.clipboard
      .writeText(text)
      .then(() => {
        callToast(`Text copied to clipboard: ${text}`, "info", true);
        console.log("Text copied to clipboard:", text);
      })
      .catch((error) => {
        callToast(`Text copied to clipboard: ${text}`, "info", true);
        console.error("Error copying text to clipboard:", error);
      });
  }

  const createCurl = (api) => {
    let url = UrlConstant.base_url + "microsite/datasets_file/api/?page=1";
    let curl = `curl --location '${url}' \
    --header 'api-key: ${api}'`;
    copyToClipboard(curl);
  };

  return (
    <div className="generate_key_main_box">
      <div style={{ margin: "30px auto" }}>
        {props.heading ??
          "You got access for this dataset, copy the API key for further process!"}
      </div>
      <div className={local_style.mainBox}>
        <div
          className={
            global_style.bold700 +
            " " +
            global_style.size24 +
            " " +
            local_style.padding25
          }
        >
          API’s details
        </div>
        <hr />
        <div className={local_style.padding25}>
          <div>
            <div className={global_style.bold400 + " " + global_style.size16}>
              API
            </div>
            <div className={global_style.bold600 + " " + global_style.size16}>
              {/* {props.file?.split("/")?.at(-1) ?? +" API"} */}
              {props.url}
            </div>
          </div>
          <div className={local_style.paddingtop15}>
            <div className={global_style.bold400 + " " + global_style.size16}>
              API key
            </div>
            <div className={global_style.bold600 + " " + global_style.size16}>
              {data?.api_key ?? "NA"}
            </div>
          </div>
        </div>
        <hr />
        <div className={local_style.buttongrp + " " + local_style.padding25}>
          <Button
            onClick={() => history.goBack()}
            className={local_style.close + " " + global_style.bold600}
          >
            Close
          </Button>
          <Button
            onClick={() => copyToClipboard(textToCopy)}
            className={local_style.copy + " " + global_style.bold600}
          >
            {" "}
            <ContentCopyIcon fontSize="small" /> Copy API Key
          </Button>
          <Button
            onClick={() => createCurl(textToCopy)}
            className={local_style.copy + " " + global_style.bold600}
          >
            {" "}
            <ContentCopyIcon fontSize="small" /> Copy cURL
          </Button>
        </div>
      </div>

      {/* <div>
        <Button className={local_style.request_access}>Request access</Button>
      </div> */}
    </div>
  );
};

export default GeneratedKeyCopySystem;
