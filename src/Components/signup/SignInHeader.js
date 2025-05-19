import React from 'react';
import "./SignInHeader.css";
export default function SignInHeader() {
  return (
    <div className="SignInHeader">
      <svg
        width="100%"
        height={145}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none">
        <path
          opacity={0.5}
          d="M0 0v143.957c201.285 6.959 344.462-22.615 390.889-38.272 66.496-22.616 126.552-38.418 148.269-43.492 91.656-19.136 264.337-17.831 339.22-14.787 80.873 2.435 181.962 2.175 222.402 1.74 98.85-.348 180.47-7.684 208.92-11.308C1395.97 29.139 1432.51 8.988 1440 0H0Z"
          fill="#F1B902"
        />
        <path
          d="M0 0v110.202c201.285 5.327 344.462-17.313 390.889-29.299 66.496-17.312 126.552-29.409 148.269-33.293 91.656-14.65 264.337-13.65 339.22-11.32 80.873 1.864 181.962 1.665 222.402 1.332 98.85-.267 180.47-5.882 208.92-8.657C1395.97 22.307 1432.51 6.881 1440 0H0Z"
          fill="url(#a)"
        />
        <defs>
          <linearGradient
            id="a"
            x1={703}
            y1={-126.919}
            x2={715.599}
            y2={111.233}
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#C09507" />
            <stop offset={1} stopColor="#F8DC80" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
