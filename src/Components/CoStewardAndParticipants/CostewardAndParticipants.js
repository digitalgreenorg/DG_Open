import {
  Typography,
  Card,
  useTheme,
  useMediaQuery,
  Box,
  Tooltip,
} from "@mui/material";
import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import CustomCard from "../Card/CustomCard";
import LocalStyle from "./CostewardAndParticipants.module.css";
import { useHistory } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { getTokenLocal, isLoggedInUserAdmin } from "../../Utils/Common";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ArticleIcon from "@mui/icons-material/Article";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import LanguageIcon from "@mui/icons-material/Language";
import WebhookIcon from "@mui/icons-material/Webhook";
import Contents from "./Contents";

const CoStewardAndParticipantsCard = (props) => {
  const {
    coStewardOrParticipantsList,
    viewType,
    setViewType,
    title, // card is being render based in title if title is changing check all condition based on title
    handleLoadMoreButton,
    loadMoreButton,
    guestUser,
    isCosteward,
    subTitle,
    isCostewardsParticipant,
  } = props;
  const history = useHistory();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));

  // if(!viewType) viewType = "grid"

  // const getContentTypeCount = (type) => {
  //   const content = participant?.content_files_count || [];
  //   const item = content.find((item) => item.type === type);
  //   return item ? item.count : 0;
  // };

  const handleViewDataset = (id) => {
    console.log("🚀 ~ handleViewDataset ~ id:", id);
    console.log(
      "🚀 ~ handleViewDataset ~ isCostewardsParticipant:",
      isCostewardsParticipant
    );
    console.log("🚀 ~ handleViewDataset ~ isCosteward:", isCosteward);
    console.log("🚀 ~ handleViewDataset ~ guestUser:", guestUser);
    console.log("🚀 ~ handleViewDataset ~ title:", title);
    if (isCostewardsParticipant) {
      history.push(`/datahub/costeward/participants/view/${id}`);
    } else if (guestUser && isCosteward) {
      history.push(`/home/costeward/view/${id}`);
      localStorage.setItem("last_route", "/home");
    } else if (
      (guestUser && !isCosteward) ||
      (title == "Co-steward participants" && guestUser)
    ) {
      localStorage.setItem("last_route", "/home");
      history.push(`/home/participants/view/${id}`);
    } else if (title == "Partners" || title == "Co-steward partners") {
      history.push(`/datahub/participants/view/${id}`);
    } else if (title == "Costewards") {
      history.push(`/datahub/costeward/view/${id}`);
    } else if (
      title == "New partner requests" ||
      title == "New partners requests"
    ) {
      history.push(`/datahub/participants/view/approve/${id}`);
    } else if (title == "Partners" && guestUser) {
      localStorage.setItem("last_route", "/home");
      history.push("/home/participants/view/:id");
    }
  };

  let index = 0;
  return (
    <>
      <Row
        className={
          mobile ? LocalStyle.titleContainerSm : LocalStyle.titleContainer
        }
      >
        <Box
          className={!mobile && !tablet ? LocalStyle.titleParentDiv : "w-100"}
        >
          <Typography
            id={title?.split(" ")[0] + "title"}
            className={`${GlobalStyle.size24} ${GlobalStyle.bold600} ${
              mobile ? LocalStyle.titleSm : LocalStyle.title
            }`}
          >
            {title}
          </Typography>
          <Typography
            className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
          >
            {subTitle}
          </Typography>
        </Box>
        {viewType === "list" && title === "Partners" && !mobile ? (
          <Col
            className={LocalStyle.listViewButton}
            xs={6}
            sm={6}
            md={6}
            xl={6}
          >
            {title == "Partners" && !guestUser ? (
              <Row>
                <Col lg={6}>
                  <div>
                    <Button
                      data-testid="invite-btn-test-list"
                      id="add-participant-submit-button"
                      onClick={() =>
                        history.push("/datahub/participants/invite")
                      }
                      className={`${GlobalStyle.outlined_button} ${LocalStyle.primary}`}
                    >
                      + Invite Participants
                    </Button>
                  </div>
                </Col>
                <Col lg={6}>
                  <div>
                    <Button
                      data-testid="add-new-participants"
                      id="add-participant-submit-button"
                      onClick={() => history.push("/datahub/participants/add")}
                      className={`${GlobalStyle.primary_button} ${LocalStyle.primary}`}
                    >
                      Add New Partner
                    </Button>
                  </div>
                </Col>
              </Row>
            ) : (
              ""
            )}
            <Row className={LocalStyle.listAndGridViewTextContainer}>
              <div
                id={title?.split(" ")[0] + "grid-view"}
                className={LocalStyle.viewType}
                data-testid="grid-view"
                onClick={() => setViewType("grid")}
              >
                <img
                  className={LocalStyle.listAndgridViewImg}
                  src={
                    viewType === "grid"
                      ? require("../../Assets/Img/grid_view_active.svg")
                      : viewType === "list"
                      ? require("../../Assets/Img/grid_view.svg")
                      : ""
                  }
                />
                <span
                  id={title?.split(" ")[0] + "grid-view-title"}
                  className={
                    viewType === "grid"
                      ? `${LocalStyle.activeView}`
                      : `${LocalStyle.inActiveView} ` +
                        `${GlobalStyle.size16} ${GlobalStyle.bold400}`
                  }
                >
                  Grid view
                </span>
              </div>
              <div
                id={title?.split(" ")[0] + "list-view"}
                data-testid="list-view"
                onClick={() => setViewType("list")}
                className={LocalStyle.viewType}
              >
                <img
                  className={LocalStyle.listAndgridViewImg}
                  src={
                    viewType === "list"
                      ? require("../../Assets/Img/list_view_active.svg")
                      : require("../../Assets/Img/list_view.svg")
                  }
                />
                <span
                  id={title?.split(" ")[0] + "list-view-title"}
                  className={
                    viewType === "list"
                      ? `${LocalStyle.activeView}`
                      : `${LocalStyle.inActiveView} ` +
                        `${GlobalStyle.size16} ${GlobalStyle.bold400}`
                  }
                >
                  List view
                </span>
              </div>
            </Row>
          </Col>
        ) : viewType && !mobile ? (
          <Col
            className={
              tablet && title == "Partners"
                ? LocalStyle.listAndGridViewButtonMd
                : LocalStyle.listAndGridViewButton
            }
            xs={6}
            sm={6}
            md={6}
            xl={6}
          >
            {title == "Partners" && !guestUser ? (
              <div className={tablet ? "d-flex" : ""}>
                <Button
                  id="add-participant-submit-button"
                  data-testid="invite-btn-test"
                  onClick={() => history.push("/datahub/participants/invite")}
                  className={`${GlobalStyle.primary_button} ${LocalStyle.primary}`}
                >
                  + Invite Partners
                </Button>
              </div>
            ) : (
              ""
            )}
            <div
              id={title?.split(" ")[0] + "grid-view"}
              className={LocalStyle.viewType}
              onClick={() => setViewType("grid")}
              data-testid="grid-view-test"
            >
              <img
                className={LocalStyle.listAndgridViewImg}
                src={
                  viewType === "grid"
                    ? require("../../Assets/Img/grid_view_active.svg")
                    : viewType === "list"
                    ? require("../../Assets/Img/grid_view.svg")
                    : ""
                }
              />
              <span
                id={title?.split(" ")[0] + "grid-view-title"}
                className={
                  viewType === "grid"
                    ? `${LocalStyle.activeView}`
                    : `${LocalStyle.inActiveView} ` +
                      `${GlobalStyle.size16} ${GlobalStyle.bold400}`
                }
              >
                Grid view
              </span>
            </div>
            <div
              id={title?.split(" ")[0] + "list-view"}
              onClick={() => setViewType("list")}
              className={LocalStyle.viewType}
              data-testid="list-view-test"
            >
              <img
                className={LocalStyle.listAndgridViewImg}
                src={
                  viewType === "list"
                    ? require("../../Assets/Img/list_view_active.svg")
                    : require("../../Assets/Img/list_view.svg")
                }
              />
              <span
                id={title?.split(" ")[0] + "list-view-title"}
                className={
                  viewType === "list"
                    ? `${LocalStyle.activeView}`
                    : `${LocalStyle.inActiveView} ` +
                      `${GlobalStyle.size16} ${GlobalStyle.bold400}`
                }
              >
                List view
              </span>
            </div>
          </Col>
        ) : (
          ""
        )}
      </Row>
      <CSSTransition
        appear={viewType === "grid" || !viewType}
        in={viewType === "grid" || !viewType}
        timeout={{
          appear: 600,
          enter: 700,
          exit: 100,
        }}
        classNames="step"
        unmountOnExit
      >
        <Row
          id={title?.split(" ")[0] + "grid-card-container-id"}
          className={LocalStyle.cardContainer}
        >
          {title == "Partners" && getTokenLocal() && !guestUser ? (
            <Col
              id={title?.split(" ")[0] + "grid-card-id"}
              className={GlobalStyle.padding0}
              xs={12}
              sm={12}
              md={6}
              xl={4}
              data-testid="add-new-participants-test"
              onClick={() => history.push("/datahub/participants/add")}
            >
              <Card
                id={`${title ? title?.split(" ")[0] : "title"}-card-${
                  index ? index : ""
                }`}
                style={{
                  width: "450px !important",
                }}
                className={LocalStyle.card}
              >
                <Typography
                  id={title?.split(" ")[0] + "title"}
                  className={`${GlobalStyle.size20} ${GlobalStyle.bold700} ${LocalStyle.addTitle}`}
                >
                  Add New Partner
                </Typography>
                <div className={LocalStyle.img_container}>
                  <img
                    className={LocalStyle.img}
                    id={`${title ? title?.split(" ")[0] : "title"}-card-img-${
                      index ? index : ""
                    }`}
                    src={require("../../Assets/Img/add_img.svg")}
                    alt="new"
                  />
                </div>
                <div
                  id={`${title ? title?.split(" ")[0] : "title"}-card-title-${
                    index ? index : ""
                  }`}
                  className={LocalStyle.addCardDescription}
                >
                  Expand your network by adding new participants to collaborate
                  and exchange data.
                </div>
              </Card>
            </Col>
          ) : (
            ""
          )}
          {coStewardOrParticipantsList?.map((participant, index) => {
            console.log(participant, "participant***");
            let id = participant?.user_id;
            return (
              <Col
                id={title?.split(" ")[0] + "grid-card-id" + index}
                className={GlobalStyle.padding0}
                xs={12}
                sm={12}
                md={6}
                xl={4}
                onClick={() => handleViewDataset(id)}
                data-testid="grid-item"
              >
                <CustomCard
                  image={participant?.organization?.logo}
                  title={participant?.organization?.name}
                  subTitle1={
                    title == "New partner requests" ? "User" : "Content"
                  }
                  subTitle2={
                    title == "Partners" || title == "Our Partners are"
                      ? "Root user"
                      : title == "New partner requests"
                      ? "User email"
                      : title === "Co-steward partners"
                      ? "Dataset"
                      : "No.of partners"
                  }
                  subTitle1Value={
                    title == "New partner requests" ? (
                      participant?.user?.first_name
                    ) : (
                      <Box
                        className="d-flex"
                        sx={{ marginLeft: "-2.5px", marginTop: "10px" }}
                      >
                        <Contents participant={participant} />

                        {/* <Tooltip title="Youtube" placement="top" arrow>
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
                        </Tooltip> */}
                      </Box>
                    )
                  }
                  subTitle2Value={
                    title == "Partners" || title == "Our Partners are"
                      ? participant?.user?.first_name
                      : title == "New partner requests"
                      ? participant?.user?.email
                      : title === "Co-steward partners"
                      ? participant?.dataset_count
                      : participant?.number_of_participants
                  }
                  index={index}
                />
              </Col>
            );
          })}
        </Row>
      </CSSTransition>
      <CSSTransition
        appear={viewType !== "grid"}
        in={viewType !== "grid"}
        timeout={{
          appear: 600,
          enter: 700,
          exit: 100,
        }}
        classNames="step"
        unmountOnExit
      >
        <>
          <Row>
            {title === "Costewards" || isCosteward ? (
              <>
                <Col
                  className={`${LocalStyle.listHeader1} ${GlobalStyle.size16} ${GlobalStyle.bold600}`}
                  xs={4}
                  sm={4}
                  md={4}
                  xl={4}
                >
                  State (or) organisation name
                </Col>
                <Col
                  className={`${GlobalStyle.size16} ${GlobalStyle.bold600}`}
                  xs={4}
                  sm={4}
                  md={4}
                  xl={4}
                >
                  Content
                </Col>
                <Col
                  className={`${GlobalStyle.size16} ${GlobalStyle.bold600}`}
                  xs={4}
                  sm={4}
                  md={4}
                  xl={4}
                >
                  No.of partners
                </Col>
              </>
            ) : title === "Partners" ? (
              <>
                <Col
                  className={`${LocalStyle.listHeader1} ${GlobalStyle.size16} ${GlobalStyle.bold600}`}
                  xs={4}
                  sm={4}
                  md={4}
                  xl={4}
                >
                  Organisation name
                </Col>
                <Col
                  className={`${GlobalStyle.size16} ${GlobalStyle.bold600}`}
                  xs={4}
                  sm={4}
                  md={4}
                  xl={4}
                >
                  Content
                </Col>
                <Col
                  className={`${GlobalStyle.size16} ${GlobalStyle.bold600}`}
                  xs={4}
                  sm={4}
                  md={4}
                  xl={4}
                >
                  Root user
                </Col>
              </>
            ) : title === "New partner requests" ? (
              <>
                <Col
                  className={`${LocalStyle.listHeader1} ${GlobalStyle.size16} ${GlobalStyle.bold600}`}
                  xs={4}
                  sm={4}
                  md={4}
                  xl={4}
                >
                  Organisation name
                </Col>
                <Col
                  className={`${GlobalStyle.size16} ${GlobalStyle.bold600} `}
                  xs={4}
                  sm={4}
                  md={4}
                  xl={4}
                >
                  User
                </Col>
                <Col
                  className={`${GlobalStyle.size16} ${GlobalStyle.bold600} `}
                  xs={4}
                  sm={4}
                  md={4}
                  xl={4}
                >
                  User email
                </Col>
              </>
            ) : (
              ""
            )}
          </Row>

          {viewType == "list" ? (
            <div className={LocalStyle.cardContainerList}>
              <hr />
              {coStewardOrParticipantsList?.map((item, index) => {
                return (
                  <>
                    <Row
                      data-testid="list-item"
                      key={index}
                      id={title + "-list-view-" + index}
                      className="d-flex justify-content-between mb-20 mt-20 cursor-pointer"
                      onClick={() => handleViewDataset(item?.user_id)}
                    >
                      {title === "Costewards" || isCosteward ? (
                        <>
                          <Col
                            id={
                              title?.split(" ")[0] + "list-view-title-" + index
                            }
                            className={
                              LocalStyle.content_title +
                              " datasets_list_view_text datasets_list_view_name green_text w-100 text-left"
                            }
                            xs={4}
                            sm={4}
                            md={4}
                            xl={4}
                            data-testid={`organization-name-${index}`}
                            style={{ wordBreak: "break-all" }}
                          >
                            {item?.organization?.name}
                          </Col>
                          <Col
                            xs={4}
                            sm={4}
                            md={4}
                            xl={4}
                            id={title + " list-view-datasets-no-" + index}
                            data-testid={`dataset-count-${index}`}
                            style={{ wordBreak: "break-all" }}
                          >
                            <Box>
                              <YouTubeIcon className="mr4" />
                              {/* Videos */}
                              <span className="mr-7">{item?.video_count}</span>
                              <ArticleIcon className="mr4" />
                              {/* Pdfs */}
                              <span>{item?.pdf_count} </span>
                              <FileCopyIcon className="mr4" />
                              <span>{item?.file_count} </span>
                              <WebhookIcon className="mr4" />
                              <span>{item?.api_count} </span>
                              <LanguageIcon className="mr4" />
                              <span>{item?.website_count} </span>
                            </Box>
                          </Col>
                          <Col
                            id={title + " list-view-participant-no-" + index}
                            xs={4}
                            sm={4}
                            md={4}
                            xl={4}
                            data-testid={`number-of-participants-${index}`}
                            style={{ wordBreak: "break-all" }}
                          >
                            {item?.number_of_participants}
                          </Col>
                        </>
                      ) : title === "Partners" ? (
                        <>
                          <Col
                            id={
                              title?.split(" ")[0] + "list-view-title-" + index
                            }
                            className={LocalStyle.content_title}
                            xs={4}
                            sm={4}
                            md={4}
                            xl={4}
                            data-testid={`part-organization-name-${index}`}
                            style={{ wordBreak: "break-all" }}
                          >
                            {item?.organization?.name}
                          </Col>
                          <Col
                            id={
                              title?.split(" ")[0] +
                              " list-view-datasets-no-" +
                              index
                            }
                            xs={4}
                            sm={4}
                            md={4}
                            xl={4}
                            data-testid={`part-dataset-count-${index}`}
                            style={{ wordBreak: "break-all" }}
                          >
                            <Box>
                              <YouTubeIcon className="mr4" />
                              {/* Videos */}
                              <span className="mr-7">{item?.video_count}</span>
                              <ArticleIcon className="mr4" />
                              {/* Pdfs */}
                              <span>{item?.pdf_count} </span>
                              <FileCopyIcon className="mr4" />
                              <span>{item?.file_count} </span>
                              <WebhookIcon className="mr4" />
                              <span>{item?.api_count} </span>
                              <LanguageIcon className="mr4" />
                              <span>{item?.website_count} </span>
                            </Box>
                          </Col>
                          <Col
                            id={
                              title?.split(" ")[0] +
                              " list-view-root-user-name-" +
                              index
                            }
                            xs={4}
                            sm={4}
                            md={4}
                            xl={4}
                            data-testid={`root-user-${index}`}
                            style={{ wordBreak: "break-all" }}
                          >
                            {item?.user?.first_name}
                          </Col>
                        </>
                      ) : title === "New partner requests" ? (
                        <>
                          <Col
                            id={
                              title?.split(" ")[0] + "list-view-title-" + index
                            }
                            className={LocalStyle.content_title}
                            xs={4}
                            sm={4}
                            md={4}
                            xl={4}
                            data-testid={`request-organization-name-${index}`}
                            style={{ wordBreak: "break-all" }}
                          >
                            {item?.organization?.name}
                          </Col>
                          <Col
                            className={LocalStyle.alignLeft}
                            id={
                              title?.split(" ")[0] +
                              " list-view-user-name-no-" +
                              index
                            }
                            xs={4}
                            sm={4}
                            md={4}
                            xl={4}
                            style={{
                              width: "100%",
                              maxWidth: "300px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              wordBreak: "break-all",
                            }}
                            data-testid={`request-user-name${index}`}
                          >
                            {item?.user?.first_name +
                              " " +
                              item?.user?.last_name}
                          </Col>
                          <Col
                            className={LocalStyle.alignLeft}
                            id={
                              title?.split(" ")[0] +
                              " list-view-user-email-no-" +
                              index
                            }
                            xs={4}
                            sm={4}
                            md={4}
                            xl={4}
                            style={{
                              width: "100%",
                              maxWidth: "300px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              wordBreak: "break-all",
                            }}
                            data-testid={`request-user-email${index}`}
                          >
                            {item?.user?.email}
                          </Col>
                        </>
                      ) : (
                        ""
                      )}
                    </Row>
                    <hr />
                  </>
                );
              })}
            </div>
          ) : (
            ""
          )}
        </>
      </CSSTransition>
      {loadMoreButton ? (
        <Box className={LocalStyle.buttonContainer} id="load-more-btn">
          <div>
            <Button
              onClick={handleLoadMoreButton}
              id={title?.split(" ")[0] + "-load-more-button"}
              data-testid="load-more-button-test-button"
              variant="outlined"
              className={`${
                mobile || tablet
                  ? LocalStyle.pButtonStyleMd
                  : LocalStyle.pButtonStyle
              }`}
            >
              Load more
            </Button>
          </div>
        </Box>
      ) : (
        ""
      )}
    </>
  );
};

export default CoStewardAndParticipantsCard;
