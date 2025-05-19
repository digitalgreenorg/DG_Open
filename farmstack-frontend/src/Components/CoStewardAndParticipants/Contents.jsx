import { Box, Tooltip } from "@mui/material";
import LocalStyle from "./CostewardAndParticipants.module.css";
import React from "react";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ArticleIcon from "@mui/icons-material/Article";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import LanguageIcon from "@mui/icons-material/Language";
import WebhookIcon from "@mui/icons-material/Webhook";
const Contents = ({ participant }) => {
  const getContentTypeCount = (type) => {
    const content = participant?.content_files_count || [];
    const item = content.find((item) => item.type === type);
    return item ? item.count : 0;
  };
  return (
    <>
      <Tooltip title="Youtube" placement="top" arrow>
        <Box sx={{ marginRight: "16px", display: "flex" }}>
          <YouTubeIcon className="mr-7" sx={{ fill: "#424242" }} />
          <span className={LocalStyle.count_text}>
            {getContentTypeCount("youtube")}
          </span>
        </Box>
      </Tooltip>
      <Tooltip title="Docs" placement="top" arrow>
        <Box sx={{ display: "flex", marginRight: "16px" }}>
          <ArticleIcon className="mr-7" sx={{ fill: "#424242" }} />
          <span className={LocalStyle.count_text}>
            {getContentTypeCount("docs")}
          </span>
        </Box>
      </Tooltip>
      <Tooltip title="Files" placement="top" arrow>
        <Box sx={{ display: "flex", marginRight: "16px" }}>
          <FileCopyIcon
            className="mr-7"
            sx={{ fontSize: "21px", fill: "#424242" }}
          />
          <span className={LocalStyle.count_text}>
            {getContentTypeCount("file")}
          </span>
        </Box>
      </Tooltip>
      <Tooltip title="APIs" placement="top" arrow>
        <Box sx={{ display: "flex", marginRight: "16px" }}>
          <WebhookIcon
            className="mr-7"
            sx={{ fontSize: "22px", fill: "#424242" }}
          />
          <span className={LocalStyle.count_text}>
            {getContentTypeCount("apis")}
          </span>
        </Box>
      </Tooltip>
      <Tooltip title="Websites" placement="top" arrow>
        <Box sx={{ display: "flex" }}>
          <LanguageIcon
            className="mr-7"
            sx={{ fontSize: "22px", fill: "#424242" }}
          />
          <span className={LocalStyle.count_text}>
            {getContentTypeCount("websites")}
          </span>
        </Box>
      </Tooltip>
    </>
  );
};

export default Contents;
