import React from "react";
import "./UploadProfileimg.css";

export default function UploadProfileimg(props) {
  return (
    <div className="accountsettingsupload">
      <p className="accountsettingsheader">{props.uploadtitle}</p>
      <div className="accountsettingsuploadimg">
        <svg
          width={71}
          height={71}
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <circle cx={35.5} cy={35.5} r={35.5} fill="#FFF7DC" />
          <circle cx={35.5} cy={35.5} r={29.5} fill="#F9EABC" />
          <circle cx={35.5} cy={35.5} r={23.5} fill="#C09507" />
          <path
            d="M38 25h-8c-1.1 0-1.99.9-1.99 2L28 43c0 1.1.89 2 1.99 2H42c1.1 0 2-.9 2-2V31l-6-6Zm4 18H30V27h7v5h5v11Zm-10-4.99 1.41 1.41L35 37.84V42h2v-4.16l1.59 1.59L40 38.01 36.01 34 32 38.01Z"
            fill="#fff"
          />
        </svg>
      </div>
      <p style={{ color: "#A3B0B8" }}>
        Drag and drop or
        <span>
          <button class="orguploadbtn info">Browse</button>
        </span>
        your files
      </p>
      <p style={{ color: "#A3B0B8" }}>{props.uploaddes}</p>
    </div>
  );
}
