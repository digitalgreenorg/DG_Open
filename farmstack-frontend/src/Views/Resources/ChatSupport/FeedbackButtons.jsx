import React from "react";
import Button from "@mui/material/Button";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import { Box } from "@mui/material";
function FeedbackButtons({ handleLike, handleDislike, feedback, msg }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "left",
        gap: "20px",
        marginTop: "10px",
      }}
    >
      <Box
        className="feedback_system"
        style={{ unset: "all", cursor: "pointer" }}
        variant="contained"
        color="primary"
        startIcon={<ThumbUpIcon />}
        onClick={() => handleLike(feedback, msg)}
      >
        {feedback === "Liked" ? (
          <ThumbUpIcon className="thumbs_up" />
        ) : (
          <ThumbUpOutlinedIcon className="thumbs_up" />
        )}
      </Box>
      <Box
        className="feedback_system"
        style={{ unset: "all", cursor: "pointer" }}
        variant="contained"
        color="error"
        startIcon={<ThumbDownIcon />}
        onClick={() => handleDislike(feedback, msg)}
      >
        {feedback === "Disliked" ? (
          <ThumbDownIcon color="error" className="thumbs_down" />
        ) : (
          <ThumbDownOffAltOutlinedIcon color="error" className="thumbs_down" />
        )}
      </Box>
    </div>
  );
}

export default FeedbackButtons;
