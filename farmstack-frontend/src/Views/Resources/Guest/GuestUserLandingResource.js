import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import UrlConstant from "../../../Constants/UrlConstants";
import { useHistory } from "react-router-dom";
import { FarmStackContext } from "../../../Components/Contexts/FarmStackContext";
import HTTPService from "../../../Services/HTTPService";
import ResourceCard from "../../../Components/Resources/ResourceCard";
import LocalStyle from "../../../Components/Dataset/DatasetListNew.module.css";
import GlobalStyle from "../../../Assets/CSS/global.module.css";
import { Row } from "react-bootstrap";
import NoData from "../../../Components/NoData/NoData";
import local_style from "./guestUserLandingResource.module.css";
import labels from "../../../Constants/labels";
import { toTitleCase } from "../../../Utils/Common";
const GuestUserLandingResource = ({ user }) => {
  const { callLoader } = useContext(FarmStackContext);
  const history = useHistory();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const miniLaptop = useMediaQuery(theme.breakpoints.down("lg"));
  const [resources, setResources] = useState([]);
  // const [pdfCount, setPdfCount] = useState(0);
  // const [videoCount, setVideoCount] = useState(0);
  const getViewAllRoute = () => {
    if (user === "guest") {
      return `/home/resources`;
    }
  };

  const handleCardClick = (id) => {
    if (user === "guest") {
      return `/home/resources/view/${id}`;
    }
  };
  let resourcesL = labels.renaming_modules.resources;
  let resource = labels.renaming_modules.resource;
  let Resources = toTitleCase(labels.renaming_modules.resources);
  let Resource = toTitleCase(labels.renaming_modules.resource);

  const getResources = () => {
    let url = UrlConstant.base_url + UrlConstant.microsite_resource_endpoint;
    callLoader(true);
    HTTPService("GET", url, false, false, false)
      .then((response) => {
        callLoader(false);
        let tempResources = [];
        tempResources = [...response.data.results];
        const temp = tempResources?.forEach((resour) => {
          let pdfCount = 0;
          let videoCount = 0;
          let tmpf = resour?.content_files_count?.forEach((file) => {
            if (file?.type === "pdf") {
              pdfCount += file.count;
            } else if (file?.type === "youtube") {
              videoCount += file.count;
            }
          });
          resour.pdf_count = pdfCount;
          resour.video_count = videoCount;
        });
        setResources(tempResources);
      })
      .catch((err) => {
        callLoader(false);
        console.log("error", err);
      });
  };

  useEffect(() => {
    getResources();
  }, []);

  return (
    <Box sx={{ marginTop: "29px" }}>
      {resources?.length > 0 ? (
        <Box
          className={
            mobile
              ? local_style.main_box_mobile
              : tablet
              ? local_style.main_box_tablet
              : miniLaptop
              ? local_style.main_box_tablet
              : local_style.main_box
          }
        >
          {resources?.map((item, index) => {
            return (
              <ResourceCard
                key={item.id}
                item={item}
                handleCardClick={handleCardClick}
                index={index}
                history={history}
                userType={"guest"}
              />
            );
          })}
        </Box>
      ) : (
        <NoData
          title={`There are no ${resourcesL}`}
          subTitle={
            user === "guest"
              ? `As of now there are no ${resourcesL}.`
              : `As of now there are no ${resourcesL}, so add new ${resource}!`
          }
          // primaryButton={user === "guest" ? false : "Add new Resource "}
          // primaryButtonOnClick={() => history.push(addResource())}
        />
      )}
      <Row className={LocalStyle.buttonContainer}>
        <Button
          id={"details-page-load-more-dataset-button"}
          variant="outlined"
          className="custom_button m-auto"
          // className={`${GlobalStyle.primary_button} ${LocalStyle.loadMoreButton} ${GlobalStyle.homeButtonWidth}`}
          onClick={() => history.push(getViewAllRoute())} // passing true will call loadmore api
        >
          View all {resourcesL}
        </Button>
      </Row>
    </Box>
  );
};

export default GuestUserLandingResource;
