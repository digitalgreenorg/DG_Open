import React from "react";
import { useState, useContext, useEffect } from "react";
import { Button, Typography, Divider } from "@mui/material";
import { Box } from "@mui/material";
import { useHistory } from "react-router-dom";
import { Container } from "react-bootstrap";
import SupportCard from "./SupportCard";
import SupportList from "./SupportList";
import { Row, Col } from "react-bootstrap";
import { FarmStackContext } from "../Contexts/FarmStackContext";
import {
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
  dateTimeFormat,
} from "../../Utils/Common";
import LocalStyle from "./Support.module.css";
import NoData from "../NoData/NoData";

export default function SupportTittleView({
  tabValue,
  setTabLabels,
  ticketList,
  loadMoreButton,
  getTicketListOnLoadMore,
  getListOfTickets,
  statusFilter,
  handleLoadMore,
}) {
  const { isLoading } = useContext(FarmStackContext);
  const [isGrid, setIsGrid] = useState(true);
  const history = useHistory();

  const handleAddTicketRoutes = () => {
    if (isLoggedInUserCoSteward()) {
      return `/datahub/support/add`;
    } else if (isLoggedInUserParticipant()) {
      return `/participant/support/add`;
    }
  };

  const handleSupportViewRoute = (id) => {
    if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
      return `/datahub/support/view/${id}`;
    } else if (isLoggedInUserParticipant()) {
      return `/participant/support/view/${id}`;
    }
  };

  useEffect(() => {
    getListOfTickets();
  }, [tabValue]);

  useEffect(() => {
    if (isLoggedInUserAdmin()) {
      setTabLabels(["Co-Steward Tickets", "Participant Tickets"]);
    }
    if (isLoggedInUserCoSteward()) {
      setTabLabels(["My Tickets", "My network tickets"]);
    }
  }, []);
  useEffect(() => {
    let tabValue = localStorage.getItem("supportTicketsTabValue");
    if (tabValue == 0) {
      localStorage.removeItem("supportTicketsTabValue");
    }
  });
  return (
    <>
      {isLoggedInUserAdmin() || isLoggedInUserCoSteward() ? (
        <Container>
          <div className="d-flex justify-content-between">
            <div className="bold_title">
              {isLoggedInUserAdmin()
                ? tabValue === 0
                  ? "List of Costeward tickets"
                  : "List of other tickets"
                : isLoggedInUserCoSteward()
                ? tabValue === 0
                  ? "List of my tickets"
                  : "List of my network tickets"
                : "List of other tickets"}
            </div>
            {ticketList.length > 0 && !isLoading ? (
              <div className="d-flex align-items-center mt-50 mb-20">
                <div
                  className="d-flex mr-30 cursor-pointer"
                  onClick={() => setIsGrid(false)}
                  id="dataset-list-view-id"
                >
                  <img
                    className="mr-7"
                    src={require(`../../Assets/Img/${
                      isGrid ? "list_view_gray.svg" : "list_view_green.svg"
                    }`)}
                  />
                  <Typography
                    sx={{
                      color: !isGrid ? "#00A94F" : "#3D4A52",
                    }}
                  >
                    List view
                  </Typography>
                </div>
                <div
                  className="d-flex cursor-pointer"
                  onClick={() => setIsGrid(true)}
                  id="dataset-grid-view-id"
                >
                  <img
                    className="mr-7"
                    src={require(`../../Assets/Img/${
                      isGrid ? "grid_view_green.svg" : "grid_view_gray.svg"
                    }`)}
                  />
                  <Typography
                    sx={{
                      color: isGrid ? "#00A94F" : "#3D4A52",
                    }}
                  >
                    Grid view
                  </Typography>
                </div>
                {!isLoggedInUserAdmin() && tabValue !== 1 ? (
                  <div className="d-flex">
                    <Button
                      onClick={() => history.push(handleAddTicketRoutes())}
                      sx={{
                        fontFamily: "Montserrat !important",
                        fontWeight: "700 !important",
                        fontSize: "15px !important",
                        width: "max-content !important",
                        height: "48px !important",
                        border: "1px solid rgba(0, 171, 85, 0.48) !important",
                        borderRadius: "8px !important",
                        background: "#FFFFFF !important",
                        color: "#00A94F !important",
                        textTransform: "none !important",
                        marginLeft: "52px !important",
                        padding: "10px !important",
                        "&:hover": {
                          background: "#00A94F !important",
                          color: "#FFFFFF !important",
                          padding: "10px !important",
                        },
                      }}
                      id="dataset-add-new-dataset"
                    >
                      + Raise new request
                    </Button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </div>
          <div>
            {" "}
            <Divider />
          </div>
          {tabValue == 0 ? (
            <>
              {isGrid ? (
                <>
                  {ticketList.length === 0 && !isLoading ? (
                    <Box p={3}>
                      {isLoggedInUserCoSteward() ? (
                        <NoData
                          title={"There are no tickets"}
                          subTitle={
                            "As of now there are no tickets from your end, so rise a ticket!"
                          }
                          primaryButton={"+ Raise new request "}
                          primaryButtonOnClick={() =>
                            history.push(handleAddTicketRoutes())
                          }
                        />
                      ) : (
                        <NoData
                          title={"There are no tickets"}
                          subTitle={
                            "As of now there are no tickets from co-stewards end"
                          }
                        />
                      )}
                    </Box>
                  ) : (
                    <div>
                      <Row>
                        {ticketList?.map((data, index) => (
                          <Col
                            xs={12}
                            sm={6}
                            md={4}
                            lg={4}
                            style={{ "margin-top": "15px" }}
                          >
                            <SupportCard
                              date={
                                data?.created_at
                                  ? dateTimeFormat(data?.created_at, false)
                                  : "NA"
                              }
                              ticketname={data?.ticket_title}
                              org={data?.user_map?.organization?.name}
                              category={data?.category}
                              ticketstatus={data?.status}
                              index={index}
                              user_name={data?.user_map?.user?.first_name}
                              handleSupportViewRoute={handleSupportViewRoute}
                              supportId={data?.id}
                            />
                          </Col>
                        ))}
                      </Row>
                      <Row style={{ "margin-top": "10px" }}>
                        <Col xs={12} sm={12} md={6} lg={3}></Col>
                        {loadMoreButton ? (
                          <Col xs={12} sm={12} md={6} lg={6}>
                            <Button
                              onClick={() => handleLoadMore()}
                              variant="outlied"
                              className={`${LocalStyle.pButtonStyle}`}
                              style={{ "text-transform": "none" }}
                              data-testid="loadmorebtn"
                            >
                              Load more
                            </Button>
                          </Col>
                        ) : (
                          <></>
                        )}
                      </Row>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <>
                    <div>
                      <SupportList
                        ticketList={ticketList}
                        handleSupportViewRoute={handleSupportViewRoute}
                      />
                    </div>
                    <div>
                      <Row style={{ "margin-top": "10px" }}>
                        <Col xs={12} sm={12} md={6} lg={3}></Col>
                        {loadMoreButton ? (
                          <Col xs={12} sm={12} md={6} lg={6}>
                            <Button
                              onClick={() => handleLoadMore()}
                              variant="outlied"
                              className={`${LocalStyle.pButtonStyle}`}
                              style={{ "text-transform": "none" }}
                              data-testid="loadmorebtn"
                            >
                              Load more
                            </Button>
                          </Col>
                        ) : (
                          <></>
                        )}
                      </Row>
                    </div>{" "}
                  </>
                </>
              )}{" "}
            </>
          ) : (
            ""
          )}
          {tabValue == 1 ? (
            <>
              {isGrid && tabValue === 1 ? (
                <>
                  {ticketList.length === 0 && !isLoading ? (
                    <Box p={3}>
                      <NoData
                        title={"There are no tickets"}
                        subTitle={"As of now there are no tickets from others"}
                      />
                    </Box>
                  ) : (
                    <div>
                      <Row>
                        {ticketList?.map((data, index) => (
                          <Col
                            xs={12}
                            sm={6}
                            md={4}
                            lg={4}
                            style={{ "margin-top": "15px" }}
                          >
                            <SupportCard
                              date={
                                data?.created_at
                                  ? dateTimeFormat(data?.created_at, false)
                                  : "NA"
                              }
                              ticketname={data?.ticket_title}
                              org={data?.user_map?.organization?.name}
                              category={data?.category}
                              ticketstatus={data?.status}
                              index={index}
                              user_name={data?.user_map?.user?.first_name}
                              handleSupportViewRoute={handleSupportViewRoute}
                              supportId={data?.id}
                            />
                          </Col>
                        ))}
                      </Row>
                      <Row style={{ "margin-top": "10px" }}>
                        <Col xs={12} sm={12} md={6} lg={3}></Col>
                        {loadMoreButton ? (
                          <Col xs={12} sm={12} md={6} lg={6}>
                            <Button
                              onClick={() => getTicketListOnLoadMore()}
                              variant="outlied"
                              className={`${LocalStyle.pButtonStyle}`}
                              style={{ "text-transform": "none" }}
                              data-testid="loadmorebtn"
                            >
                              Load more
                            </Button>
                          </Col>
                        ) : (
                          <></>
                        )}
                      </Row>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <SupportList
                      ticketList={ticketList}
                      handleSupportViewRoute={handleSupportViewRoute}
                    />
                  </div>
                  <div>
                    <Row style={{ "margin-top": "10px" }}>
                      <Col xs={12} sm={12} md={6} lg={3}></Col>
                      {loadMoreButton ? (
                        <Col xs={12} sm={12} md={6} lg={6}>
                          <Button
                            onClick={() => getTicketListOnLoadMore()}
                            variant="outlied"
                            className={`${LocalStyle.pButtonStyle}`}
                            style={{ "text-transform": "none" }}
                            data-testid="loadmorebtn"
                          >
                            Load more
                          </Button>
                        </Col>
                      ) : (
                        <></>
                      )}
                    </Row>
                  </div>{" "}
                </>
              )}{" "}
            </>
          ) : (
            ""
          )}
        </Container>
      ) : (
        <Container>
          <div className="d-flex justify-content-between">
            <div className="bold_title">{"List of my ticktes"}</div>
            {ticketList.length > 0 && !isLoading ? (
              <div className="d-flex align-items-center mt-50 mb-20">
                <div
                  className="d-flex mr-30 cursor-pointer"
                  onClick={() => setIsGrid(false)}
                  id="dataset-list-view-id"
                >
                  <img
                    className="mr-7"
                    src={require(`../../Assets/Img/${
                      isGrid ? "list_view_gray.svg" : "list_view_green.svg"
                    }`)}
                  />
                  <Typography
                    sx={{
                      color: !isGrid ? "#00A94F" : "#3D4A52",
                    }}
                  >
                    List view
                  </Typography>
                </div>
                <div
                  className="d-flex cursor-pointer"
                  onClick={() => setIsGrid(true)}
                  id="dataset-grid-view-id"
                >
                  <img
                    className="mr-7"
                    src={require(`../../Assets/Img/${
                      isGrid ? "grid_view_green.svg" : "grid_view_gray.svg"
                    }`)}
                  />
                  <Typography
                    sx={{
                      color: isGrid ? "#00A94F" : "#3D4A52",
                    }}
                  >
                    Grid view
                  </Typography>
                </div>
                <div className="d-flex">
                  <Button
                    onClick={() => history.push(handleAddTicketRoutes())}
                    sx={{
                      fontFamily: "Montserrat !important",
                      fontWeight: "700 !important",
                      fontSize: "15px !important",
                      width: "max-content !important",
                      height: "48px !important",
                      border: "1px solid rgba(0, 171, 85, 0.48) !important",
                      borderRadius: "8px !important",
                      background: "#FFFFFF !important",
                      color: "#00A94F !important",
                      textTransform: "none !important",
                      marginLeft: "52px !important",
                      padding: "10px !important",
                      "&:hover": {
                        background: "#00A94F !important",
                        color: "#FFFFFF !important",
                        padding: "10px !important",
                      },
                    }}
                    id="dataset-add-new-dataset"
                  >
                    + Raise new request
                  </Button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div>
            {" "}
            <Divider />
          </div>
          {isGrid ? (
            <>
              {ticketList.length === 0 && !isLoading ? (
                <Box p={3}>
                  <NoData
                    title={"There are no tickets"}
                    subTitle={
                      "As of now there are no tickets from your end, so rise a ticket!"
                    }
                    primaryButton={"+ Raise new request "}
                    primaryButtonOnClick={() =>
                      history.push(handleAddTicketRoutes())
                    }
                  />
                </Box>
              ) : (
                <div>
                  <Row>
                    {ticketList?.map((data, index) => (
                      <Col
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        style={{ "margin-top": "15px" }}
                      >
                        <SupportCard
                          date={
                            data?.created_at
                              ? dateTimeFormat(data?.created_at, false)
                              : "NA"
                          }
                          ticketname={data?.ticket_title}
                          org={data?.user_map?.organization?.name}
                          category={data?.category}
                          ticketstatus={data?.status}
                          index={index}
                          user_name={data?.user_map?.user?.first_name}
                          handleSupportViewRoute={handleSupportViewRoute}
                          supportId={data?.id}
                        />
                      </Col>
                    ))}
                  </Row>
                  <Row style={{ "margin-top": "10px" }}>
                    <Col xs={12} sm={12} md={6} lg={3}></Col>
                    {loadMoreButton ? (
                      <Col xs={12} sm={12} md={6} lg={6}>
                        <Button
                          onClick={() => handleLoadMore()}
                          variant="outlied"
                          className={`${LocalStyle.pButtonStyle}`}
                          style={{ "text-transform": "none" }}
                          data-testid="loadmorebtn"
                        >
                          Load more
                        </Button>
                      </Col>
                    ) : (
                      <></>
                    )}
                  </Row>
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <SupportList
                  ticketList={ticketList}
                  handleSupportViewRoute={handleSupportViewRoute}
                />
              </div>
              <div>
                <Row style={{ "margin-top": "10px" }}>
                  <Col xs={12} sm={12} md={6} lg={3}></Col>
                  {loadMoreButton ? (
                    <Col xs={12} sm={12} md={6} lg={6}>
                      <Button
                        onClick={() => handleLoadMore()}
                        variant="outlied"
                        className={`${LocalStyle.pButtonStyle}`}
                        style={{ "text-transform": "none" }}
                        data-testid="loadmorebtn"
                      >
                        Load more
                      </Button>
                    </Col>
                  ) : (
                    <></>
                  )}
                </Row>
              </div>{" "}
            </>
          )}
        </Container>
      )}
    </>
  );
}
