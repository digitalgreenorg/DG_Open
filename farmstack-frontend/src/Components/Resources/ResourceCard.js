import {
  Box,
  Card,
  IconButton,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  GetErrorHandlingRoute,
  dateTimeFormat,
  getTokenLocal,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "../../Utils/Common";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ArticleIcon from "@mui/icons-material/Article";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import styles from "../../Views/Resources/resources.module.css";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import LanguageIcon from "@mui/icons-material/Language";
import WebhookIcon from "@mui/icons-material/Webhook";

import { CgDetailsMore } from "react-icons/cg";
import { TbEditCircle } from "react-icons/tb";
import { RiDeleteBin3Line } from "react-icons/ri";

import { IoMdMore } from "react-icons/io";

import {
  FaYoutube,
  FaFileAlt,
  FaCopy,
  FaGlobe,
  FaQuestionCircle,
  FaGoogle,
  FaCloud,
  FaDropbox,
} from "react-icons/fa";
import { MdEventAvailable, MdWebhook } from "react-icons/md";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "../../Services/HTTPService";

const cardSx = {
  maxWidth: 368,
  height: "fit-content",
  border: "1px solid #C0C7D1",
  borderRadius: "10px",
  cursor: "pointer",
  "&:hover": {
    boxShadow: "-40px 40px 80px rgba(145, 158, 171, 0.16)",
    cursor: "pointer",
    border: "1px solid #2CD37F",
  },
};
const ResourceCard = ({
  history,
  item,
  title,
  handleCardClick,
  value,
  index,
  userType,
  handleChatIconClick,
  handleDelete,
}) => {
  console.log("🚀 ~ item:", item);
  const [youtube, setYoutube] = useState();
  const [file, setFile] = useState();
  const [pdf, setPdf] = useState();
  const [api, setApi] = useState();
  const [website, setWebsite] = useState();
  const [s3, setS3] = useState();
  const [googleDrive, setGoogleDrive] = useState();
  const [dropbox, setDropbox] = useState();

  useEffect(() => {
    let youtube = item?.content_files_count.find(
      (item) => item.type === "youtube"
    );
    let file = item?.content_files_count.find((item) => item.type === "file");
    let pdf = item?.content_files_count.find((item) => item.type === "pdf");
    let api = item?.content_files_count.find((item) => item.type === "api");
    let website = item?.content_files_count.find(
      (item) => item.type === "website"
    );
    let s3 = item?.content_files_count.find((item) => item.type === "s3");
    let googleDrive = item?.content_files_count.find((item) => item.type === "google_drive");
    let dropbox = item?.content_files_count.find((item) => item.type === "dropbox");

    setYoutube(youtube);
    setFile(file);
    setPdf(pdf);
    setWebsite(website);
    setApi(api);
    setS3(s3);
    setGoogleDrive(googleDrive);
    setDropbox(dropbox)
  }, []);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    event.stopPropagation(); // Prevents the card's main onClick
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEdit = () => {
    if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
      history.push(`/datahub/resources/edit/${item?.id}`);
    } else if (isLoggedInUserParticipant()) {
      history.push(`/participant/resources/edit/${item?.id}`);
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    if (handleDelete) {
      handleDelete(item.id);
      handleClose();
    }
  };

  const handleMenuItemClick = (action) => {
    console.log(action, item?.id); // Example action handling
    handleMenuClose();
    if (action == "Detail View") {
      history.push(handleCardClick(item?.id), {
        tab: value,
        userType: userType,
      });
    } else if (action == "Edit") {
      handleEdit();
    } else if (action == "Delete") {
      handleOpen();
    }
  };
  return (
    <>
      <Card
        sx={cardSx}
        // onClick={() => {
        //   console.log("cl1234");
        //   history.push(handleCardClick(item?.id), {
        //     tab: value,
        //     userType: userType,
        //   });
        // }}
      >
        <Box>
          <Box
            sx={{
              color: "#424242",
              fontFamily: "Montserrat !important",
              fontSize: "16px",
              textAlign: "left",
              fontWeight: "500",
              lineHeight: "30px",
              background: "#F6F6F6",
              padding: "10px",
              textTransform: "capitalize",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                color: "#424242",
                fontSize: "16px",
                textAlign: "left",
                fontWeight: "500",
                lineHeight: "30px",
              }}
            >
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "250px",
                }}
              >
                {item?.title}
              </div>
            </Typography>

            <IconButton
              aria-label="more"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
            >
              <IoMdMore />
            </IconButton>

            <Menu
              id="simple-menu"
              anchorEl={menuAnchorEl}
              keepMounted
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                className="select_menu_option"
                onClick={() => handleMenuItemClick("Detail View")}
              >
                <CgDetailsMore />
                View
              </MenuItem>
              {value == 0 && (
                <MenuItem
                  className="select_menu_option"
                  onClick={() => handleMenuItemClick("Edit")}
                >
                  <TbEditCircle />
                  Edit
                </MenuItem>
              )}
              {value == 0 && (
                <MenuItem
                  className="select_menu_option"
                  onClick={() => handleMenuItemClick("Delete")}
                >
                  <RiDeleteBin3Line />
                  Delete
                </MenuItem>
              )}
            </Menu>
          </Box>
          <Box
            sx={{ padding: "10px" }}
            onClick={() => {
              history.push(handleCardClick(item?.id), {
                tab: value,
                userType: userType,
              });
            }}
          >
            <Box
              sx={{ textAlign: "left", display: "flex", alignItems: "center" }}
            >
              <Avatar
                src={item?.organization?.logo}
                alt="organisation"
                height="15px"
              />
              <span style={{ marginLeft: "5px", fontSize: "12px" }}>
                {item?.organization?.name}
              </span>
            </Box>
            <Box
              sx={{
                display: "flex",
                marginTop: "10px",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <Tooltip title="Youtube" placement="top" arrow>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FaYoutube style={{ color: "#FF0000" }} />
                  <span style={{ marginLeft: "5px" }}>
                    {youtube?.count ?? 0}
                  </span>
                </Box>
              </Tooltip>
              <Tooltip title="Docs" placement="top" arrow>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FaFileAlt style={{ color: "#00a94f" }} />
                  <span style={{ marginLeft: "5px" }}>{pdf?.count ?? 0}</span>
                </Box>
              </Tooltip>
              <Tooltip title="Files" placement="top" arrow>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FaCopy style={{ color: "#00a94f" }} />
                  <span style={{ marginLeft: "5px" }}>{file?.count ?? 0}</span>
                </Box>
              </Tooltip>
              <Tooltip title="APIs" placement="top" arrow>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <MdWebhook style={{ color: "#00a94f" }} />
                  <span style={{ marginLeft: "5px" }}>{api?.count ?? 0}</span>
                </Box>
              </Tooltip>
              <Tooltip title="Websites" placement="top" arrow>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FaGlobe style={{ color: "blue" }} />
                  <span style={{ marginLeft: "5px" }}>
                    {website?.count ?? 0}
                  </span>
                </Box>
              </Tooltip>
              <Tooltip title="S3" placement="top" arrow>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FaCloud style={{ color: "blue" }} />
                  <span style={{ marginLeft: "5px" }}>
                    {s3?.count ?? 0}
                  </span>
                </Box>
              </Tooltip>
              <Tooltip title="Google drive" placement="top" arrow>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FaGoogle style={{ color: "blue" }} />
                  <span style={{ marginLeft: "5px" }}>
                    {googleDrive?.count ?? 0}
                  </span>
                </Box>
              </Tooltip>
              <Tooltip title="Dropbox" placement="top" arrow>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FaDropbox style={{ color: "blue" }} />
                  <span style={{ marginLeft: "5px" }}>
                    {dropbox?.count ?? 0}
                  </span>
                </Box>
              </Tooltip>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "20px",
                justifyContent: "space-between",
                paddingRight: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <MdEventAvailable
                  style={{ color: "#424242", width: "18px", height: "18px" }}
                />
                <span
                  style={{
                    marginLeft: "5px",
                    color: "#637381",
                    fontFamily: "Montserrat !important",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "18px",
                    background: "#F6F6F6",
                  }}
                >
                  Published on:{" "}
                  {item?.created_at
                    ? dateTimeFormat(item?.created_at, false)
                    : "Not Available"}
                </span>
              </div>
              {getTokenLocal() &&
              (isLoggedInUserAdmin() ||
                isLoggedInUserCoSteward() ||
                isLoggedInUserParticipant()) ? (
                <Box
                  sx={{
                    cursor: "pointer",
                    height: "30px",
                    width: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "5px",
                    background: "#e6f7f0",
                    borderRadius: "50%",
                    "&:hover": {
                      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                    },
                  }}
                  className="hidden"
                  onClick={(e) => {
                    console.log("cl123");
                    handleChatIconClick(item.id, item.title, e);
                  }}
                >
                  <QuestionAnswerIcon sx={{ fontSize: "large" }} />
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      </Card>

      <DeleteConfirmationModal
        open={open}
        handleConfirm={handleConfirm}
        handleClose={handleClose}
      />
    </>
  );
};

export default ResourceCard;
