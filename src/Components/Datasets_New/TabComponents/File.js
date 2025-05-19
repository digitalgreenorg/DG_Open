import {
  Divider,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
  Modal,
  CircularProgress,
} from "@mui/material";
import React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Embedding_Chunk from "../../../Views/Resources/TabComponents/Embedding_Chunk";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import { StylesContext } from "@material-ui/styles";
import Styles from "./file.module.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: "16px 16px 32px 16px",
};
const File = ({
  index,
  name,
  url,
  size,
  id,
  handleDelete,
  type,
  showDeleteIcon,
  showEmbedding,
  collections,
  isTables,
  iconcolor,
  embeddingsStatus,
  RefreshEmbedingStatus,
  fileImg,
}) => {
  console.log("🚀 ~ fileImg:", fileImg);
  // console.log("🚀 ~ RefreshEmbedingStatus:", data);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getSizeInMb = (size) => {
    let converted = size / Math.pow(1024, 2);
    return converted.toFixed(2);
  };
  console.log("🚀 ~ embeddingsStatus:", name, embeddingsStatus);
  const handleClick = (index, id, name, type) => {
    handleDelete(index, id, name, type);
  };
  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      let tempurl = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = tempurl;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading the file:", error);
      // Handle error here
    }
  };
  return (
    <div>
      <div
        key={index}
        className={`d-flex align-items-center ${
          mobile ? "flex-column" : "flex-row"
        }`}
      >
        <img
          style={{
            marginLeft: isTables || fileImg ? "" : "20px",
            height: "50px",
            borderRadius: "5px",
          }}
          src={fileImg ?? require("../../../Assets/Img/file.svg")}
          alt="file_image"
        />
        <Typography
          sx={{
            fontFamily: "Montserrat !important",
            fontWeight: "400",
            fontSize: "16px",
            lineHeight: "20px",
            color: "#000000",
            textDecoration: "none",
            marginLeft: "20px",
            wordWrap: "break-word",
            // maxWidth: "550px",
            textAlign: "left",
            wordBreak: "break-all",
            minWidth: "500px",
            maxWidth: "500px",
          }}
        >
          {/* {index + 1 + "_" + name}{" "} */}
          {name}
        </Typography>
        {size && (
          <span style={{ color: "#ABABAB", marginLeft: "4px" }}>
            ({getSizeInMb(size) + "MB"})
          </span>
        )}

        <div
          style={{
            marginRight: "25px",
            display: "flex",
            justifyContent: "end",
            width: "100%",
          }}
        >
          {showEmbedding && (
            <>
              {embeddingsStatus == "in-progress" ||
              embeddingsStatus == "failed" ? (
                <Box
                  sx={{
                    marginRight: "20px",
                    // color: "#0F91D2",
                    // cursor: "pointer",
                    // ":hover": {
                    //   textDecoration: "underline",
                    // },
                  }}
                  // onClick={handleOpen}
                >
                  {embeddingsStatus == "in-progress" ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginRight: 2,
                      }}
                    >
                      <CircularProgress
                        size={20}
                        sx={{ color: "primary.main", marginRight: 1 }}
                      />
                      <Typography sx={{ color: "text.primary" }}>
                        Creating Embeddings...
                      </Typography>
                    </Box>
                  ) : (
                    "Failed"
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    marginRight: "20px",
                    color: "#0F91D2",
                    cursor: "pointer",
                    ":hover": {
                      textDecoration: "underline",
                    },
                  }}
                  onClick={handleOpen}
                >
                  Embeddings/Chunks
                </Box>
              )}
              {embeddingsStatus == "in-progress" ? (
                <Box
                  sx={{
                    marginRight: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => RefreshEmbedingStatus(id, type)}
                >
                  <RefreshIcon className={Styles.refreshButton} />
                </Box>
              ) : (
                <Box
                  sx={{
                    marginRight: "20px",
                    color: "#0F91D2",
                    cursor: "pointer",
                    ":hover": {
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => {
                    if (url && type !== "file") {
                      window.open(url, "_blank");
                    } else if (type === "file" && url) {
                      handleDownload();
                    }
                  }}
                >
                  View
                </Box>
              )}
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Box className="d-flex justify-content-between">
                    <Typography
                      sx={{
                        fontFamily: "Montserrat !important",
                        fontSize: "24px",
                        lineHeight: "40px",
                        color: "#000000",
                      }}
                    >
                      Data Embedding Table
                    </Typography>
                    <CloseIcon
                      sx={{ cursor: "pointer" }}
                      onClick={handleClose}
                    />
                  </Box>
                  <Embedding_Chunk id={id} />
                </Box>
              </Modal>
            </>
          )}
          {showDeleteIcon && (
            <DeleteOutlineIcon
              id={`accordion-uploaded-file-delete-button-id${index}`}
              className="cursor-pointer"
              onClick={() => handleClick(index, id, name, type)}
              sx={{
                fill: iconcolor ? iconcolor : "#FF5630",
                fontSize: "24px",
              }}
            />
          )}
        </div>
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
