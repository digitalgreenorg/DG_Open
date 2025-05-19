import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import { useHistory } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  GetErrorHandlingRoute,
  getOrgLocal,
  getTokenLocal,
  getUserLocal,
  goToTop,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "../../Utils/Common";
import "./DataSets.css";
import FooterNew from "../Footer/Footer_New";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "../../Services/HTTPService";
import DataSetsTab from "./DataSetsTab/DataSetsTab";
import { FarmStackContext } from "../Contexts/FarmStackContext";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Filter from "../Filter/Filter";
import CheckBoxWithText from "./TabComponents/CheckBoxWithText";
import ShowFilterChips from "../Filter/ShowFilterChips";
import { City, Country, State } from "country-state-city";
import EmptyFile from "./TabComponents/EmptyFile";
import DatasetRequestTable from "./DatasetRequestTable/DatasetRequestTable";
import FilterDate from "../Filter/FilterDate";
import useDebounce from "../../hooks/useDebounce";
import moment from "moment";
import { Col, Row } from "react-bootstrap";
import CheckBoxWithTypo from "./TabComponents/CheckBoxWithTypo";

const cardSx = {
  maxWidth: 368,
  height: 190,
  border: "1px solid #C0C7D1",
  borderRadius: "10px",
  "&:hover": {
    boxShadow: "-40px 40px 80px rgba(145, 158, 171, 0.16)",
    cursor: "pointer",
  },
};
const DataSets = (props) => {
  const { user, breadcrumbFromRoute } = props;
  const { callLoader, callToast } = useContext(FarmStackContext);
  const history = useHistory();
  const theme = useTheme();
  const [isGrid, setIsGrid] = useState(true);
  const [showAllDataset, setShowAllDataset] = useState(true);

  const [isGridOther, setIsGridOther] = useState(true);
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const miniLaptop = useMediaQuery(theme.breakpoints.down("lg"));

  const [state, setState] = useState([0, 1, 2, 3, 4, 5]);
  const [searchDatasetsName, setSearchDatasetsName] = useState(null);
  const debouncedSearchValue = useDebounce(searchDatasetsName, 1000);
  const [filterState, setFilterState] = useState({});
  const [datasetList, setDatasetList] = useState([]);
  const [filteredDatasetList, setFilteredDatasetList] = useState([]);
  const [filteredMemberDatasetList, setFilteredMemberDatasetList] = useState(
    []
  );
  const [memberDatasetList, setMemberDatasetList] = useState([]);
  const [showLoadMoreAdmin, setShowLoadMoreAdmin] = useState(false);
  const [showLoadMoreMember, setShowLoadMoreMember] = useState(false);
  const [datasetUrl, setDatasetUrl] = useState(
    UrlConstant.base_url + UrlConstant.dataset_participant_list
  );
  const [memberDatasetUrl, setMemberDatasetUrl] = useState(
    UrlConstant.base_url + UrlConstant.dataset_participant_list
  );
  const [guestUserDatasetUrl, setGuestUserDatasetUrl] = useState("");

  const [updater, setUpdate] = useState(0);

  // TabIndex
  const [value, setValue] = useState(0);

  var payload = "";
  var adminUrl = UrlConstant.base_url + UrlConstant.dataset_participant_list;
  var memberUrl = UrlConstant.base_url + UrlConstant.dataset_participant_list;
  var searchUrl =
    UrlConstant.base_url + UrlConstant.search_dataset_end_point_participant;

  // filter-popovers
  const [geographies, setGeographies] = useState(["India", "", ""]);
  const [allGeographies, setAllGeographies] = useState([]);
  const [categorises, setCategorises] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [content, setContent] = useState([]);
  const [type, setType] = useState("");
  const [filterItems, setFilterItems] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [geography, setGeography] = useState({
    country: {
      name: "",
      isoCode: "",
      flag: "",
      phonecode: "",
      currency: "",
      latitude: "",
      longitude: "",
      timezones: [
        {
          zoneName: "",
          gmtOffset: null,
          gmtOffsetName: "",
          abbreviation: "",
          tzName: "",
        },
      ],
    },
    state: null,
    city: null,
  });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dates, setDates] = useState([{ fromDate: null, toDate: null }]);
  const resetUrls = () => {
    adminUrl = UrlConstant.base_url + UrlConstant.dataset_participant_list;
    memberUrl = UrlConstant.base_url + UrlConstant.dataset_participant_list;
    searchUrl =
      UrlConstant.base_url + UrlConstant.search_dataset_end_point_participant;
    setDatasetUrl("");
    setMemberDatasetUrl("");
  };

  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryIds, setSubCategoryIds] = useState([]);

  const addDataset = () => {
    if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
      return "/datahub/new_datasets/add";
    } else if (isLoggedInUserParticipant()) {
      return "/participant/new_datasets/add";
    }
  };

  const clearFilter = () => {
    if (value === 0) {
      setFilteredDatasetList([]);
      setFilterState({});
      getDataSets(false);
    }
    if (value === 1) {
      setFilteredMemberDatasetList();
      setFilterState({});
      getOtherDataSets(false);
    }
  };

  const getDataSets = (isLoadMore) => {
    console.log("🚀 ~ file: DataSets.js:167 ~ getDataSets ~ getDataSets:");
    console.log("filtestate", filterState, isLoadMore, "isLoadMore");
    let method = "POST";
    let payload = {};

    if (!isLoadMore) {
      resetUrls();
      if (!Object.keys(filterState).length) {
        payload = {};
        payload["user_id"] = getUserLocal();
        payload["org_id"] = getOrgLocal();
        payload["others"] = false;
        if (isLoggedInUserCoSteward()) {
          payload["on_boarded_by"] = getUserLocal();
        }
        if (
          geography?.country?.name ||
          geography?.state?.name ||
          geography?.city?.name
        ) {
          let geo = {};
          for (const [key, value] of Object.entries(geography)) {
            if (value?.name) {
              geo[key] = { name: value?.name };
            }
          }
          payload["geography__contains"] = geo;
        }
        setFilterState(payload);
      } else {
        payload = {};
        payload["user_id"] = getUserLocal();
        payload["org_id"] = getOrgLocal();
        payload["others"] = false;
        if (isLoggedInUserCoSteward()) {
          payload["on_boarded_by"] = getUserLocal();
        }
        if (
          geography?.country?.name ||
          geography?.state?.name ||
          geography?.city?.name
        ) {
          let geo = {};
          for (const [key, value] of Object.entries(geography)) {
            if (value?.name) {
              geo[key] = { name: value?.name };
            }
          }
          payload["geography__contains"] = geo;
        }
        setFilterState(payload);
      }
    } else {
      if (!Object.keys(filterState).length) {
        console.log("else condition when loade more and no filter state");

        payload = {};
        payload["user_id"] = getUserLocal();
        payload["org_id"] = getOrgLocal();
        payload["others"] = false;
        if (isLoggedInUserCoSteward()) {
          payload["on_boarded_by"] = getUserLocal();
        }
        if (
          geography?.country?.name ||
          geography?.state?.name ||
          geography?.city?.name
        ) {
          let geo = {};
          for (const [key, value] of Object.entries(geography)) {
            if (value?.name) {
              geo[key] = { name: value?.name };
            }
          }
          payload["geography__contains"] = geo;
        }
        setFilterState(payload);
      } else {
        payload = {};
        payload["user_id"] = getUserLocal();
        payload["org_id"] = getOrgLocal();
        payload["others"] = false;
        if (isLoggedInUserCoSteward()) {
          payload["on_boarded_by"] = getUserLocal();
        }
        if (
          geography?.country?.name ||
          geography?.state?.name ||
          geography?.city?.name
        ) {
          let geo = {};
          for (const [key, value] of Object.entries(geography)) {
            if (value?.name) {
              geo[key] = { name: value?.name };
            }
          }
          payload["geography__contains"] = geo;
        }
        console.log(
          "else condition when loade more and filter state",
          filterState
        );
        payload = { ...filterState };
        setFilterState(payload);
      }
    }
    console.log(payload, "payload before sending");
    let guestUrl = "";
    if (user == "guest") {
      if (!isLoadMore) {
        guestUrl = UrlConstant.base_url + UrlConstant.datasetview_guest;
      }

      if (payload["user_id"]) delete payload["user_id"];
      if (payload["org_id"]) delete payload["org_id"];
      if (payload["others"]) delete payload["others"];
      if (payload["on_boarded_by"]) delete payload["on_boarded_by"];
      // payload = {};
      // if (
      //   geography?.country?.name ||
      //   geography?.state?.name ||
      //   geography?.city?.name
      // ) {
      //   let geo = {};
      //   for (const [key, value] of Object.entries(geography)) {
      //     if (value?.name) {
      //       geo[key] = { name: value?.name };
      //     }
      //   }
      //   payload["geography__contains"] = geo;
      // }
      if (isLoadMore) {
        guestUrl = datasetUrl;
      }
      if (isLoadMore && !datasetUrl) {
        return;
      }
    }

    let accessToken = user != "guest" ? getTokenLocal() : false;

    callLoader(true);
    HTTPService(
      method,
      guestUrl ? guestUrl : !isLoadMore ? adminUrl : datasetUrl,
      payload,
      false,
      accessToken
    )
      .then((response) => {
        callLoader(false);
        if (response.data.next == null) {
          setShowLoadMoreAdmin(false);
          setFilterState({});
        } else {
          setDatasetUrl(response.data.next);
          setShowLoadMoreAdmin(true);
        }
        let finalDataList = [];
        if (isLoadMore) {
          finalDataList = [...datasetList, ...response.data.results];
        } else {
          finalDataList = [...response.data.results];
        }
        setDatasetList(finalDataList);
      })
      .catch(async (err) => {
        callLoader(false);
        let response = await GetErrorHandlingRoute(err);
        if (response?.toast) {
          //callToast(message, type, action)
          callToast(
            response?.message ?? "Error occurred while getting datasets",
            response.status == 200 ? "success" : "error",
            response.toast
          );
        } else {
          history.push(response?.path);
        }
      });
  };

  const getOtherDataSets = (isLoadMore) => {
    console.log("getOtherDataSets", "inside");
    if (!isLoadMore) {
      resetUrls();
      if (!Object.keys(filterState).length) {
        payload = {};
        payload["user_id"] = getUserLocal();
        payload["org_id"] = getOrgLocal();
        payload["others"] = true;
        if (isLoggedInUserCoSteward()) {
          payload["on_boarded_by"] = getUserLocal();
        }
        if (
          geography?.country?.name ||
          geography?.state?.name ||
          geography?.city?.name
        ) {
          let geo = {};
          for (const [key, value] of Object.entries(geography)) {
            if (value?.name) {
              geo[key] = { name: value?.name };
            }
          }
          payload["geography__contains"] = geo;
        }
        setFilterState(payload);
      } else {
        payload = {};
        payload["user_id"] = getUserLocal();
        payload["org_id"] = getOrgLocal();
        payload["others"] = false;
        if (isLoggedInUserCoSteward()) {
          payload["on_boarded_by"] = getUserLocal();
        }
        if (
          geography?.country?.name ||
          geography?.state?.name ||
          geography?.city?.name
        ) {
          let geo = {};
          for (const [key, value] of Object.entries(geography)) {
            if (value?.name) {
              geo[key] = { name: value?.name };
            }
          }
          payload["geography__contains"] = geo;
        }
        setFilterState(payload);
      }
    } else {
      if (!Object.keys(filterState).length) {
        payload = {};
        payload["user_id"] = getUserLocal();
        payload["org_id"] = getOrgLocal();
        payload["others"] = true;
        if (isLoggedInUserCoSteward()) {
          payload["on_boarded_by"] = getUserLocal();
        }
        if (
          geography?.country?.name ||
          geography?.state?.name ||
          geography?.city?.name
        ) {
          let geo = {};
          for (const [key, value] of Object.entries(geography)) {
            if (value?.name) {
              geo[key] = { name: value?.name };
            }
          }
          payload["geography__contains"] = geo;
        }
        setFilterState(payload);
      } else {
        payload = { ...filterState };
      }
    }
    let accessToken = user !== "guest" ? getTokenLocal() : false;
    callLoader(true);
    HTTPService(
      "POST",
      !isLoadMore ? memberUrl : memberDatasetUrl,
      payload,
      false,
      accessToken
    )
      .then((response) => {
        callLoader(false);
        if (response.data.next == null) {
          setShowLoadMoreMember(false);
          setFilterState({});
        } else {
          setMemberDatasetUrl(response.data.next);
          setShowLoadMoreMember(true);
        }
        let finalDataList = [];
        if (isLoadMore) {
          finalDataList = [...memberDatasetList, ...response.data.results];
        } else {
          finalDataList = [...response.data.results];
        }
        setMemberDatasetList(finalDataList);
      })
      .catch(async (err) => {
        callLoader(false);
        let response = await GetErrorHandlingRoute(err);
        if (response.toast) {
          //callToast(message, type, action)
          callToast(
            response?.message ?? "Authenticated",
            response.status == 200 ? "success" : "error",
            response.toast
          );
        } else {
          history.push(response?.path);
        }
      });
  };
  const getUrl = (isLoadMore) => {
    if (user === "guest") {
      let guestUsetFilterUrl =
        UrlConstant.base_url + UrlConstant.search_dataset_end_point_guest;
      return guestUsetFilterUrl;
    } else {
      if (!isLoadMore) {
        return searchUrl;
      } else {
        return value === 0 ? datasetUrl : memberDatasetUrl;
      }
    }
  };
  const handleSearch = async (isLoadMore) => {
    console.log("inside handler search");
    let searchText = searchDatasetsName;
    searchText ? callLoader(true) : callLoader(false);
    if (searchText?.length < 3 && searchText !== "") searchText = "";
    let data = { ...filterState };
    setFilterState({});
    data["user_id"] = getUserLocal();
    data["org_id"] = getOrgLocal();
    data["name__icontains"] = searchText;
    if (isLoggedInUserCoSteward()) {
      data["on_boarded_by"] = true;
    }
    if (value === 1) {
      data["others"] = true;
    } else {
      data["others"] = false;
    }

    let accessToken = user !== "guest" ? getTokenLocal() : false;
    if (user == "guest") {
      data = { ...filterState };
      data["name__icontains"] = searchText;
    }

    await HTTPService("POST", getUrl(isLoadMore), data, false, accessToken)
      .then((response) => {
        callLoader(false);
        if (response.data.next == null) {
          if (value === 0) {
            setShowLoadMoreAdmin(false);
          } else {
            setShowLoadMoreMember(false);
          }
          setFilterState({});
        } else {
          if (value === 0) {
            setDatasetUrl(response.data.next);
            if (searchText === "") setFilterState({});
            else setFilterState(data);
            setShowLoadMoreAdmin(true);
          } else {
            setMemberDatasetUrl(response.data.next);
            if (searchText === "") setFilterState({});
            else setFilterState(data);
            setShowLoadMoreMember(true);
          }
        }
        let finalDataList = [];
        if (isLoadMore) {
          if (value === 1) {
            finalDataList = [...memberDatasetList, ...response.data.results];
          } else {
            finalDataList = [...datasetList, ...response.data.results];
          }
        } else {
          finalDataList = [...response.data.results];
        }
        if (value === 1) {
          setMemberDatasetList(finalDataList);
        } else {
          setDatasetList(finalDataList);
        }
        return;
      })
      .catch(async (e) => {
        callLoader(false);
        let error = await GetErrorHandlingRoute(e);
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
  // filter-popovers handling
  const handleFilterClick = (type) => {
    if (type === "geography") {
      setContent(allGeographies);
      setType(type);
      setShowFilter(true);
    } else if (type === "categories") {
      setContent(allCategories);
      setType(type);
      setShowFilter(true);
    } else if (type === "date") {
      setType(type);
      setShowFilter(true);
    }
  };

  const handleCheckBox = (categoryId, subCategoryId) => {
    setUpdate((prev) => prev + 1);
    setSubCategoryIds((prevIds) => {
      // Check if the subCategoryId is already in the array
      if (prevIds.includes(subCategoryId)) {
        // Remove the subCategoryId
        return prevIds.filter((id) => id !== subCategoryId);
      } else {
        // Add the subCategoryId
        return [...prevIds, subCategoryId];
      }
    });
  };

  const getAllCategoryAndSubCategory = () => {
    let url =
      user == "guest"
        ? UrlConstant.base_url + UrlConstant.microsite_list_category
        : UrlConstant.base_url + UrlConstant.list_category;
    let isAuthorization = user == "guest" ? false : true;
    let checkforAccess = user !== "guest" ? getTokenLocal() : false;
    HTTPService("GET", url, "", true, isAuthorization, checkforAccess)
      .then((response) => {
        setCategoryList(response.data);
      })
      .catch(async (e) => {
        let error = await GetErrorHandlingRoute(e);
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

  const getAllGeoGraphies = () => {
    setStates([]);
    setCities([]);
    setCountries(Country.getAllCountries());
    if (geography?.country) {
      setStates(State?.getStatesOfCountry(geography?.country?.isoCode));
    }
    if (geography?.country && geography?.state?.name) {
      setCities(
        City.getCitiesOfState(
          geography?.state?.countryCode,
          geography?.state?.isoCode
        )
      );
    }
  };

  const callApply = (isLoadMore) => {
    console.log("calling callapply");
    if (
      !subCategoryIds.length &&
      !geographies[1] &&
      !geographies[2] &&
      !dates[0]?.fromDate &&
      !dates[0]?.toDate
    ) {
      setIsGrid(true);
      setIsGridOther(true);
    }
    let payload = {};
    payload["user_id"] = getUserLocal();
    payload["org_id"] = getOrgLocal();
    payload["others"] = value === 0 ? false : true;
    if (user == "guest") {
      payload = {};
    }
    if (
      geography?.country?.name ||
      geography?.state?.name ||
      geography?.city?.name
    ) {
      let geo = {};
      for (const [key, value] of Object.entries(geography)) {
        if (value?.name) {
          geo[key] = { name: value?.name };
        }
      }
      payload["geography__contains"] = geo;
    }
    console.log(categorises, "categorises");
    if (subCategoryIds && subCategoryIds?.length) {
      payload["dataset_cat_map__sub_category_id__in"] = subCategoryIds;
    }
    if (fromDate && toDate) {
      let tempDateRange = [];
      tempDateRange.push(
        new Date(
          fromDate.getTime() - fromDate.getTimezoneOffset() * 60000
        ).toJSON()
      );
      tempDateRange.push(
        new Date(toDate.getTime() - toDate.getTimezoneOffset() * 60000).toJSON()
      );
      payload["updated_at__range"] = tempDateRange;
    }
    console.log(payload, "payload1");
    setFilterState(payload);
    let guestUsetFilterUrl =
      UrlConstant.base_url + UrlConstant.search_dataset_end_point_guest;
    let isAuthorization = user == "guest" ? false : true;

    callLoader(true);
    HTTPService(
      "POST",
      user == "guest"
        ? guestUsetFilterUrl
        : !isLoadMore
        ? adminUrl
        : datasetUrl,
      payload,
      false,
      isAuthorization
    )
      .then((response) => {
        callLoader(false);
        if (value === 0) {
          if (response.data.next == null) {
            setShowLoadMoreAdmin(false);
            setFilterState({});
          } else {
            setDatasetUrl(response.data.next);
            setShowLoadMoreAdmin(true);
          }
          let finalDataList = [];
          if (isLoadMore) {
            finalDataList = [...datasetList, ...response.data.results];
          } else {
            finalDataList = [...response.data.results];
          }
          setDatasetList(finalDataList);
        }
        if (value === 1) {
          if (response.data.next == null) {
            setShowLoadMoreMember(false);
            setFilterState({});
          } else {
            setMemberDatasetUrl(response.data.next);
            setShowLoadMoreMember(true);
          }
          let finalDataList = [];
          if (isLoadMore) {
            finalDataList = [...memberDatasetList, ...response.data.results];
          } else {
            finalDataList = [...response.data.results];
          }
          setMemberDatasetList(finalDataList);
        }
      })
      .catch(async (e) => {
        callLoader(false);
        let error = await GetErrorHandlingRoute(e);
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

  const handleFromDate = (value) => {
    let currentDate = new Date();
    let formattedDate = moment(value).format("DD/MM/YYYY");
    if (
      moment(formattedDate, "DD/MM/YYYY", true).isValid() &&
      moment(value).isSameOrBefore(currentDate)
    ) {
      let tempDates = [...dates];
      tempDates[0].fromDate = value;
      setDates(tempDates);
      setFromDate(value);
    } else {
      let tempDates = [...dates];
      tempDates[0].fromDate = null;
      setDates(tempDates);
      handleToDate("");
      setFromDate("");
    }
  };

  const clearAllFilterBackToListingOfCategory = () => {
    setIsGrid(true);
    setIsGridOther(true);
    setType("");
    setCategorises([]);
    setGeographies(["India", "", ""]);
    setDates([{ fromDate: null, toDate: null }]);
    setFromDate("");
    setToDate("");
    setSearchDatasetsName("");
    clearFilter();
    // setShowAllDataset(false); // to again get the catgeory in list
    setFilterState({
      geography__contains: { country: { name: "India" } },
    });
  };

  const handleToDate = (value) => {
    let formattedDate = moment(value).format("DD/MM/YYYY");
    if (
      moment(formattedDate, "DD/MM/YYYY", true).isValid() &&
      moment(value).isSameOrAfter(fromDate) &&
      moment(value).isSameOrBefore(new Date())
    ) {
      let tempDates = [...dates];
      tempDates[0].toDate = value;
      setDates(tempDates);
      setToDate(value);
    } else {
      let tempDates = [...dates];
      tempDates[0].toDate = null;
      setDates(tempDates);
      setToDate("");
    }
  };

  useEffect(() => {
    if (user === "guest") {
      getDataSets(false);
    }
    goToTop(0);
  }, []);

  useEffect(() => {
    setSearchDatasetsName("");
  }, [value]);

  useEffect(() => {
    if (debouncedSearchValue !== null) {
      handleSearch();
    }
  }, [debouncedSearchValue]);
  useEffect(() => {
    getAllGeoGraphies();
  }, [geography, type]);

  useEffect(() => {
    getAllCategoryAndSubCategory();
  }, [type]);

  useEffect(() => {
    const updateCheckBox = () => {
      let tempCategories = [];
      let temp = categoryList?.forEach((data, index) => {
        let prepareCheckbox = [];
        prepareCheckbox = data?.subcategories?.map((subCategory, ind) => {
          // Find if the subcategory exists in the categories array and its subcategories
          const isPresent = subCategoryIds.includes(subCategory.id);
          return (
            <CheckBoxWithTypo
              key={ind}
              text={subCategory?.name}
              keyIndex={ind}
              categoryId={data?.id}
              subCategoryId={subCategory?.id}
              checked={isPresent}
              categoryKeyName={data?.name}
              keyName={subCategory?.name}
              handleCheckBox={handleCheckBox}
              fontSize={"12px"}
            />
          );
        });
        let obj = {
          panel: index + 1,
          title: data.name,
          details: prepareCheckbox ? prepareCheckbox : [],
        };
        tempCategories = tempCategories.concat(obj);
      });
      setAllCategories(tempCategories);
    };
    updateCheckBox();
  }, [categoryList, subCategoryIds]);

  useEffect(() => {
    callApply();
    // window.scrollTo(0, 550);
  }, [updater]);

  return (
    <>
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
                    ? history.push("/datahub/new_datasets")
                    : history.push("/participant/new_datasets");
                }}
              >
                {breadcrumbFromRoute ? breadcrumbFromRoute : "Datasets"}
              </span>
              <span className="add_light_text ml-16">
                <ArrowForwardIosIcon
                  sx={{ fontSize: "14px", fill: "#00A94F" }}
                />
              </span>
              <span className="add_light_text ml-16 fw600">
                {user
                  ? "Datasets"
                  : value == 0
                  ? "My Organisation Datasets"
                  : value == 1
                  ? "Other Organisation Datasets"
                  : value == 2
                  ? "Request received"
                  : ""}

                {/* {isParticipantRequest ? "" : ""} */}
              </span>
            </div>
          </Col>
        </Row>
        {/* section-1 */}
        <div className={mobile ? "title_sm" : tablet ? "title_md" : "title"}>
          Datasets Explorer
        </div>
        <div className="d-flex justify-content-center">
          <div className={mobile ? "description_sm" : "description"}>
            <b style={{ fontWeight: "bold" }}></b>
            Unleash the power of data-driven agriculture - Your ultimate FLEW
            Registries explorer for smarter decisions.
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
          placeholder="Search dataset.."
          value={searchDatasetsName}
          onChange={(e) => setSearchDatasetsName(e.target.value.trimStart())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton>
                  <img
                    src={require("../../Assets/Img/input_search.svg")}
                    alt="search"
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <div>
          <div
            className={
              mobile
                ? "filter_sm"
                : tablet
                ? "filter_md"
                : miniLaptop
                ? "filter_slg"
                : "filter"
            }
          >
            <Box className="text-right">
              {mobile ? (
                <Box
                  sx={{
                    fontFamily: "Montserrat",
                    fontWeight: 700,
                    fontSize: "12px",
                    height: "48px",
                    border: "none",
                    color: "#00A94F",
                    textTransform: "none",
                    "&:hover": {
                      background: "none",
                      border: "none",
                    },
                  }}
                  onClick={() => {
                    setType("");
                    setCategorises([]);
                    setGeographies(["Kenya", "", ""]);
                    setDates([{ fromDate: null, toDate: null }]);
                    setFromDate("");
                    setToDate("");
                    setSearchDatasetsName("");
                    clearFilter();
                    // setShowAllDataset(false); // to again get the catgeory in list
                    setFilterState({
                      geography__contains: { country: { name: "India" } },
                    });
                  }}
                  id="clear-all-in-dataset-filter-id"
                >
                  Clear all
                </Box>
              ) : (
                <></>
              )}
            </Box>
            <Box
              className={`d-flex ${
                mobile || tablet ? "justify-content-center" : ""
              }`}
            >
              <div
                className={
                  showFilter && type === "geography"
                    ? "d-flex align-items-center filter_text_container_active"
                    : "d-flex align-items-center filter_text_container"
                }
                onClick={() => handleFilterClick("geography")}
                id="dataset-filter-by-geography-id"
                data-testid="dataset-filter-by-geography-id"
              >
                <img
                  src={require("../../Assets/Img/geography_new.svg")}
                  alt="geography"
                  style={mobile ? { height: "12px" } : {}}
                />
                <span
                  className={`${
                    mobile || tablet ? "filter_text_md" : "filter_text"
                  } 
                ${mobile ? "ft-12" : ""}
                `}
                >
                  Geography{" "}
                  {mobile ? (
                    <></>
                  ) : (
                    <KeyboardArrowDownIcon sx={{ fill: "#212529" }} />
                  )}
                </span>
              </div>
              <div
                className={
                  showFilter && type === "categories"
                    ? "d-flex align-items-center filter_text_container_active"
                    : "d-flex align-items-center filter_text_container"
                }
                onClick={() => handleFilterClick("categories")}
                id="dataset-filter-by-categories-id"
                data-testid="dataset-filter-by-categories-id"
              >
                <img
                  src={require("../../Assets/Img/crop_new.svg")}
                  alt="crop"
                  style={mobile ? { height: "12px" } : {}}
                />
                <span
                  className={`${
                    mobile || tablet ? "filter_text_md" : "filter_text"
                  } 
                ${mobile ? "ft-12" : ""}
                `}
                >
                  Categories{" "}
                  {mobile ? (
                    <></>
                  ) : (
                    <KeyboardArrowDownIcon sx={{ fill: "#212529" }} />
                  )}
                </span>
              </div>
              <div
                className={
                  showFilter && type === "date"
                    ? "d-flex align-items-center filter_text_container_active"
                    : "d-flex align-items-center filter_text_container"
                }
                onClick={() => handleFilterClick("date")}
                id="dataset-filter-by-date-id"
                data-testid="dataset-filter-by-date-id"
              >
                <img
                  src={require("../../Assets/Img/by_date.svg")}
                  alt="by date"
                  style={mobile ? { height: "12px" } : {}}
                />
                <span
                  className={`${
                    mobile || tablet ? "filter_text_md" : "filter_text"
                  } 
                ${mobile ? "ft-12" : ""}
                `}
                >
                  By Date{" "}
                  {mobile ? (
                    <></>
                  ) : (
                    <KeyboardArrowDownIcon sx={{ fill: "#212529" }} />
                  )}
                </span>
              </div>
              {mobile ? (
                <></>
              ) : (
                <div
                  className="d-flex align-items-center filter_text_container"
                  onClick={() => {
                    setType("");
                    setCategorises([]);
                    setGeographies(["India", "", ""]);
                    setDates([{ fromDate: null, toDate: null }]);
                    setFromDate("");
                    setToDate("");
                    setSearchDatasetsName("");
                    clearFilter();
                    // setShowAllDataset(false); // to again get the catgeory in list
                    setFilterState({
                      geography__contains: { country: { name: "India" } },
                    });
                  }}
                  id="dataset-filter-clear-all-id"
                  data-testid="dataset-filter-clear-all-id"
                >
                  <img
                    src={require("../../Assets/Img/clear_all.svg")}
                    alt="clear all"
                  />
                  <span
                    className={
                      mobile || tablet ? "filter_text_md" : "filter_text"
                    }
                  >
                    Clear all
                  </span>
                </div>
              )}
            </Box>
          </div>
          {/* <div style={{ border: "1px solid" }}> */}
          {showFilter ? (
            type === "geography" ? (
              <Filter
                setUpdate={setUpdate}
                type={type}
                dataType={"component"}
                geography={geography}
                setGeography={setGeography}
                geographies={geographies}
                setGeographies={setGeographies}
                countries={countries}
                states={states}
                cities={cities}
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                callApply={callApply}
              />
            ) : type === "categories" ? (
              <Filter
                setUpdate={setUpdate}
                categorises={categorises}
                type={type}
                dataType={"list"}
                content={allCategories}
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                callApply={callApply}
              />
            ) : type === "date" ? (
              <FilterDate
                setUpdate={setUpdate}
                type={type}
                dataType={"date"}
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                dates={dates}
                setDates={setDates}
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                callApply={callApply}
              />
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </div>

        {/* </div> */}
        {/* </ClickAwayListener> */}

        {geographies?.length ||
        subCategoryIds.length ||
        dates[0]?.fromDate ||
        dates[0]?.toDate ? (
          <ShowFilterChips
            getAllCategoryAndSubCategory={getAllCategoryAndSubCategory}
            geographies={geographies}
            categorises={categorises}
            subCategoryIds={subCategoryIds}
            dates={dates}
            // date setters

            handleFromDate={handleFromDate}
            handleToDate={handleToDate}
            setFromDate={setFromDate}
            setToDate={setToDate}
            setDates={setDates}
            //geography setters
            geography={geography}
            setGeography={setGeography}
            setGeographies={setGeographies}
            //category setters
            setAllCategories={setAllCategories}
            categoryList={categoryList}
            setCategorises={setCategorises}
            handleCheckBox={handleCheckBox}
            callApply={callApply}
            setUpdate={setUpdate}
          />
        ) : (
          <></>
        )}
      </Box>
      <Divider />
      {/* section-2 */}
      {user === "guest" && datasetList?.length ? (
        <DataSetsTab
          user={user}
          history={history}
          addDataset={addDataset}
          state={state}
          value={value}
          setValue={setValue}
          datasetList={datasetList}
          memberDatasetList={memberDatasetList}
          filteredDatasetList={filteredDatasetList}
          filteredMemberDatasetList={filteredMemberDatasetList}
          getDataSets={getDataSets}
          getOtherDataSets={getOtherDataSets}
          showLoadMoreAdmin={showLoadMoreAdmin}
          showLoadMoreMember={showLoadMoreMember}
          setType={setType}
          setCategorises={setCategorises}
          setGeographies={setGeographies}
          setDates={setDates}
          setFromDate={setFromDate}
          setToDate={setToDate}
          setSearchDatasetsName={setSearchDatasetsName}
          clearFilter={clearFilter}
          setFilterState={setFilterState}
          categoryList={categoryList}
          setUpdate={setUpdate}
          categorises={categorises}
          filterState={filterState}
          handleCheckBox={handleCheckBox}
          geographies={geographies}
          dates={dates}
          setIsGrid={setIsGrid}
          isGrid={isGrid}
          setIsGridOther={setIsGridOther}
          isGridOther={isGridOther}
          searchDatasetsName={searchDatasetsName}
          callApply={callApply}
          showAllDataset={showAllDataset}
          setShowAllDataset={setShowAllDataset}
          clearAllFilterBackToListingOfCategory={
            clearAllFilterBackToListingOfCategory
          }
        />
      ) : (
        <>
          {user === "guest" ? (
            <EmptyFile text={"As of now there are no datasets."} />
          ) : (
            <></>
          )}
        </>
      )}
      {user !== "guest" ? (
        <DataSetsTab
          user={user}
          history={history}
          addDataset={addDataset}
          state={state}
          value={value}
          setValue={setValue}
          datasetList={datasetList}
          memberDatasetList={memberDatasetList}
          filteredDatasetList={filteredDatasetList}
          filteredMemberDatasetList={filteredMemberDatasetList}
          getDataSets={getDataSets}
          getOtherDataSets={getOtherDataSets}
          showLoadMoreAdmin={showLoadMoreAdmin}
          showLoadMoreMember={showLoadMoreMember}
          setType={setType}
          setCategorises={setCategorises}
          setGeographies={setGeographies}
          setDates={setDates}
          setFromDate={setFromDate}
          setToDate={setToDate}
          setSearchDatasetsName={setSearchDatasetsName}
          clearFilter={clearFilter}
          setFilterState={setFilterState}
          categoryList={categoryList}
          setUpdate={setUpdate}
          categorises={categorises}
          filterState={filterState}
          handleCheckBox={handleCheckBox}
          geographies={geographies}
          dates={dates}
          setIsGrid={setIsGrid}
          isGrid={isGrid}
          setIsGridOther={setIsGridOther}
          isGridOther={isGridOther}
          searchDatasetsName={searchDatasetsName}
          callApply={callApply}
          showAllDataset={showAllDataset}
          setShowAllDataset={setShowAllDataset}
          clearAllFilterBackToListingOfCategory={
            clearAllFilterBackToListingOfCategory
          }
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default DataSets;
