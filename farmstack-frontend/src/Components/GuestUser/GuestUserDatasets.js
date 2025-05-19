import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import labels from "../../Constants/labels";
import Loader from "../Loader/Loader";
//import DataSetListing from '../DataSetListing'
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext } from "@mui/lab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "../../Services/HTTPService";
import {
  debounce,
  GetErrorHandlingRoute,
  getOrgLocal,
} from "../../Utils/Common";
import { useHistory } from "react-router-dom";
import { getUserLocal, getUserMapId } from "../../Utils/Common";
import FileSaver from "file-saver";
import Button from "@mui/material/Button";
import "./GuestUserDatasets.css";
import GuestUserDatasetFilter from "./GuestUserDatasetFilter";
import GuestUserDatasetListing from "./GuestUserDatasetListing";
import ViewDataSet from "../Datasets/viewDataSet";
import Axios from "axios";
import RegexConstants from "../../Constants/RegexConstants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./guestUserLegal.module.css";

export default function GuestUserDatasets(props) {
  const { setIsExploreDatasetViewOn } = props
  const [isLoader, setIsLoader] = useState(false);
  const [isShowLoadMoreButton, setisShowLoadMoreButton] = useState(false);
  const [showLoadMoreAdmin, setShowLoadMoreAdmin] = useState(false);
  const [showLoadMoreMember, setShowLoadMoreMember] = useState(false);
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  const [value, setValue] = useState("1");
  const [secondrow, setsecondrow] = useState(false);
  const [fromdate, setfromdate] = useState(null);
  const [todate, settodate] = useState(null);
  const history = useHistory();
  const [isMemberTab, setIsMemberTab] = useState(false);
  const [datasetUrl, setDatasetUrl] = useState(
    UrlConstant.base_url + UrlConstant.guest_dataset_filtered_data
  );
  const debounceOnChange = React.useCallback(
    debounce(getSearchedData, 1000),
    []
  );
  const [searchDatasetVar, setSearchDatasetVar] = useState({ val: "" });
  const [searchValMyOrg, setSearchValMyOrg] = useState({ val: "" });
  const [searchValOtherOrg, setSearchValOtherOrg] = useState({ val: "" });
  const [isShowAll, setIsShowAll] = useState(true);
  // const [isEnabledFilter, setIsEnabledFilter] = useState(false)
  // const [isDisabledFilter, setIsDisabledFilter] = useState(false)
  // const [forReviewFilter, setForReviewFilter] = useState(false)
  // const [rejectedFilter, setRejectedFilter] = useState(false)
  // const [approvedFilter, setApprovedFilter] = useState(false)
  const [geoSearchState, setGeoSearchState] = useState("");
  const [cropSearchState, setCropSearchState] = useState("");

  const [datasetList, setDatasetList] = useState([]);
  const [memberDatasetList, setMemberDatasetList] = useState([]);

  const [dataAccessFilterDisplay, setDataAccessDisplay] = useState([
    { index: 0, name: "Public", payloadName: true, isChecked: false },
    { index: 1, name: "Private", payloadName: false, isChecked: false },
  ]);

  const [categoryFilterOptions, setCategoryFilterOptions] = useState([]);
  const [masterSubcategoryFilterOptions, setMasterSubcategoryFilterOptions] =
    useState([]);
  const [subcategoryFilterOptions, setSubcategoryFilterOptions] = useState([]);
  const [categoryFilterValue, setCategoryFilterValue] = useState([]);
  const [subcategoryFilterValue, setSubcategoryFilterValue] = useState([]);

  // const [geoFilterMaster,setGeoFilterMaster] = useState([])
  const [geoFilterDisplay, setGeoFilterDisplay] = useState([]);

  // const [cropFilterMaster, setCropFilterMaster] = useState([])
  const [cropFilterDisplay, setCropFilterDisplay] = useState([]);

  // const [ageFilterMaster, setAgeFilterMaster] = useState([
  //                                     {index:0,name:"3 Months",isChecked:false},
  //                                     {index:1,name:"6 Months",isChecked:false},
  //                                     {index:2,name:"9 Months",isChecked:false},
  //                                     {index:3,name:"Constantly Updating",isChecked:false}])

  const [ageFilterDisplay, setAgeFilterDisplay] = useState([
    { index: 0, name: "3 Months", payloadName: "3 months", isChecked: false },
    { index: 1, name: "6 Months", payloadName: "6 months", isChecked: false },
    { index: 2, name: "9 Months", payloadName: "9 months", isChecked: false },
    { index: 3, name: "12 Months", payloadName: "12 months", isChecked: false },
    // { index: 4, name: "Constantly Updating", payloadName: "constantly_updating", isChecked: false }
  ]);

  const [constantyUpdateSwitch, setConstantyUpdateSwitch] = useState(false);

  const [statusFilter, setStatusFilter] = useState([
    {
      index: 0,
      name: screenlabels.dataset.for_review,
      payloadName: "for_review",
      isChecked: false,
    },
    {
      index: 1,
      name: screenlabels.dataset.rejected,
      payloadName: "rejected",
      isChecked: false,
    },
    {
      index: 2,
      name: screenlabels.dataset.approved,
      payloadName: "approved",
      isChecked: false,
    },
  ]);

  const [enableStatusFilter, setEnableStatusFilter] = useState([
    {
      index: 0,
      name: screenlabels.dataset.enabled,
      payloadName: "is_enabled",
      isChecked: false,
    },
    {
      index: 1,
      name: screenlabels.dataset.disbaled,
      payloadName: "is_enabled",
      isChecked: false,
    },
  ]);

  const [isGeoSearchFound, setIsGeoSearchFound] = useState(true);
  const [isCropSearchFound, setIsCropSearchFound] = useState(true);

  const [isAdminView, setisAdminView] = useState(true);
  const [viewdata, setviewdata] = useState({});
  const [tablekeys, settablekeys] = useState([]);
  const [id, setid] = useState("");
  const [requestchange, setrequestchange] = useState("");
  const [filterState, setFilterState] = useState({});

  var payload = "";
  var adminUrl = UrlConstant.base_url + UrlConstant.guest_dataset_filtered_data;
  //var memberUrl = UrlConstant.base_url + UrlConstant.dataset_list
  var guestUrl =
    UrlConstant.base_url + UrlConstant.search_dataset_end_point_guest;
  const resetUrls = () => {
    // setDatasetUrl(UrlConstant.base_url + UrlConstant.dataset_list)
    // setMemberDatasetUrl(UrlConstant.base_url + UrlConstant.dataset_list)
    adminUrl = UrlConstant.base_url + UrlConstant.guest_dataset_filtered_data;
    guestUrl =
      UrlConstant.base_url + UrlConstant.search_dataset_end_point_guest;
    //memberUrl = UrlConstant.base_url + UrlConstant.dataset_list
    setDatasetUrl(adminUrl)
  };
  const handleConstantyUpdateSwitch = (event) => {
    console.log(event.target.checked);
    let data = {};
    setFilterState({});
    // data['user_id'] = getUserLocal()
    // data['org_id'] = getOrgLocal()
    // if (isMemberTab) {
    //     data['others'] = true
    // } else {
    //     data['others'] = false
    // }
    if (event.target.checked) {
      setIsShowAll(false);
      data["constantly_update"] = true;
    } else {
      setIsShowAll(true);
    }
    setFilterState(data);
    payload = data;
    resetDateFilters();
    resetFilterState(screenlabels.dataset.age);
    // resetFilterState(screenlabels.dataset.crop);
    resetFilterState(screenlabels.dataset.status);
    resetFilterState(screenlabels.dataset.enabled);
    resetFilterState(screenlabels.dataset.geography);

    setConstantyUpdateSwitch(event.target.checked);

    getDatasetList(false);
  };

  const handleCategoryFilterChange = (value, action) => {
    // Get which field triggred the event
    const input_field = action.name;

    if (input_field === "Categories") {
      setCategoryFilterValue(value);
      switch (action.action) {
        case "select-option":
          // Add more subcategories (children of the selected category) to the subcategories option list
          const selected_option = action.option;
          let additional_subcategories = masterSubcategoryFilterOptions.filter(
            (subcategory) => subcategory.category === selected_option.value
          );
          setSubcategoryFilterOptions([
            ...subcategoryFilterOptions,
            ...additional_subcategories,
          ]);

          break;
        case "remove-value":
        case "pop-value":
          // Remove subcategories that belong to the removed category
          const popped_option = action.removedValue;
          // Remove subcategory options that belong to the removed category
          setSubcategoryFilterOptions(
            subcategoryFilterOptions.filter(
              (subcategory) => subcategory.category !== popped_option.value
            )
          );
          // Remove selected subcategories that belong to the removed category
          setSubcategoryFilterValue(
            subcategoryFilterValue.filter(
              (subcategory) => subcategory.category !== popped_option.value
            )
          );
          break;
        case "clear":
          // Clear all subcategory options
          setSubcategoryFilterOptions([]);
          setSubcategoryFilterValue([]);
          break;
      }
      // Reset dataset list to the original state if the category filter is empty
      if (value.length === 0) getAllDataSets();
    } else if (input_field === "Subcategories") {
      setSubcategoryFilterValue(value);
    }
  };

  const filterByCategory = () => {
    payload = buildFilterPayLoad("", getUserLocal(), "", "", "", "", {
      category: categoryFilterValue,
      subcategory: subcategoryFilterValue,
    });
    getDatasetList(false);
  };

  const handleFilterChange = (index, filterName) => {
    // var tempFilterMaster = []
    var isAnyFilterChecked = false;
    var tempFilterDisplay = [];
    var payloadList = [];
    // var payload = {}

    setIsShowAll(false);
    resetDateFilters();
    setConstantyUpdateSwitch(false);
    // resetEnabledStatusFilter()
    // resetUrls()

    if (filterName === screenlabels.dataset.geography) {
      resetFilterState("datavisiblity");
      resetFilterState(screenlabels.dataset.age);
      // resetFilterState(screenlabels.dataset.crop);
      resetFilterState(screenlabels.dataset.status);
      resetFilterState(screenlabels.dataset.enabled);

      tempFilterDisplay = [...geoFilterDisplay];
      for (let i = 0; i < tempFilterDisplay.length; i++) {
        if (tempFilterDisplay[i].index === index) {
          tempFilterDisplay[i].isChecked = !tempFilterDisplay[i].isChecked;
        }
        if (tempFilterDisplay[i].isChecked) {
          payloadList.push(tempFilterDisplay[i].name);
          isAnyFilterChecked = true;
        }
      }

      setGeoFilterDisplay(tempFilterDisplay);

      payload = buildFilterPayLoad("", getUserLocal(), payloadList, "", "", "");
    } else if (filterName === "datavisiblity") {
      resetFilterState(screenlabels.dataset.geography);
      resetFilterState(screenlabels.dataset.age);
      // resetFilterState(screenlabels.dataset.crop);
      resetFilterState(screenlabels.dataset.status);
      resetFilterState(screenlabels.dataset.enabled);

      tempFilterDisplay = [...dataAccessFilterDisplay];
      for (let i = 0; i < tempFilterDisplay.length; i++) {
        if (tempFilterDisplay[i].index === index) {
          tempFilterDisplay[i].isChecked = !tempFilterDisplay[i].isChecked;
        }
        if (tempFilterDisplay[i].isChecked) {
          payloadList.push(tempFilterDisplay[i].payloadName);
          isAnyFilterChecked = true;
        }
      }
      console.log("ddddonee", payloadList);
      setDataAccessDisplay(tempFilterDisplay);
      payload = buildFilterPayLoad("", getUserLocal(), "", payloadList, "", "");
    } else if (filterName === screenlabels.dataset.age) {
      resetFilterState("datavisiblity");
      resetFilterState(screenlabels.dataset.geography);
      // resetFilterState(screenlabels.dataset.crop);
      resetFilterState(screenlabels.dataset.status);
      resetFilterState(screenlabels.dataset.enabled);

      tempFilterDisplay = [...ageFilterDisplay];
      for (let i = 0; i < tempFilterDisplay.length; i++) {
        if (tempFilterDisplay[i].index === index) {
          tempFilterDisplay[i].isChecked = !tempFilterDisplay[i].isChecked;
        }
        if (tempFilterDisplay[i].isChecked) {
          payloadList.push(tempFilterDisplay[i].payloadName);
          isAnyFilterChecked = true;
        }
      }
      setAgeFilterDisplay(tempFilterDisplay);

      // tempFilterMaster = [...ageFilterMaster]
      // for(let i =0; i<tempFilterMaster.length; i++){
      //     if(tempFilterMaster[i].index == index){
      //         tempFilterMaster[i].isChecked = !tempFilterMaster[i].isChecked
      //     }
      //     if(tempFilterMaster[i].isChecked){
      //         payloadList.push(tempFilterMaster[i].name)
      //     }
      // }
      // setAgeFilterMaster(tempFilterMaster)
      payload = buildFilterPayLoad("", getUserLocal(), "", payloadList, "", "");
      // } else if (filterName === screenlabels.dataset.crop) {
      resetFilterState("datavisiblity");
      resetFilterState(screenlabels.dataset.geography);
      resetFilterState(screenlabels.dataset.age);
      resetFilterState(screenlabels.dataset.status);
      resetFilterState(screenlabels.dataset.enabled);

      tempFilterDisplay = [...cropFilterDisplay];
      for (let i = 0; i < tempFilterDisplay.length; i++) {
        if (tempFilterDisplay[i].index === index) {
          tempFilterDisplay[i].isChecked = !tempFilterDisplay[i].isChecked;
        }
        if (tempFilterDisplay[i].isChecked) {
          payloadList.push(tempFilterDisplay[i].name);
          isAnyFilterChecked = true;
        }
      }
      // setCropFilterDisplay(tempFilterDisplay);

      payload = buildFilterPayLoad("", getUserLocal(), "", "", payloadList, "");
    } else if (filterName === screenlabels.dataset.status) {
      resetFilterState("datavisiblity");
      resetFilterState(screenlabels.dataset.geography);
      resetFilterState(screenlabels.dataset.age);
      // resetFilterState(screenlabels.dataset.crop);
      resetFilterState(screenlabels.dataset.enabled);

      tempFilterDisplay = [...statusFilter];
      for (let i = 0; i < tempFilterDisplay.length; i++) {
        if (tempFilterDisplay[i].index === index) {
          tempFilterDisplay[i].isChecked = !tempFilterDisplay[i].isChecked;
        }
        if (tempFilterDisplay[i].isChecked) {
          payloadList.push(tempFilterDisplay[i].payloadName);
          isAnyFilterChecked = true;
        }
      }
      setStatusFilter(tempFilterDisplay);

      payload = buildFilterPayLoad("", getUserLocal(), "", "", "", payloadList);
    } else if (filterName === screenlabels.dataset.enabled) {
      resetFilterState("datavisiblity");
      resetFilterState(screenlabels.dataset.geography);
      resetFilterState(screenlabels.dataset.age);
      // resetFilterState(screenlabels.dataset.crop);
      resetFilterState(screenlabels.dataset.status);

      tempFilterDisplay = [...enableStatusFilter];
      if (index == 0) {
        tempFilterDisplay[0].isChecked = !tempFilterDisplay[0].isChecked;
        tempFilterDisplay[1].isChecked = false;
      } else {
        tempFilterDisplay[0].isChecked = false;
        tempFilterDisplay[1].isChecked = !tempFilterDisplay[1].isChecked;
      }
      if (tempFilterDisplay[0].isChecked || tempFilterDisplay[1].isChecked) {
        isAnyFilterChecked = true;
      }
      setEnableStatusFilter(tempFilterDisplay);
      payload = buildFilterPayLoad("", getUserLocal(), "", "", "", "");
    }
    if (isAnyFilterChecked) {
      getDatasetList(false);
    } else {
      clearAllFilters();
    }
  };

  const resetFilterState = (filterName) => {
    setSearchValOtherOrg({ ...searchValOtherOrg, val: "" })
    setSearchValMyOrg({ ...searchValMyOrg, val: "" })
    setSearchDatasetVar({ ...searchDatasetVar, val: "" })
    var tempfilterMaster = [];
    var tempFilerDisplay = [];
    if (filterName === screenlabels.dataset.geography) {
      // tempfilterMaster = [...geoFilterMaster]
      // for(let i=0; i<tempfilterMaster.length; i++){
      //     tempfilterMaster[i].isChecked = false
      // }
      // setGeoFilterMaster(tempfilterMaster)

      tempFilerDisplay = [...geoFilterDisplay];
      for (let i = 0; i < tempFilerDisplay.length; i++) {
        tempFilerDisplay[i].isChecked = false;
        tempFilerDisplay[i].isDisplayed = true;
      }
      setGeoFilterDisplay(tempFilerDisplay);
      setGeoSearchState("");
    } else if (filterName === "datavisiblity") {
      tempFilerDisplay = [...dataAccessFilterDisplay];
      for (let i = 0; i < tempFilerDisplay.length; i++) {
        tempFilerDisplay[i].isChecked = false;
        tempFilerDisplay[i].isDisplayed = true;
      }
      setDataAccessDisplay(tempFilerDisplay);
    } else if (filterName === screenlabels.dataset.age) {
      // tempfilterMaster = [...ageFilterMaster]
      // for(let i=0; i<tempfilterMaster.length; i++){
      //     tempfilterMaster[i].isChecked = false
      // }
      // setAgeFilterMaster(tempfilterMaster)

      tempFilerDisplay = [...ageFilterDisplay];
      for (let i = 0; i < tempFilerDisplay.length; i++) {
        tempFilerDisplay[i].isChecked = false;
        tempFilerDisplay[i].isDisplayed = true;
      }
      setAgeFilterDisplay(tempFilerDisplay);
      // } else if (filterName === screenlabels.dataset.crop) {
      // tempfilterMaster = [...cropFilterMaster]
      // for(let i=0; i<tempfilterMaster.length; i++){
      //     tempfilterMaster[i].isChecked = false
      // }
      // setCropFilterMaster(tempfilterMaster)

      // tempFilerDisplay = [...cropFilterDisplay];
      // for (let i = 0; i < tempFilerDisplay.length; i++) {
      //   tempFilerDisplay[i].isChecked = false;
      //   tempFilerDisplay[i].isDisplayed = true;
      // }
      // setCropFilterDisplay(tempFilerDisplay);
      // setCropSearchState("");
    } else if (filterName === screenlabels.dataset.status) {
      tempFilerDisplay = [...statusFilter];
      for (let i = 0; i < tempFilerDisplay.length; i++) {
        tempFilerDisplay[i].isChecked = false;
        // tempFilerDisplay[i].isDisplayed = true
      }
      setStatusFilter(tempFilerDisplay);
    } else if (filterName === screenlabels.dataset.enabled) {
      tempFilerDisplay = [...enableStatusFilter];
      tempFilerDisplay[0].isChecked = false;
      tempFilerDisplay[1].isChecked = false;
      setEnableStatusFilter(tempFilerDisplay);
    }
  };

  const handleGeoSearch = (e) => {
    var searchFound = false;
    const searchText = e.target.value;
    setGeoSearchState(searchText);
    var tempList = [...geoFilterDisplay];
    for (let i = 0; i < tempList.length; i++) {
      if (searchText == "") {
        tempList[i].isDisplayed = true;
        searchFound = true;
      } else {
        if (
          !tempList[i].name.toUpperCase().startsWith(searchText.toUpperCase())
        ) {
          tempList[i].isDisplayed = false;
        } else {
          searchFound = true;
          tempList[i].isDisplayed = true;
        }
      }
    }
    setIsGeoSearchFound(searchFound);
    setGeoFilterDisplay(tempList);
  };

  // const handleCropSearch = (e) => {
  //   var searchFound = false;
  //   const searchText = e.target.value;
  //   setCropSearchState(searchText);
  //   var tempList = [...cropFilterDisplay];
  //   for (let i = 0; i < tempList.length; i++) {
  //     if (searchText === "") {
  //       tempList[i].isDisplayed = true;
  //       searchFound = true;
  //     } else {
  //       if (
  //         tempList[i].name &&
  //         tempList[i].name.length > 0 &&
  //         !tempList[i].name.toUpperCase().startsWith(searchText.toUpperCase())
  //       ) {
  //         tempList[i].isDisplayed = false;
  //       } else {
  //         searchFound = true;
  //         tempList[i].isDisplayed = true;
  //       }
  //     }
  //   }
  //   setIsCropSearchFound(searchFound);
  //   setCropFilterDisplay(tempList);
  // };

  async function getSearchedData(val, isLoadMore, isMemberTab) {
    // console.log(val, "Here is value")
    if (val.length < 3 && val !== "") {
      val = "";
      setDatasetUrl(adminUrl)
    }
    // console.log(val)
    let data = {};
    setFilterState({});
    // data['user_id'] = getUserLocal()
    // data['org_id'] = getOrgLocal()
    data["name__icontains"] = val.trim();
    // if (isMemberTab) {
    //     data['others'] = true
    // } else {
    //     data['others'] = false
    // }

    // let ans = await fetch("https://jsonplaceholder.typicode.com/posts")
    // let data = await ans.json()
    // console.log("DATAAA", data, datasetList, memberDatasetList, val)

    // HTTPService(
    //     "POST",
    //     // "GET",
    //     // isMemberTab ? memberDatasetUrl : datasetUrl,
    //     // UrlConstant.base_url + "participant/datasets/search_datasets/",
    //     UrlConstant.base_url + "microsite/datasets/search_datasets/",
    //     data,
    //     false,
    //     true
    // )
    // console.log(isLoadMore)
    let url = !isLoadMore ? guestUrl : datasetUrl;

    Axios.post(url, data)
      .then((response) => {
        setIsLoader(false);
        console.log("response:", response);
        console.log("datatset:", response.data.results);

        if (response.data.next == null) {
          setisShowLoadMoreButton(false);
          setShowLoadMoreAdmin(false);
          setShowLoadMoreMember(false);
          setFilterState({});
        } else {
          setisShowLoadMoreButton(true);
          console.log(value);
          if (value === "1") {
            setDatasetUrl(response.data.next);
            // adminUrl = response.data.next
            setShowLoadMoreAdmin(true);
            setShowLoadMoreMember(false);
          } else {
            //setMemberDatasetUrl(response.data.next)
            // memberUrl = response.data.next
            setShowLoadMoreAdmin(false);
            setShowLoadMoreMember(true);
          }
        }
        let finalDataList = [];
        if (!isMemberTab) {
          if (isLoadMore) {
            finalDataList = [...datasetList, ...response.data.results];
          } else {
            finalDataList = [...response.data.results];
          }
          setDatasetList(finalDataList);
        } else {
          if (isLoadMore) {
            finalDataList = [...memberDatasetList, ...response.data.results];
          } else {
            finalDataList = [...response.data.results];
          }
          setMemberDatasetList(finalDataList);
        }
      })
      .catch((e) => {
        console.log(e);
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  }

  useEffect(() => {
    getFilters();
    payload = buildFilterPayLoad("", getUserLocal(), "", "", "", "");
    getDatasetList(false);
  }, [value]);

  const getFilters = () => {
    setIsLoader(true);
    HTTPService(
      "POST",
      UrlConstant.base_url + UrlConstant.guest_dataset_filters,
      "",
      false,
      false
    )
      .then((response) => {
        setIsLoader(false);
        console.log("filter response:", response);

        let catAndSubcatFilterInput = response.data.category_detail || {};

        let tempCategory = [];
        let tempSubcategory = [];

        Object.keys(catAndSubcatFilterInput).forEach((cat) => {
          let category = {};

          category.value = category.label = cat;
          tempCategory.push(category);

          catAndSubcatFilterInput[cat].forEach((sub_cat) => {
            let subcategory = {};
            subcategory.category = cat;
            subcategory.value = subcategory.label = sub_cat;
            tempSubcategory.push(subcategory);
          });
          // delete category.children;
        });

        setCategoryFilterOptions(tempCategory);
        setMasterSubcategoryFilterOptions(tempSubcategory);

        var geoFilterInput = response.data.geography;
        // var cropFilterInput = response.data.crop_detail;
        setGeoFilterDisplay(initFilter(geoFilterInput));
        // setCropFilterDisplay(initFilter(cropFilterInput));
        console.log("geoFilterDisplay", geoFilterDisplay);
        // console.log("cropFilterDisplay", cropFilterDisplay);
        setConstantyUpdateSwitch(false);
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  const initFilter = (filterInput) => {
    let filter = [];
    for (var i = 0; i < filterInput.length; i++) {
      if (filterInput[i] && filterInput[i].length > 0) {
        var data = {};
        data["index"] = i;
        data["name"] = filterInput[i];
        data["isChecked"] = false;
        data["isDisplayed"] = true;
        filter.push(data);
      }
    }
    return filter;
  };

  const getDatasetList = (isLoadMore) => {
    if (searchValMyOrg.val && isLoadMore) {
      getSearchedData(searchValMyOrg.val, isLoadMore, false);
      return;
    }
    setIsLoader(true);

    if (!isLoadMore) {
      resetUrls();
      if (payload === "") {
        payload = buildFilterPayLoad("", getUserLocal(), "", "", "", "");
      }
    } else {
      payload = { ...filterState };
    }
    // setIsLoader(true);
    // if (payload == "") {
    //     payload = buildFilterPayLoad("", getUserLocal(), "", "", "", "")
    // }
    // if (isLoadMore){
    //     payload = {...filterState}
    // }
    console.log('payload just before api call', payload)

    HTTPService(
      "POST",
      // "GET",
      // isMemberTab ? memberDatasetUrl : datasetUrl,
      !isLoadMore ? adminUrl : datasetUrl,
      payload,
      false,
      false
    )
      .then((response) => {
        setIsLoader(false);
        console.log("response:", response);
        console.log("datatset:", response.data.results);

        if (response.data.next == null) {
          setisShowLoadMoreButton(false);
          setShowLoadMoreAdmin(false);
          setShowLoadMoreMember(false);
          setFilterState({});
        } else {
          setisShowLoadMoreButton(true);
          if (value === "1") {
            setDatasetUrl(response.data.next);
            // adminUrl = response.data.next
            setShowLoadMoreAdmin(true);
            setShowLoadMoreMember(false);
          } else {
            //setMemberDatasetUrl(response.data.next)
            // memberUrl = response.data.next
            setShowLoadMoreAdmin(false);
            setShowLoadMoreMember(true);
          }
        }
        let finalDataList = [];
        if (!isMemberTab) {
          if (isLoadMore) {
            finalDataList = [...datasetList, ...response.data.results];
          } else {
            finalDataList = [...response.data.results];
          }
          setDatasetList(finalDataList);
        } else {
          if (isLoadMore) {
            finalDataList = [...memberDatasetList, ...response.data.results];
          } else {
            finalDataList = [...response.data.results];
          }
          setMemberDatasetList(finalDataList);
        }
      })
      .catch((e) => {
        console.log(e);
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  const buildFilterPayLoad = (
    createdAtRange,
    userId,
    geoPayload,
    datavisiblityPayload,
    agePayload,
    // cropPayload,
    statusPayload,
    catAndSubcat = null
  ) => {
    let data = {};
    if (createdAtRange !== "") {
      console.log('data range in creating payload', createdAtRange)
      data["updated_at__range"] = createdAtRange;
    }

    if (catAndSubcat !== null) {
      data["category"] = [];
      for (const category of catAndSubcat["category"]) {
        data["category"].push({ [category.value]: [] });
      }

      for (const subcategory of catAndSubcat["subcategory"]) {
        for (const cat of data["category"]) {
          const key = Object.keys(cat)[0];
          if (key === subcategory.category) cat[key].push(subcategory.value);
        }
      }
    }
    if (geoPayload !== "") {
      data["geography__in"] = geoPayload;
    }
    if (datavisiblityPayload) {
      data["is_public__in"] = datavisiblityPayload;
    }
    // if (cropPayload !== "") {
    //   data["crop_detail__in"] = cropPayload;
    // }
    if (agePayload !== "") {
      // if(ageFilterDisplay[ageFilterDisplay.length-1].isChecked){
      //     agePayload.splice(agePayload.length-1)
      //     data['constantly_update'] = true
      // }
      // if (agePayload.length>0) {
      data["age_of_date__in"] = agePayload;
      // }
    }
    if (statusPayload !== "") {
      data["approval_status__in"] = statusPayload;
    }
    if (enableStatusFilter[0].isChecked || enableStatusFilter[1].isChecked) {
      data["is_enabled"] = enableStatusFilter[0].isChecked;
    }
    setFilterState(data);
    return data;
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    if (newValue == "2") {
      console.log("isMemberTab", isMemberTab);
      setIsMemberTab(!isMemberTab);
      console.log("isMemberTab", isMemberTab);
    } else {
      setIsMemberTab(!isMemberTab);
    }
    console.log("isMemberTab", isMemberTab);
    clearAllFilters();
    console.log("isMemberTab", isMemberTab);
  };

  const resetDateFilters = () => {
    settodate(null);
    setfromdate(null);
    setsecondrow(false);
  };

  const resetCatAndSubcatFilters = () => {
    setSubcategoryFilterValue([]);
    setSubcategoryFilterOptions([]);
    setCategoryFilterValue([]);
  };

  const clearAllFilters = () => {
    setSearchValOtherOrg({ ...searchValOtherOrg, val: "" })
    setSearchValMyOrg({ ...searchValMyOrg, val: "" })
    setSearchDatasetVar({ ...searchDatasetVar, val: "" })
    console.log("RESET")
    setIsShowAll(true);
    resetDateFilters();
    setConstantyUpdateSwitch(false);
    resetCatAndSubcatFilters();
    resetFilterState(screenlabels.dataset.geography);
    resetFilterState(screenlabels.dataset.age);
    resetFilterState(screenlabels.dataset.status);
    resetFilterState(screenlabels.dataset.enabled);
    // setDatasetUrl(adminUrl)
    resetUrls()
    payload = buildFilterPayLoad("", getUserLocal(), "", "", "", "");
    getDatasetList(false);
  };

  const getAllDataSets = () => {
    setSearchValOtherOrg({ ...searchValOtherOrg, val: "" })
    setSearchValMyOrg({ ...searchValMyOrg, val: "" })
    setSearchDatasetVar({ ...searchDatasetVar, val: "" })
    resetFilterState("datavisiblity");
    resetFilterState(screenlabels.dataset.geography);
    resetFilterState(screenlabels.dataset.age);
    // resetFilterState(screenlabels.dataset.crop);
    resetFilterState(screenlabels.dataset.status);

    // resetUrls()

    setConstantyUpdateSwitch(false);
    setIsShowAll(true);
    setsecondrow(false);
    settodate(null);
    setfromdate(null);

    payload = buildFilterPayLoad("", getUserLocal(), "", "", "", "");

    getDatasetList(false);
  };

  const filterByDates = () => {
    let fromDateandToDate = [];
    fromDateandToDate.push(new Date(fromdate.getTime() - (fromdate.getTimezoneOffset() * 60000)).toJSON());
    // Adding 86400000 will add 1 more day in date (86400000 == 24hrs)
    fromDateandToDate.push(new Date(todate.getTime() - (todate.getTimezoneOffset() * 60000) + 86400000).toJSON());
    console.log('payload in date fillter api', fromDateandToDate, fromdate, todate)


    setIsShowAll(false);
    resetFilterState(screenlabels.dataset.geography);
    resetFilterState(screenlabels.dataset.age);
    // resetFilterState(screenlabels.dataset.crop);
    resetFilterState(screenlabels.dataset.status);
    setConstantyUpdateSwitch(false);
    // resetUrls()

    payload = buildFilterPayLoad(
      fromDateandToDate,
      getUserLocal(),
      "",
      "",
      "",
      ""
    );
    setsecondrow(true);
    getDatasetList(false);
  };

  const downloadAttachment = (uri) => {
    FileSaver.saveAs(UrlConstant.base_url_without_slash + uri);
  };
  /*
    const changeView = (keyname) => {
        let tempfilterObject = { ...screenView }
        Object.keys(tempfilterObject).forEach(function (key) { if (key != keyname) { tempfilterObject[key] = false } else { tempfilterObject[key] = true } });
        setscreenView(tempfilterObject)
    }*/
  const viewCardDetails = (id, flag) => {
    setid(id);
    history.push("/home/viewdataset/" + id);
    // setIsLoader(true);
    // setisAdminView(flag);
    // HTTPService(
    //   "GET",
    //   UrlConstant.base_url + UrlConstant.dataset + id + "/",
    //   "",
    //   false,
    //   false
    // )
    //   .then((response) => {
    //     setIsLoader(false);
    //     console.log("filter response:", response);
    //     let tempObject = { ...response.data };
    //     setviewdata(tempObject);
    //     var tabelHeading = Object.keys(response.data.content[0]);
    //     var temptabelKeys = [...tabelHeading];
    //     settablekeys(temptabelKeys);
    //     //changeView('isDataSetView')
    //   })
    //   .catch((e) => {
    //     setIsLoader(false);
    //     //history.push(GetErrorHandlingRoute(e));
    //   });
  };
  function checkForRegex(val, e) {
    if (val.match(RegexConstants.ORG_NAME_REGEX)) {
      !isMemberTab
        ? setSearchValMyOrg({ val: val })
        : setSearchValOtherOrg({ val: val });
    }

    return;
    // if()
  }

  return (
    <>
      {isLoader ? <Loader /> : ""}
      {console.log(Object.keys(viewdata).length)}
      {Object.keys(viewdata).length > 0 ? (
        <>
          <div className="guestdiv">
            {/* <ViewDataSet
              downloadAttachment={(uri) => downloadAttachment(uri)}
              back={() => {
                setviewdata({});
                history.push("/home");
              }}
              rowdata={viewdata}
              tabelkeys={tablekeys}
            ></ViewDataSet> */}
          </div>
        </>
      ) : (
        <>
          <div className="guestdiv">
            <Row className="supportfirstmaindiv">
              <Row className="supportmaindiv">
                <Box
                  onClick={() => setIsExploreDatasetViewOn(false)}
                  className={styles.backButtonMainDiv + " back_btn_guest"}
                  sx={{
                    display: "flex",
                    justifyContent: "left",
                    marginBottom: "20px",
                  }}
                >
                  <ArrowBackIcon></ArrowBackIcon>{" "}
                  <span style={{ marginLeft: "14px" }}>{labels.en.common.back}</span>{" "}
                </Box>
                <Row className="supportfilterRow">
                  <Col className="supportfilterCOlumn">
                    <GuestUserDatasetFilter
                      setSearchValMyOrg={setSearchValMyOrg}
                      setSearchValOtherOrg={setSearchValOtherOrg}
                      searchValMyOrg={searchValMyOrg}
                      searchValOtherOrg={searchValOtherOrg}
                      checkForRegex={checkForRegex}
                      setSearchDatasetVar={setSearchDatasetVar}
                      searchDatasetVar={searchDatasetVar}
                      isMemberTab={isMemberTab}
                      debounceOnChange={debounceOnChange}
                      isShowAll={isShowAll}
                      setIsShowAll={setIsShowAll}
                      secondrow={secondrow}
                      fromdate={fromdate}
                      todate={todate}
                      setfromdate={setfromdate}
                      settodate={settodate}
                      getAllDataSets={getAllDataSets}
                      filterByDates={filterByDates}
                      handleGeoSearch={handleGeoSearch}
                      // handleCropSearch={handleCropSearch}
                      // Props for category filter
                      categoryFilterOptions={categoryFilterOptions}
                      subcategoryFilterOptions={subcategoryFilterOptions}
                      categoryFilterValue={categoryFilterValue}
                      subcategoryFilterValue={subcategoryFilterValue}
                      handleCategoryFilterChange={handleCategoryFilterChange}
                      filterByCategory={filterByCategory}
                      // End of catagory filter props
                      geoFilterDisplay={geoFilterDisplay}
                      dataAccessFilterDisplay={dataAccessFilterDisplay}
                      // cropFilterDisplay={cropFilterDisplay}
                      ageFilterDisplay={ageFilterDisplay}
                      handleFilterChange={handleFilterChange}
                      resetFilterState={resetFilterState}
                      geoSearchState={geoSearchState}
                      // cropSearchState={cropSearchState}
                      clearAllFilters={clearAllFilters}
                      showMemberFilters={value == "2"}
                      // isEnabledFilter={isEnabledFilter}
                      // isDisabledFilter={isDisabledFilter}
                      // handleEnableStatusFilter={handleEnableStatusFilter}
                      // forReviewFilter={forReviewFilter}
                      // rejectedFilter={rejectedFilter}
                      // approvedFilter={approvedFilter}
                      statusFilter={statusFilter}
                      // handleStatusFilter={handleStatusFilter}
                      // resetEnabledStatusFilter={resetEnabledStatusFilter}
                      // resetUrls={resetUrls}
                      enableStatusFilter={enableStatusFilter}
                      isGeoSearchFound={isGeoSearchFound}
                      // isCropSearchFound={isCropSearchFound}
                      constantyUpdateSwitch={constantyUpdateSwitch}
                      handleConstantyUpdateSwitch={handleConstantyUpdateSwitch}
                    />
                  </Col>
                  <Col className="supportSecondCOlumn">
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className="settingsTabs"
                    >
                      <GuestUserDatasetListing
                        datasetList={datasetList}
                        isShowLoadMoreButton={showLoadMoreAdmin}
                        isMemberTab={value === "2"}
                        getDatasetList={getDatasetList}
                        viewCardDetails={(id) => viewCardDetails(id, true)}
                      />
                    </Col>
                  </Col>
                </Row>
              </Row>
            </Row>
          </div>
        </>
      )}
    </>
  );
}
