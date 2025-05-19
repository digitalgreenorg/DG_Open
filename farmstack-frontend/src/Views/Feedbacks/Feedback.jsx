import {
  Box,
  Button,
  Chip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import style from "./feedbacks.module.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  getTokenLocal,
  isHttpOrHttpsLink,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "../../Utils/Common";
import { useHistory, useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import UrlConstant from "../../Constants/UrlConstants";
import Axios from "axios";
import { FarmStackContext } from "../../Components/Contexts/FarmStackContext";

const Feedback = () => {
  const { callLoader, callToast } = useContext(FarmStackContext);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const history = useHistory();
  const { id } = useParams();

  const containerStyle = {
    marginLeft: mobile || tablet ? "30px" : "144px",
    marginRight: mobile || tablet ? "30px" : "144px",
  };
  const [feedback, setFeedback] = useState();

  //   const feedback = {
  //     message_id: "890cb47e-58b8-441e-ac99-c00601f44215",
  //     original_message: "What are pests in paddy?",
  //     translated_message: "What are pests in paddy?",
  //     message_response:
  //       "- Pests in paddy refer to insects or organisms that cause damage to the paddy crop.\n- Some common pests in paddy include:\n  - Brown plant hopper: It is a brown-colored insect that sucks juice from the stem and causes the gut to dry up. Infected spikelets turn white and can be easily pulled out.\n  - Leptocorisa or rice bug: It is a brown-colored long-legged insect that sucks milk from paddy grains, turning them into paddy khakri.\n  - Spodoptera mauritia or armyworm: It causes damage by feeding on leaves and forming eye- or boat-shaped spots that scorch the leaves.\n- Other pests may include insects like spider, dragonfly, ladybird beetle, and Trichogramma, which can be used for biological pest control.\n- It is important to manage pests in paddy to protect the crop and ensure a good yield.",
  //     message_translated_response:
  //       "- Pests in paddy refer to insects or organisms that cause damage to the paddy crop.\n- Some common pests in paddy include:\n  - Brown plant hopper: It is a brown-colored insect that sucks juice from the stem and causes the gut to dry up. Infected spikelets turn white and can be easily pulled out.\n  - Leptocorisa or rice bug: It is a brown-colored long-legged insect that sucks milk from paddy grains, turning them into paddy khakri.\n  - Spodoptera mauritia or armyworm: It causes damage by feeding on leaves and forming eye- or boat-shaped spots that scorch the leaves.\n- Other pests may include insects like spider, dragonfly, ladybird beetle, and Trichogramma, which can be used for biological pest control.\n- It is important to manage pests in paddy to protect the crop and ensure a good yield.",
  //     resource_string: "some string",
  //     message_feedback_description: "This is irrelevant",
  //     message_feedback_tags: [
  //       "No Relavant Answers",
  //       "Incomplete Content",
  //       "Incorrect Information",
  //       "Difficulty Level",
  //     ],
  //     resource_feedback_description: "This is resource_feedback_description",
  //     resource_feedback_tags: ["ember", "rmber", "omber"],
  //     message_feedback: "good",
  //     resource_feedback: "very good",
  //     message_feedback_images: [
  //       "https://vistaar-chatbot.s3.ap-south-1.amazonaws.com/AGRI_CHAT/message_feedback_images/image_1_890cb47e-58b8-441e-ac99-c00601f44215.jpg",
  //     ],
  //     message_feedback_audios: [
  //       "https://vistaar-chatbot.s3.ap-south-1.amazonaws.com/AGRI_CHAT/message_feedback_audios/audio_1_890cb47e-58b8-441e-ac99-c00601f44215.mp3",
  //     ],
  //     resource_feedback_images: [
  //       "https://vistaar-chatbot.s3.ap-south-1.amazonaws.com/AGRI_CHAT/message_feedback_images/image_1_890cb47e-58b8-441e-ac99-c00601f44215.jpg",
  //       "https://vistaar-chatbot.s3.ap-south-1.amazonaws.com/AGRI_CHAT/message_feedback_images/image_1_890cb47e-58b8-441e-ac99-c00601f44215.jpg",
  //       "https://vistaar-chatbot.s3.ap-south-1.amazonaws.com/AGRI_CHAT/message_feedback_images/image_1_890cb47e-58b8-441e-ac99-c00601f44215.jpg",
  //     ],
  //     resource_feedback_audios: [
  //       "https://vistaar-chatbot.s3.ap-south-1.amazonaws.com/AGRI_CHAT/message_feedback_audios/audio_1_890cb47e-58b8-441e-ac99-c00601f44215.mp3",
  //       "https://vistaar-chatbot.s3.ap-south-1.amazonaws.com/AGRI_CHAT/message_feedback_audios/audio_1_890cb47e-58b8-441e-ac99-c00601f44215.mp3",
  //     ],
  //     message_rating: 4,
  //     resource_rating: 5,
  //     phone: "9550150210",
  //     first_name: "Sai",
  //     last_name: "Sai",
  //     message_date: "30-10-2023",
  //     message_feedback_date: "30-10-2023",
  //     resource_feedback_date: "30-10-2023",
  //   };

  const handleClickRoutes = () => {
    if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
      history.push(`/datahub/feedbacks`);
    } else if (isLoggedInUserParticipant()) {
      history.push(`/participant/feedbacks`);
    }
  };
  function chips(chipName) {
    return (
      <Chip
        sx={{
          height: "auto",
          "& .MuiChip-label": {
            display: "block",
            whiteSpace: "normal",
          },
        }}
        label={
          chipName ? (
            isHttpOrHttpsLink(chipName) ? (
              <a href={chipName} target="_blank" rel="noopener noreferrer">
                {chipName}
              </a>
            ) : (
              chipName
            )
          ) : (
            "NA"
          )
        }
        color="success"
        className="mb-2"
        variant="outlined"
      />
    );
  }

  const getFeedbacks = () => {
    let accessToken = getTokenLocal() ?? false;
    let url = UrlConstant.feedback_bot_url;
    callLoader(true);
    Axios.get(url)
      .then((response) => {
        callLoader(false);
        if (response?.data?.length) {
          const getData = response?.data?.filter(
            (item) => item.message_id === id
          );
          console.log(
            "🚀 ~ file: Feedback.jsx:133 ~ .then ~ getData:",
            getData
          );

          setFeedback(getData?.[0]);
        }
      })
      .catch((err) => {
        callLoader(false);
      });
  };

  const fullNumber = feedback?.phone ?? "0000000000";
  const last4Digits = fullNumber?.slice(-3);
  const maskedNumber = last4Digits?.padStart(fullNumber.length, "*");

  useEffect(() => {
    getFeedbacks();
  }, []);
  return (
    <Box sx={containerStyle}>
      <div className="text-left mt-50">
        <span
          className="add_light_text cursor-pointer breadcrumbItem"
          onClick={() => history.push(handleClickRoutes())}
          id="add-dataset-breadcrum"
          data-testid="goPrevRoute"
        >
          {"Feedback"}
        </span>
        <span className="add_light_text ml-11">
          <ArrowForwardIosIcon sx={{ fontSize: "14px", fill: "#00A94F" }} />
        </span>
        <span className="add_light_text ml-11 fw600">View Feedback</span>
      </div>
      <Box className="d-flex align-items-baseline justify-content-between">
        <div className="bold_title mt-50">{`Feedback Details`}</div>
        <Box>
          <span className="mr-3">
            {chips(
              <Typography
                className={`${
                  mobile ? style.bold_text_sm : style.bold_text
                } mt5 break_word mb-1`}
              >
                Message Rating - {feedback?.message_rating}
                <StarIcon style={{ height: "18px", marginTop: "-4px" }} />
              </Typography>
            )}
          </span>
          <span>
            {chips(
              <Typography
                className={`${
                  mobile ? style.bold_text_sm : style.bold_text
                } mt5 break_word mb-1`}
              >
                Resource Rating - {feedback?.resource_rating}
                <StarIcon style={{ height: "18px", marginTop: "-4px" }} />
              </Typography>
            )}
          </span>
        </Box>
      </Box>
      <Row className="mt-50">
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>First name</Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            {feedback?.first_name ?? "NA"}
          </Typography>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>Last name</Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            {feedback?.last_name ?? "NA"}
          </Typography>
        </Col>
      </Row>
      <Row className="mt-50">
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>
            Phone number of FLEW
          </Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            {maskedNumber ?? "NA"}
          </Typography>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>
            Date of advisory retrival
          </Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            {feedback?.message_date ?? "NA"}
          </Typography>
        </Col>
      </Row>
      <div className={`${style.bold_title}`}>{`Message Details`}</div>
      <Row className="mt-50">
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>
            Question asked by FLEW
          </Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            {feedback?.original_message ?? "NA"}
          </Typography>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>
            Question translated
          </Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            {feedback?.translated_message ?? "NA"}
          </Typography>
        </Col>
      </Row>
      <Row className="mt-50">
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>Bot answer</Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            {feedback?.message_response ?? "NA"}
          </Typography>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>
            Translated Bot answer
          </Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            {feedback?.message_translated_response ?? "NA"}
          </Typography>
        </Col>
      </Row>
      <Row className="mt-50">
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>
            Thumbsup or Thumbsdown on Answer
          </Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            {feedback?.message_feedback ?? "NA"}
          </Typography>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>
            Text feedback on message by FLEW on answer
          </Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            {feedback?.message_feedback_description ?? "NA"}
          </Typography>
        </Col>
      </Row>
      <Row className="mt-50">
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>
            Audio Uploaded by FLEW for Answer
          </Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {feedback?.message_feedback_audios
                ? feedback?.message_feedback_audios?.map((item) => {
                    return (
                      <>
                        {/* <a
                          href={item}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item}
                        </a> */}
                        {chips(item)}
                      </>
                    );
                  })
                : "NA"}
            </div>
          </Typography>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>
            Tags given by FLEW on answer on answer
          </Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "7px",
              }}
            >
              {feedback?.message_feedback_tags
                ? feedback?.message_feedback_tags?.map((item) => {
                    return <>{chips(item)}</>;
                  })
                : "NA"}
            </div>
          </Typography>
        </Col>
      </Row>
      <Row className="mt-50">
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>
            Image uploaded by FLEW for Answer
          </Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            <div
              style={{
                // display: "grid",
                // gridTemplateColumns: "repeat(4, 1fr)",
                // rowGap: "7px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {feedback?.message_feedback_images
                ? feedback?.message_feedback_images?.map((item) => {
                    if (item) {
                      return (
                        <>
                          {/* <img src={item} height={30} width={30} /> */}
                          {chips(item)}
                          {/* <a
                              href={item}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item}
                            </a> */}
                        </>
                      );
                    }
                  })
                : "NA"}
            </div>
          </Typography>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>
            Date of feedback on answer
          </Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            {feedback?.message_feedback_date}
          </Typography>
        </Col>
      </Row>
      <div className={`${style.bold_title}`}>{`Resource Details`}</div>
      <Row className="mt-50">
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>
            Thumbsup or Thumbsdown on Video/media
          </Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            {feedback?.resource_feedback ?? "NA"}
          </Typography>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>
            Text feedback on message by FLEW on video/media
          </Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            {feedback?.resource_feedback_description ?? "NA"}
          </Typography>
        </Col>
      </Row>
      <Row className="mt-50">
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>
            Audio uploaded by FLEW for video/media
          </Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {feedback?.resource_feedback_audios
                ? feedback?.resource_feedback_audios?.map((item) => {
                    return (
                      <>
                        {/* <a
                          href={item}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item}
                        </a> */}
                        {chips(item)}
                      </>
                    );
                  })
                : "NA"}
            </div>
          </Typography>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>
            Tags given by FLEW on answer on video/media
          </Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "7px",
              }}
            >
              {feedback?.resource_feedback_tags
                ? feedback?.resource_feedback_tags?.map((item) => {
                    return <>{chips(item)}</>;
                  })
                : "NA"}
            </div>
          </Typography>
        </Col>
      </Row>
      <Row className="mt-50">
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>
            Image uploaded by FLEW for video/media
          </Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            <div
              style={{
                // display: "grid",
                // gridTemplateColumns: "repeat(4, 1fr)",
                // rowGap: "7px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {feedback?.resource_feedback_images
                ? feedback?.resource_feedback_images?.map((item) => {
                    return (
                      <>
                        {/* <img src={item} height={30} width={30} /> */}
                        {/* <a
                          href={item}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item}
                        </a> */}
                        {chips(item)}
                      </>
                    );
                  })
                : "NA"}
            </div>
          </Typography>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <Typography className={`${style.light_text}`}>
            Date of feedback on video/media
          </Typography>
          <Typography
            className={`${
              mobile ? style.bold_text_sm : style.bold_text
            } mt5 break_word`}
          >
            {feedback?.resource_feedback_date ?? "NA"}
          </Typography>
        </Col>
      </Row>
      <Row className="justify-content-center mt-50">
        <Button
          sx={{
            fontFamily: "Montserrat",
            fontWeight: 700,
            fontSize: "16px",
            width: mobile ? "145px" : "249px",
            height: "48px",
            border: "1px solid rgba(0, 171, 85, 0.48)",
            borderRadius: "8px",
            color: "#00A94F",
            textTransform: "none",
            "&:hover": {
              background: "none",
              border: "1px solid rgba(0, 171, 85, 0.48)",
            },
          }}
          variant="outlined"
          onClick={() => history.goBack()}
        >
          Back
        </Button>
      </Row>
    </Box>
  );
};

export default Feedback;
