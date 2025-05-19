import React from "react";

export default function UploadOrgBanner(props) {
  return (
    <div>
      <div className="BannerOrgupload">
        <p className="uploadtitle">
          {props.uploadtitle
            ? props.uploadtitle
            : "Upload your banner image here"}
        </p>
        <div className="uploadBannerimg">
          <svg
            width="71"
            height="71"
            viewBox="0 0 71 71"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="35.5" cy="35.5" r="35.5" fill="#FFF7DC" />
            <circle cx="35.5" cy="35.5" r="29.5" fill="#F9EABC" />
            <circle cx="35.5" cy="35.5" r="23.5" fill="#C09507" />
            <g clip-path="url(#clip0_127_7)">
              <path
                d="M42 28V42H28V28H42ZM42 26H28C26.9 26 26 26.9 26 28V42C26 43.1 26.9 44 28 44H42C43.1 44 44 43.1 44 42V28C44 26.9 43.1 26 42 26ZM37.14 34.86L34.14 38.73L32 36.14L29 40H41L37.14 34.86Z"
                fill="white"
              />
              <circle cx="52.6469" cy="52.6471" r="6.35294" fill="white" />
            </g>
            <circle
              cx="54"
              cy="49"
              r="11"
              fill="white"
              stroke="#C09507"
              strokeWidth="2"
            />
            <path
              d="M58.0832 49.5834H54.5832V53.0834H53.4165V49.5834H49.9165V48.4167H53.4165V44.9167H54.5832V48.4167H58.0832V49.5834Z"
              fill="#C09507"
            />
            <defs>
              <clipPath id="clip0_127_7">
                <rect
                  width="24"
                  height="24"
                  fill="white"
                  transform="translate(23 23)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
        <p style={{ color: "#A3B0B8" }}>
          Drag and drop or
          <span>
            <button class="Banneruploadbtn info">Browse</button>
          </span>
          your files
        </p>
        <p style={{ color: "#A3B0B8" }}>
          {props.uploaddes
            ? props.uploaddes
            : "Size must be '1300 x 220 pixels' with a maximum size of 2MB."}
        </p>
      </div>
    </div>
  );
}
