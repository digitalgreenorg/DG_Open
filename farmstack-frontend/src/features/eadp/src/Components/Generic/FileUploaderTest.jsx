import Upload from '../../Assets/Img/Upload.svg';
import { useMediaQuery, useTheme } from "@mui/material";
import React from "react";

const FileUploaderTest = (props) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div id={`file-upload-drag-and-drop-dataset`}>
      <img className="cursor-pointer"
        alt="upload_img"
         src={Upload} 
        width={mobile ? "300px" : "100%"}
      />
      <p style={{ display: "none" }}>{props.texts}</p>
    </div>
  );
};

export default FileUploaderTest;
