import React, { useEffect, useContext, useState } from "react";
import { Container } from "react-bootstrap";
import Slider from "react-slick";
import UrlConstant from "../../Constants/UrlConstants";
import { useHistory } from "react-router-dom";
import { FarmStackContext } from "../Contexts/FarmStackContext";
import { GetErrorHandlingRoute } from "../../Utils/Common";
import HTTPService from "../../Services/HTTPService";
import { Box, Tooltip } from "@mui/material";
import NoData from "../NoData/NoData";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import CustomCard from "../Card/CustomCard";
import LocalStyle from "./ParticipantsCarouselNew.module.css";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ArticleIcon from "@mui/icons-material/Article";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import LanguageIcon from "@mui/icons-material/Language";
import WebhookIcon from "@mui/icons-material/Webhook";
import PersonIcon from "@mui/icons-material/Person";

const ParticipantsCarouselNew = (props) => {
  const { isCosteward } = props;
  const [participantsList, setParticipantsList] = useState([]);
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    className: LocalStyle.slides,
    responsive: [
      {
        breakpoint: 3060,
        settings: {
          slidesToShow:
            participantsList.length >= 4 ? 4 : participantsList.length,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 2560,
        settings: {
          slidesToShow:
            participantsList.length >= 4 ? 4 : participantsList.length,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1920,
        settings: {
          slidesToShow:
            participantsList.length >= 4 ? 4 : participantsList.length,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow:
            participantsList.length >= 3 ? 3 : participantsList.length,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  let title = isCosteward ? "Co-steward" : "Partners";
  const history = useHistory();
  const { callLoader, callToast, isLoading } = useContext(FarmStackContext);
  const getCoStewardOrParticipantsOnLoad = (
    unApprovedId,
    approval_endpoint
  ) => {
    console.log("in getCoStewardOrParticipantsOnLoad");
    callLoader(true);

    let url =
      UrlConstant.base_url + UrlConstant.microsite_participant_end_point_new;
    let params = {};
    if (isCosteward) params = { co_steward: "True" };

    if (approval_endpoint)
      url = UrlConstant.participant + unApprovedId + "?approval_status=True";
    HTTPService("GET", url, params, false, false)
      .then((response) => {
        console.log(
          "🚀 ~ file: ParticipantsCarouselNew.js:112 ~ .then ~ response:",
          response
        );
        callLoader(false);
        if (response?.data?.results) {
          let tempResources = [...response?.data?.results];
          const temp = tempResources?.forEach((resour) => {
            let youtube = resour?.content_files_count.find(
              (resour) => resour.type === "youtube"
            );
            let file = resour?.content_files_count.find(
              (item) => item.type === "file"
            );
            let pdf = resour?.content_files_count.find(
              (item) => item.type === "pdf"
            );
            let api = resour?.content_files_count.find(
              (item) => item.type === "api"
            );
            let website = resour?.content_files_count.find(
              (item) => item.type === "website"
            );
            resour.pdf_count = pdf?.count ?? 0;
            resour.video_count = youtube?.count ?? 0;
            resour.file_count = file?.count ?? 0;
            resour.api_count = api?.count ?? 0;
            resour.website_count = website?.count ?? 0;
          });
          setParticipantsList(tempResources);
        }
      })
      .catch(async (e) => {
        callLoader(false);
        let error = await GetErrorHandlingRoute(e);
        console.log("Error obj", error);
        console.log(e);
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
  console.log("participants list ", participantsList);

  useEffect(() => {
    getCoStewardOrParticipantsOnLoad();
  }, []);

  return (
    <Container className="carousel_in_guest_user_main_page">
      {participantsList.length === 0 && !isLoading ? (
        <Box p={3}>
          <NoData
            title={
              isCosteward
                ? "There are no Costewards!"
                : "There are no Partners!"
            }
            subTitle={
              isCosteward
                ? "As of now there are no Costewards, so add Costewards or invite Costewards."
                : "As of now there are no partners, so add partners or invite partners."
            }
          />
        </Box>
      ) : (
        ""
      )}
      <Slider {...settings}>
        {participantsList.length === 0 && !isLoading
          ? ""
          : participantsList?.map((participant, index) => {
              return (
                <div
                  id={title + "grid-card-id"}
                  className={GlobalStyle.padding0}
                  xs={12}
                  sm={12}
                  md={6}
                  xl={4}
                  onClick={() => {
                    localStorage.setItem("last_route", "/home");
                    isCosteward
                      ? history.push(
                          `/home/costeward/view/${participant?.user_id}`
                        )
                      : history.push(
                          `/home/participants/view/${participant?.user_id}`
                        );
                  }}
                >
                  <CustomCard
                    image={participant?.organization?.logo}
                    title={participant?.organization?.name}
                    subTitle1="Content"
                    subTitle2={
                      title == "Partners" ? "Root User" : "No. of Partners"
                    }
                    subTitle1Value={
                      <Box
                        className="d-flex"
                        sx={{ marginLeft: "-2.5px", marginTop: "10px" }}
                      >
                        <Tooltip title="Youtube" placement="top" arrow>
                          <Box sx={{ marginRight: "16px", display: "flex" }}>
                            <YouTubeIcon
                              className="mr-7"
                              sx={{ fill: "#424242" }}
                            />
                            <span className={LocalStyle.count_text}>
                              {participant?.video_count}
                            </span>
                          </Box>
                        </Tooltip>
                        <Tooltip title="Docs" placement="top" arrow>
                          <Box sx={{ display: "flex", marginRight: "16px" }}>
                            <ArticleIcon
                              className="mr-7"
                              sx={{ fill: "#424242" }}
                            />
                            <span className={LocalStyle.count_text}>
                              {participant?.pdf_count ?? 0}
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
                              {participant?.file_count ?? 0}
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
                              {participant?.api_count ?? 0}
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
                              {participant?.website_count ?? 0}
                            </span>
                          </Box>
                        </Tooltip>
                      </Box>
                    }
                    subTitle2Value={
                      title == "Partners" ? (
                        <span style={{ marginRight: "17px" }}>
                          {participant?.user?.first_name +
                            " " +
                            participant?.user?.last_name}
                        </span>
                      ) : (
                        <span style={{ marginRight: "3px" }}>
                          <PersonIcon
                            className="mr-7"
                            sx={{ fill: "#424242" }}
                          />
                          {participant?.number_of_participants}
                        </span>
                      )
                    }
                    index={index}
                  />
                </div>
              );
            })}
      </Slider>
    </Container>
  );
};

export default ParticipantsCarouselNew;
