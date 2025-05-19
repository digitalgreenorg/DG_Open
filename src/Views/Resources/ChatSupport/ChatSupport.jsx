import {
  Box,
  Divider,
  InputAdornment,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import HTTPService from "../../../Services/HTTPService";
import UrlConstant from "../../../Constants/UrlConstants";
import { GetErrorHandlingRoute, getTokenLocal } from "../../../Utils/Common";
import { FarmStackContext } from "../../../Components/Contexts/FarmStackContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./style.css";
import FeedbackButtons from "./FeedbackButtons";
import CloseIcon from "@mui/icons-material/Close";
import YouTubeEmbed from "../../../Components/YouTubeEmbed/YouTubeEmbed";

const converstationListStyle = {
  minHeight: "60vh",
  maxHeight: "45vh",
  overflow: "auto",
};
const listStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "40vh",
  maxHeight: "45vh",
};
const ChatSupport = () => {
  const location = useLocation();
  const history = useHistory();

  const chatContainerRef = useRef(null);
  const { callToast, callLoader } = useContext(FarmStackContext);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const [likeOrDislike, setLikeOrDislike] = useState(false);
  const [callDueToLikeOrDislike, setcallDueToLikeOrDislike] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
      event.preventDefault();
    }
  };

  const sendMessage = async () => {
    if (message.trim() === "" || isLoading) return;

    const sentMessage = { text: message, sender: "user" };
    setConversation([...conversation, sentMessage]);

    let url = UrlConstant.base_url + UrlConstant.resource_chat_api;
    let accessToken = getTokenLocal() ?? false;
    let body = {
      query: message,
    };
    if (location?.state?.resourceId) {
      body = { ...body, resource: location?.state?.resourceId };
    }
    setIsLoading(true);
    setMessage("");
    HTTPService("POST", url, body, false, true, accessToken)
      .then((response) => {
        const apiResponse = response?.data;
        setConversation([
          ...conversation,
          sentMessage,
          {
            text: renderTextWithLinks(apiResponse.query_response),
            sender: "bot",
            feedback: apiResponse.feedback,
            messageId: apiResponse.id,
          },
        ]);
        setIsLoading(false);
      })
      .catch(async (e) => {
        setIsLoading(false);
        let error = await GetErrorHandlingRoute(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  };

  const fetchChatHistory = async (callFromLikeOrDislike) => {
    let url = UrlConstant.base_url + UrlConstant.resource_chat_history;
    let accessToken = getTokenLocal() ?? false;
    let body = {};
    if (location?.state?.resourceId) {
      body = { ...body, resource: location?.state?.resourceId };
    }
    callLoader(true);
    await HTTPService("POST", url, body, false, true, accessToken)
      .then((response) => {
        let chatHistory = response?.data
          ?.map((item) => [
            { text: item.query, sender: "user" },
            {
              text: renderTextWithLinks(item.query_response),
              sender: "bot",
              feedback: item.feedback,
              messageId: item.id,
            },
          ])
          .flat();
        callLoader(false);
        setConversation(chatHistory);
        setcallDueToLikeOrDislike(callFromLikeOrDislike ? true : false);
      })
      .catch(async (e) => {
        callLoader(false);
        let error = await GetErrorHandlingRoute(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  async function likeDislikeResponse(status, messageId, currentValuOfLike) {
    let url =
      UrlConstant.base_url +
      UrlConstant.resource_like_dislike +
      `${messageId}/`;
    let accessToken = getTokenLocal() ?? false;
    let body = {};
    // checking for the valid window for chat
    if (location?.state?.resourceId) {
      body = { feedback: currentValuOfLike ? "Liked" : "Disliked" }; // checking the boolean condition for like/dislike
    }
    callLoader(true);
    await HTTPService("PATCH", url, body, false, true, accessToken)
      .then((response) => {
        // callLoader(false);
        fetchChatHistory(true); // fetching the updated data and setting it
      })
      .catch(async (e) => {
        callLoader(false);
        let error = await GetErrorHandlingRoute(e);
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        if (error.path) {
          history.push(error.path);
        }
      });
  }

  const handleLike = (feedback, message) => {
    likeDislikeResponse(feedback, message.messageId, true);
  };

  const handleDislike = (feedback, message) => {
    likeDislikeResponse(feedback, message.messageId, false);
  };

  function renderTextWithLinks(text) {
    // Regular expression to find URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Replace \n with <br /> and then split the text into an array of parts (text and links)
    const parts = text.split(urlRegex);

    // Map each part to React elements
    const elements = parts.map((part, index) => {
      if (part.match(urlRegex)) {
        const trimmedPart = part.replace(/\.$/, "");
        return (
          <>
            <a
              key={index}
              href={trimmedPart}
              target="_blank"
              rel="noopener noreferrer"
            >
              {trimmedPart}
            </a>
            <YouTubeEmbed key={index} embedUrl={trimmedPart} />
          </>
        );
      } else {
        // If part is regular text, split it further using <br /> for line breaks
        const lines = part.split("\n").map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line}
            <br />
          </React.Fragment>
        ));
        return <span key={index}>{lines}</span>;
      }
    });

    return <>{elements}</>;
  }
  useEffect(() => {
    if (!callDueToLikeOrDislike) scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  return (
    <Box
      sx={{
        margin: mobile ? "0px 30px 0px 30px" : "0px 50px 0px 50px",
      }}
    >
      <Paper
        sx={{
          margin: "auto",
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        }}
      >
        <Box
          sx={{
            background: "#F6F6F6",
            padding: "20px 25px 20px 25px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h5"
            component="h3"
            style={{
              color: "#424242",
              fontSize: mobile ? "16px" : "18px",
            }}
          >
            {location?.state?.resourceName ? (
              <span>
                You are interacting with{" "}
                <span style={{ fontWeight: 600 }}>
                  {location.state.resourceName}
                </span>{" "}
                content
              </span>
            ) : (
              "You are interacting with Vistaar's Diverse Resources"
            )}
          </Typography>
          <Box>
            <CloseIcon
              onClick={() => history.go(-1)}
              sx={{ cursor: "pointer" }}
            />
          </Box>
        </Box>
        <Divider />
        <Box sx={{ padding: "20px 20px 10px 20px" }}>
          <List
            sx={conversation?.length ? converstationListStyle : listStyle}
            ref={chatContainerRef}
          >
            {conversation?.length ? (
              conversation?.map((msg, index) => (
                <ListItem
                  key={index}
                  sx={{
                    justifyContent: msg.sender === "bot" ? "left" : "right",
                  }}
                >
                  <Box
                    sx={{
                      textAlign: "left",
                      backgroundColor:
                        msg.sender === "bot" ? "#f5f5f5" : "#d3ede6",
                      padding: "6px 13px",
                      borderRadius: "12px",
                      margin: "4px 0px 4px 0px",
                      maxWidth: mobile || tablet ? "290px" : "490px",
                      wordWrap: "break-word",
                    }}
                  >
                    {msg.text} <br />
                    {"feedback" in msg ? (
                      <FeedbackButtons
                        feedback={msg?.feedback}
                        handleLike={handleLike}
                        handleDislike={handleDislike}
                        msg={msg}
                      />
                    ) : (
                      ""
                    )}
                  </Box>
                </ListItem>
              ))
            ) : (
              <Box sx={{ maxWidth: "36rem" }}>
                <span
                  style={{
                    color: "#424242",
                    fontWeight: 600,
                    letterSpacing: "1.2px",
                  }}
                >
                  Welcome to Content Query!{" "}
                </span>
                Type your question in the box below and hit send. Our system
                will help you find answers related to your resources and content
                files.
              </Box>
            )}
          </List>
          {isLoading ? (
            <div class="loader">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : null}
          <div>
            <TextField
              name="query"
              label="Type your query"
              placeholder="Type your query"
              variant="outlined"
              fullWidth
              value={message}
              onChange={handleMessageChange}
              onKeyDown={handleKeyPress}
              sx={{
                marginRight: "10px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#919EAB",
                  },
                  "&:hover fieldset": {
                    borderColor: "#919EAB",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#919EAB",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  borderRight: "1px solid #919EAB",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SendIcon
                      onClick={sendMessage}
                      className="cursor-pointer"
                    />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatSupport;
