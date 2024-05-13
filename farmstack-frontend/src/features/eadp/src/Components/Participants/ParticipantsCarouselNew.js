import React, { useEffect, useContext, useState } from "react";
import { Container } from "react-bootstrap";
import Slider from "react-slick";
import UrlConstant from "../../Constants/UrlConstants";
import { useHistory } from "react-router-dom";
import { FarmStackContext } from "common/components/context/EadpContext/FarmStackProvider";
import { GetErrorHandlingRoute } from "common/utils/utils";
import HTTPService from "common/services/HTTPService";
import { Box } from "@mui/material";
import NoData from "../NoData/NoData";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import CustomCard from "../Card/CustomCard";
import LocalStyle from "./ParticipantsCarouselNew.module.css";

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
  let title = isCosteward ? "Co-steward" : "Participants";
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
        console.log();
        if (response?.data?.results) setParticipantsList(response.data.results);
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
            title={"There are no Participants!"}
            subTitle={
              "As of now there are no participants, so add participants or invite participants."
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
                    subTitle1="Datasets"
                    subTitle2={
                      title == "Participants"
                        ? "Root user"
                        : "No.of participants"
                    }
                    subTitle1Value={participant?.dataset_count}
                    subTitle2Value={
                      title == "Participants"
                        ? participant?.user?.first_name +
                          " " +
                          participant?.user?.last_name
                        : participant?.number_of_participants
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
