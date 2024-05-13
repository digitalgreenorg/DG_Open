import organisation from '../../Assets/Img/organisation.svg';
import { Box, Card, Tooltip, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  dateTimeFormat,
  getTokenLocal,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "common/utils/utils";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ArticleIcon from "@mui/icons-material/Article";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import styles from "../../Views/Resources/resources.module.css";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import LanguageIcon from "@mui/icons-material/Language";
import WebhookIcon from "@mui/icons-material/Webhook";

const cardSx = {
  maxWidth: 368,
  height: 205,
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
}) => {
  console.log("🚀 ~ item:", item);
  const [youtube, setYoutube] = useState();
  const [file, setFile] = useState();
  const [pdf, setPdf] = useState();
  const [api, setApi] = useState();
  const [website, setWebsite] = useState();

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
    setYoutube(youtube);
    setFile(file);
    setPdf(pdf);
    setWebsite(website);
    setApi(api);
  }, []);
  return (
    <>
      <Card
        sx={cardSx}
        onClick={() => {
          console.log("cl1234");

          history.push(handleCardClick(item?.id), {
            tab: value,
            userType: userType,
          });
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#424242",
              fontFamily: "Roboto !important",
              fontSize: "20px",
              textAlign: "left",
              fontWeight: "500",
              lineHeight: "30px",
              background: "#F6F6F6",
              padding: "15px 0px 15px 28px",
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
          <Box sx={{ margin: "10px 0px 20px 20px" }}>
            <Box
              sx={{ textAlign: "left", display: "flex", alignItems: "center" }}
            >
              <img  src={organisation} 
                alt="organisation"
              />
              <span style={{ marginLeft: "5px" }}>
                {item?.organization?.name}
              </span>
            </Box>
            <Box
              className="d-flex"
              sx={{ marginLeft: "-2.5px", marginTop: "20px" }}
            >
              <Tooltip title="Youtube" placement="top" arrow>
                <Box sx={{ marginRight: "16px", display: "flex" }}>
                  <YouTubeIcon className="mr-7" sx={{ fill: "#424242" }} />
                  <span className={styles.count_text}>
                    {youtube?.count ?? 0}
                  </span>
                </Box>
              </Tooltip>
              <Tooltip title="Docs" placement="top" arrow>
                <Box sx={{ display: "flex", marginRight: "16px" }}>
                  <ArticleIcon className="mr-7" sx={{ fill: "#424242" }} />
                  <span className={styles.count_text}>{pdf?.count ?? 0}</span>
                </Box>
              </Tooltip>
              <Tooltip title="Files" placement="top" arrow>
                <Box sx={{ display: "flex", marginRight: "16px" }}>
                  <FileCopyIcon
                    className="mr-7"
                    sx={{ fontSize: "21px", fill: "#424242" }}
                  />
                  <span className={styles.count_text}>{file?.count ?? 0}</span>
                </Box>
              </Tooltip>
              <Tooltip title="APIs" placement="top" arrow>
                <Box sx={{ display: "flex", marginRight: "16px" }}>
                  <WebhookIcon
                    className="mr-7"
                    sx={{ fontSize: "22px", fill: "#424242" }}
                  />
                  <span className={styles.count_text}>{api?.count ?? 0}</span>
                </Box>
              </Tooltip>

              <Tooltip title="Websites" placement="top" arrow>
                <Box sx={{ display: "flex" }}>
                  <LanguageIcon
                    className="mr-7"
                    sx={{ fontSize: "22px", fill: "#424242" }}
                  />
                  <span className={styles.count_text}>
                    {website?.count ?? 0}
                  </span>
                </Box>
              </Tooltip>
            </Box>
            <Box
              sx={{
                // textAlign: "left",
                display: "flex",
                alignItems: "center",
                marginTop: "20px",
                justifyContent: "space-between",
                paddingRight: "10px",
              }}
            >
              <div>
                <EventAvailableIcon
                  sx={{
                    width: "18px",
                    height: "18px",
                    fill: "rgb(66, 66, 66)",
                  }}
                />
                <span
                  style={{
                    marginLeft: "5px",
                    color: "#637381",
                    fontFamily: "Roboto !important",
                    fontSize: "12px",
                    fontWeight: "400",
                    lineHeight: "0px",
                    background: "#F6F6F6",
                  }}
                >
                  Published on:
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
                    // position: "fixed",
                    // right: "20px",
                    // bottom: "20px",
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
    </>
  );
};

export default ResourceCard;
