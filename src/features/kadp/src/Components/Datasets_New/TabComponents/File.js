import file from '../../../Assets/Img/file.svg';
import { Divider, Typography, useTheme, useMediaQuery } from "@mui/material";
import React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
const File = ({
  index,
  name,
  size,
  id,
  handleDelete,
  type,
  showDeleteIcon,
  isTables,
}) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const getSizeInMb = (size) => {
    let converted = size / Math.pow(1024, 2);
    return converted.toFixed(2);
  };
  const handleClick = (index, id, name, type) => {
    handleDelete(index, id, name, type);
  };
  return (
    <div>
      <div
        key={index}
        className={`d-flex align-items-center ${
          mobile ? "flex-column" : "flex-row"
        }`}
      >
        <img style={{ marginLeft: isTables ? "" : "20px" }}
           src={file} 
          alt="file_image"
        />
        <Typography
          sx={{
            fontFamily: "Arial !important",
            fontWeight: "400",
            fontSize: "16px",
            lineHeight: "20px",
            color: "#000000",
            textDecoration: "none",
            marginLeft: "20px",
            wordWrap: "break-word",
            maxWidth: "550px",
            textAlign: "left",
          }}
        >
          {/* {index + 1 + "_" + name}{" "} */}
          {name}
        </Typography>
        <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
          ({getSizeInMb(size) + "MB"})
        </span>
        {showDeleteIcon ? (
          <div
            style={{
              marginRight: "25px",
              display: "flex",
              justifyContent: "end",
              width: "100%",
            }}
          >
            <DeleteOutlineIcon
              id={`accordion-uploaded-file-delete-button-id${index}`}
              className="cursor-pointer"
              onClick={() => handleClick(index, id, name, type)}
              sx={{
                fill: "#FF5630",
                fontSize: "24px",
              }}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      {showDeleteIcon ? (
        <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default File;
