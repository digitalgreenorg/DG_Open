import input_search from '../../Assets/Img/input_search.svg';
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import {
  getTokenLocal,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "common/utils/utils";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "common/services/HTTPService";
import { FarmStackContext } from "common/components/context/EadpContext/FarmStackProvider";
import { Col, Row } from "react-bootstrap";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ResourcesTab from "./ResourcesTab";
import useDebounce from "common/hooks/useDebounce";

const Resources = (props) => {
  const { user, breadcrumbFromRoute } = props;
  const { callLoader } = useContext(FarmStackContext);
  const history = useHistory();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const [isGrid, setIsGrid] = useState(true);
  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);
  const [resources, setResources] = useState([]);

  //my org resource link
  const [resourceUrl, setResourceUrl] = useState(
    UrlConstant.base_url + UrlConstant.resource_endpoint
  );

  //search resource link
  const [resourceUrlFilter, setResourceUrlFilter] = useState(
    UrlConstant.base_url + UrlConstant.resource_endpoint_filter
  );

  //other orgs link
  const [otherResourceUrl, setOtherResourceUrl] = useState(
    UrlConstant.base_url + UrlConstant.resource_endpoint
  );

  //microsite resource link
  const [guestResourceUrl, setGuestResourceUrl] = useState(
    UrlConstant.base_url + UrlConstant.microsite_resource_endpoint
  );

  // microsite filter link
  const [guestFilterUrl, setGuestFilterUrl] = useState(
    UrlConstant.base_url + "microsite/resources/resources_filter/'"
  );

  const [value, setValue] = useState(0);
  const [searchResourceName, setSearchResourcename] = useState("");
  const debouncedSearchValue = useDebounce(searchResourceName, 1000);

  const addResource = () => {
    if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
      return `/datahub/resources/add`;
    } else if (isLoggedInUserParticipant()) {
      return `/participant/resources/add`;
    }
  };

  const resetUrls = (type) => {
    setResourceUrl(UrlConstant.base_url + UrlConstant.resource_endpoint);
    setResourceUrlFilter(
      UrlConstant.base_url + UrlConstant.resource_endpoint_filter
    );
    setOtherResourceUrl(UrlConstant.base_url + UrlConstant.resource_endpoint);
    setGuestResourceUrl(
      UrlConstant.base_url + UrlConstant.microsite_resource_endpoint
    );

    if (type == "my_org")
      return UrlConstant.base_url + UrlConstant.resource_endpoint;
    else if (type == "other_org")
      return UrlConstant.base_url + UrlConstant.resource_endpoint;
    else return UrlConstant.base_url + UrlConstant.microsite_resource_endpoint;
  };
  const getResources = (isLoadMore) => {
    let accessToken = user !== "guest" ? getTokenLocal() : false;
    let url;
    let payload = {};

    if (searchResourceName?.length >= 3 && !isLoadMore) {
      console.log("inside 1");
      // searched and first time ie no loader
      url = user == "guest" ? guestFilterUrl : resourceUrlFilter;
      console.log(
        "🚀 ~ file: Resources.js:98 ~ getResources ~ url:",
        url,
        guestFilterUrl,
        resourceUrlFilter
      );

      //RESETTING THE MAIN URL
      setResourceUrl(UrlConstant.base_url + UrlConstant.resource_endpoint);
      setOtherResourceUrl(UrlConstant.base_url + UrlConstant.resource_endpoint);
      setGuestResourceUrl(
        UrlConstant.base_url + UrlConstant.microsite_resource_endpoint
      );

      payload["title__icontains"] = searchResourceName?.trim();
    } else if (searchResourceName?.length >= 3 && isLoadMore) {
      console.log("inside 2");
      // searched with loader
      url = user == "guest" ? guestFilterUrl : resourceUrlFilter;
      //RESETTING THE MAIN URL
      setResourceUrl(UrlConstant.base_url + UrlConstant.resource_endpoint);
      setOtherResourceUrl(UrlConstant.base_url + UrlConstant.resource_endpoint);
      setGuestResourceUrl(
        UrlConstant.base_url + UrlConstant.microsite_resource_endpoint
      );

      payload["title__icontains"] = searchResourceName?.trim();
    } else {
      console.log("inside 3");

      // without search with or without loader
      url = user == "guest" ? guestResourceUrl : resourceUrl;
      setResourceUrlFilter(
        UrlConstant.base_url + UrlConstant.resource_endpoint_filter
      );
      setOtherResourceUrl(UrlConstant.base_url + UrlConstant.resource_endpoint);
      setGuestResourceUrl(
        UrlConstant.base_url + UrlConstant.microsite_resource_endpoint
      );
      setGuestFilterUrl(
        UrlConstant.base_url + UrlConstant.microsite_resource_endpoint_filter
      );
    }
    callLoader(true);
    // if (searchResourceName && searchResourceName.length < 3) {
    //   url = UrlConstant.base_url + UrlConstant.resource_endpoint;
    //   setResourceUrl(UrlConstant.base_url + UrlConstant.resource_endpoint);
    // }
    HTTPService(
      searchResourceName?.length >= 3 ? "POST" : "GET",
      url,
      payload,
      false,
      accessToken
    )
      .then((response) => {
        callLoader(false);
        if (response.data.next == null) {
          setShowLoadMoreBtn(false);
        } else {
          if (user !== "guest") {
            if (searchResourceName?.length >= 3) {
              setResourceUrlFilter(response.data.next);
            } else {
              setResourceUrl(response.data.next);
              if (searchResourceName && searchResourceName.length < 3) {
                setResourceUrl(
                  UrlConstant.base_url + UrlConstant.resource_endpoint
                );
              }
            }
          } else {
            if (searchResourceName?.length >= 3) {
              setGuestFilterUrl(response.data.next);
            } else {
              setGuestResourceUrl(response.data.next);
              if (searchResourceName && searchResourceName.length < 3) {
                setGuestResourceUrl(
                  UrlConstant.base_url + UrlConstant.microsite_resource_endpoint
                );
              }
            }
          }
          setShowLoadMoreBtn(true);
        }
        let tempResources = [];
        if (isLoadMore) {
          tempResources = [...resources, ...response.data.results];
        } else {
          tempResources = [...response.data.results];
        }
        setResources(tempResources);
      })
      .catch((err) => {
        callLoader(false);
        console.log("error", err);
      });
  };
  const getOtherResources = (isLoadMore) => {
    callLoader(true);
    let accessToken = user !== "guest" ? getTokenLocal() : false;
    // let url = user !== "guest" ? resourceUrl : guestResourceUrl;
    let url;
    let payload = {};

    if (searchResourceName?.length >= 3 && !isLoadMore) {
      payload["others"] = true;
      // searched and first time ie no loader
      url = resourceUrlFilter;
      //RESETTING THE MAIN URL
      setResourceUrl(UrlConstant.base_url + UrlConstant.resource_endpoint);
      setOtherResourceUrl(UrlConstant.base_url + UrlConstant.resource_endpoint);
      setGuestResourceUrl(
        UrlConstant.base_url + UrlConstant.microsite_resource_endpoint
      );

      payload["title__icontains"] = searchResourceName?.trim();
    } else if (searchResourceName?.length >= 3 && isLoadMore) {
      // searched and first time ie with loader
      url = resourceUrlFilter;
      //RESETTING THE MAIN URL
      setResourceUrl(UrlConstant.base_url + UrlConstant.resource_endpoint);
      setOtherResourceUrl(UrlConstant.base_url + UrlConstant.resource_endpoint);
      setGuestResourceUrl(
        UrlConstant.base_url + UrlConstant.microsite_resource_endpoint
      );

      payload["title__icontains"] = searchResourceName?.trim();
    } else if (!isLoadMore) {
      // without search with or without loader
      payload["others"] = true;

      url = otherResourceUrl;
      setResourceUrlFilter(
        UrlConstant.base_url + UrlConstant.resource_endpoint_filter
      );
      setResourceUrl(UrlConstant.base_url + UrlConstant.resource_endpoint);
      setGuestResourceUrl(
        UrlConstant.base_url + UrlConstant.microsite_resource_endpoint
      );
    } else {
      url = otherResourceUrl;
      setResourceUrlFilter(
        UrlConstant.base_url + UrlConstant.resource_endpoint_filter
      );
      setResourceUrl(UrlConstant.base_url + UrlConstant.resource_endpoint);
      setGuestResourceUrl(
        UrlConstant.base_url + UrlConstant.microsite_resource_endpoint
      );
    }
    // if (searchResourceName?.length < 3) delete payload["title__icontains"];

    HTTPService(
      searchResourceName?.length >= 3 ? "POST" : "GET",
      url,
      payload,
      false,
      accessToken
    )
      .then((response) => {
        callLoader(false);
        if (response.data.next == null) {
          setShowLoadMoreBtn(false);
        } else {
          if (searchResourceName?.length >= 3) {
            setResourceUrlFilter(response.data.next);
          } else {
            setOtherResourceUrl(response.data.next);
            if (searchResourceName && searchResourceName.length < 3) {
              setOtherResourceUrl(
                UrlConstant.base_url + UrlConstant.resource_endpoint
              );
            }
          }
          setShowLoadMoreBtn(true);
        }
        let tempResources = [];
        if (isLoadMore) {
          tempResources = [...resources, ...response.data.results];
        } else {
          tempResources = [...response.data.results];
        }
        setResources(tempResources);
      })
      .catch((err) => {
        callLoader(false);
        console.log("error", err);
      });
  };

  // useEffect(() => {
  //   setSearchResourcename("");
  // }, [value]);

  useEffect(() => {
    if (debouncedSearchValue) {
      value == 0 && getResources(false);
      value == 1 && getOtherResources(false);
    }
  }, [debouncedSearchValue]);
  return (
    <Box
      sx={{
        maxWidth: "100%",
        marginLeft: mobile || tablet ? "30px" : "144px",
        marginRight: mobile || tablet ? "30px" : "144px",
      }}
    >
      <Row>
        <Col>
          <div className="text-left mt-50">
            <span
              className="add_light_text cursor-pointer breadcrumbItem"
              data-testid="go_home"
              onClick={() => {
                breadcrumbFromRoute === "Home"
                  ? history.push("/home")
                  : isLoggedInUserAdmin() || isLoggedInUserCoSteward()
                  ? history.push("/datahub/resources")
                  : history.push("/participant/resources");
              }}
            >
              {breadcrumbFromRoute ? breadcrumbFromRoute : "Resources"}
            </span>
            <span className="add_light_text ml-16">
              <ArrowForwardIosIcon sx={{ fontSize: "14px", fill: "#00A94F" }} />
            </span>
            <span className="add_light_text ml-16 fw600">
              {user
                ? "Resources"
                : value == 0
                ? "My organisation resources"
                : value == 1
                ? "Other organisation resources"
                : ""}
            </span>
          </div>
        </Col>
      </Row>
      <Row>
        <Col style={{ textAlign: "center" }}>
          <div className={mobile ? "title_sm" : tablet ? "title_md" : "title"}>
            Resources Explorer
          </div>
          <div className="d-flex justify-content-center">
            <div className={mobile ? "description_sm" : "description"}>
              <b style={{ fontWeight: "bold" }}></b>
              Unleash the power of data-driven agriculture - Your ultimate
              resource explorer for smarter decisions.
              <b style={{ fontWeight: "bold" }}></b>
            </div>
          </div>
          <TextField
            id="dataset-search-input-id"
            data-testid="dataset-search-input-id"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#919EAB",
                  borderRadius: "30px",
                },
                "&:hover fieldset": {
                  borderColor: "#919EAB",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#919EAB",
                },
              },
            }}
            className={
              mobile
                ? "input_field_sm"
                : tablet
                ? "input_field_md"
                : "input_field"
            }
            placeholder="Search resource.."
            value={searchResourceName}
            onChange={(e) => setSearchResourcename(e.target.value.trim())}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <img  src={input_search} 
                      alt="search"
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Col>
      </Row>

      <ResourcesTab
        user={user}
        value={value}
        setValue={setValue}
        history={history}
        isGrid={isGrid}
        setIsGrid={setIsGrid}
        resources={resources}
        setResources={setResources}
        addResource={addResource}
        getResources={getResources}
        getOtherResources={getOtherResources}
        showLoadMoreBtn={showLoadMoreBtn}
        setResourceUrl={setResourceUrl}
        setOtherResourceUrl={setOtherResourceUrl}
        setSearchResourcename={setSearchResourcename}
        searchResourceName={searchResourceName}
        debouncedSearchValue={debouncedSearchValue}
      />
    </Box>
  );
};

export default Resources;
