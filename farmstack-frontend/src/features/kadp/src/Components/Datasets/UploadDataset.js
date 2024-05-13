import React from "react";
import upload_img from "../../Assets/Img/Farmstack V2.0/upload.svg";
export default function UploadDataset(props) {
  return (
    <div
      className="datasetupload"
      style={{
        border: "1px dashed #00A94F",
        height: "324px",
        cursor: "pointer",
        background: "#F4F6F8",
      }}
      id={`file-upload-drag-and-drop-${props.index}`}
    >
      <p className="accountsettingsheader" style={{ paddingTop: "24px" }}>
        {props.uploadtitle}
      </p>
      <div className="accountsettingsuploadimg" style={{ textAlign: "center" }}>
        <img src={upload_img} />{" "}
      </div>
      <p style={{ color: "#A3B0B8", padding: "40px" }}>
        {props.texts} {props.maxSize}.
      </p>
      {/* <p style={{ color: "#A3B0B8" }}>{props.uploades}</p> */}
    </div>
  );
}
