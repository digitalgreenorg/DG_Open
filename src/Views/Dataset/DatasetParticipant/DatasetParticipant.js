import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import labels from "../../../Constants/labels";
import Loader from "../../../Components/Loader/Loader";
import DataSetFilter from "../DataSetFilter";
import DataSetListing from "../DataSetListing";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext } from "@mui/lab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import UrlConstant from "../../../Constants/UrlConstants";
import HTTPService from "../../../Services/HTTPService";
import { debounce, GetErrorHandlingRoute } from "../../../Utils/Common";
import { useHistory } from "react-router-dom";
import { getUserLocal, getUserMapId, getOrgLocal } from "../../../Utils/Common";
import ViewDataSet from "../../../Components/Datasets/viewDataSet";
import Success from "../../../Components/Success/Success";
import Delete from "../../../Components/Delete/Delete";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import FileSaver from "file-saver";
import UrlConstants from "../../../Constants/UrlConstants";
import Button from "@mui/material/Button";
import "../DatasetAdmin/DatasetAdmin.css";
import RegexConstants from "../../../Constants/RegexConstants";
export default function DatasetParticipant() {
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
    UrlConstant.base_url + UrlConstant.dataset_participant_list
  );
  const [memberDatasetUrl, setMemberDatasetUrl] = useState(
    UrlConstant.base_url + UrlConstant.dataset_participant_list
  );
  //   const debounceOnChange = React.useCallback(debounce(getSearchedData, 1000), []);
  const debounceOnChange = React.useCallback(
    debounce(!isMemberTab ? getSearchedData : getSearchOtherData, 1000),
    []
  );
  const [searchDatasetUrl, setSearchDatasetUrl] = useState(
    UrlConstant.base_url + UrlConstant.search_dataset_end_point_participant
  );
  const [searchDatasetVar, setSearchDatasetVar] = useState({ val: "" });
  const [searchValMyOrg, setSearchValMyOrg] = useState({ val: "" });
  const [searchValOtherOrg, setSearchValOtherOrg] = useState({ val: "" });

  const [isShowAll, setIsShowAll] = useState(true);

  const [categoryFilterOptions, setCategoryFilterOptions] = useState([]);
  const [masterSubcategoryFilterOptions, setMasterSubcategoryFilterOptions] =
    useState([]);
  const [subcategoryFilterOptions, setSubcategoryFilterOptions] = useState([]);
  const [categoryFilterValue, setCategoryFilterValue] = useState([]);
  const [subcategoryFilterValue, setSubcategoryFilterValue] = useState([]);

  const [geoSearchState, setGeoSearchState] = useState("");
  // const [cropSearchState, setCropSearchState] = useState("");

  const [datasetList, setDatasetList] = useState([]);
  const [memberDatasetList, setMemberDatasetList] = useState([]);

  const [dataAccessFilterDisplay, setDataAccessDisplay] = useState([
    { index: 0, name: "Public", payloadName: true, isChecked: false },
    { index: 1, name: "Private", payloadName: false, isChecked: false },
  ]);
  // const [geoFilterMaster,setGeoFilterMaster] = useState([])
  const [geoFilterDisplay, setGeoFilterDisplay] = useState([]);

  // const [cropFilterMaster, setCropFilterMaster] = useState([])
  // const [cropFilterDisplay, setCropFilterDisplay] = useState([]);

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
  // const [isCropSearchFound, setIsCropSearchFound] = useState(true);

  const [screenView, setscreenView] = useState({
    isDataSetFilter: true,
    isDataSetView: false,
    isApprove: false,
    isApproveSuccess: false,
    isDisapprove: false,
    isDisapproveSuccess: false,
    isDelete: false,
    isDeleSuccess: false,
    isEnable: false,
    isEnableSuccess: false,
    isDisable: false,
    isDisableSuccess: false,
    isChangeRequestSuccess: false,
  });
  const [isAdminView, setisAdminView] = useState(true);
  const [viewdata, setviewdata] = useState({});
  const [tablekeys, settablekeys] = useState([]);
  const [id, setid] = useState("");
  const [requestchange, setrequestchange] = useState("");

  const [filterState, setFilterState] = useState({});

  var payload = "";
  var adminUrl = UrlConstant.base_url + UrlConstant.dataset_participant_list;
  var memberUrl = UrlConstant.base_url + UrlConstant.dataset_participant_list;
  var searchUrl =
    UrlConstant.base_url + UrlConstant.search_dataset_end_point_participant;

  const resetUrls = () => {
    // setDatasetUrl(UrlConstant.base_url + UrlConstant.dataset_list)
    // setMemberDatasetUrl(UrlConstant.base_url + UrlConstant.dataset_list)
    adminUrl = UrlConstant.base_url + UrlConstant.dataset_participant_list;
    memberUrl = UrlConstant.base_url + UrlConstant.dataset_participant_list;
    searchUrl =
      UrlConstant.base_url + UrlConstant.search_dataset_end_point_participant;

    setDatasetUrl("");
    setMemberDatasetUrl("");
  };

  const handleConstantyUpdateSwitch = (event) => {
    console.log(event.target.checked);
    let data = {};
    setFilterState({});
    data["user_id"] = getUserLocal();
    data["org_id"] = getOrgLocal();
    if (isMemberTab) {
      data["others"] = true;
    } else {
      data["others"] = false;
    }
    if (event.target.checked) {
      setIsShowAll(false);
      data["constantly_update"] = true;
    } else {
      setIsShowAll(true);
    }
    setFilterState(data);
    payload = data;
    resetDateFilters();
    resetFilterState("datavisiblity");
    resetFilterState(screenlabels.dataset.age);
    // resetFilterState(screenlabels.dataset.crop);
    resetFilterState(screenlabels.dataset.status);
    resetFilterState(screenlabels.dataset.enabled);
    resetFilterState(screenlabels.dataset.geography);

    setConstantyUpdateSwitch(event.target.checked);

    if (isMemberTab) {
      getMemberDatasets(false);
    } else {
      getMyDataset(false);
    }
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
    if (isMemberTab) getMemberDatasets(false);
    else getMyDataset(false);
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

      // tempFilterMaster = [...geoFilterMaster]
      // for(let i =0; i<tempFilterMaster.length; i++){
      //     if(tempFilterMaster[i].index == index){
      //         tempFilterMaster[i].isChecked = !tempFilterMaster[i].isChecked
      //     }
      //     if(tempFilterMaster[i].isChecked){
      //         payloadList.push(tempFilterMaster[i].name)
      //     }
      // }
      // setGeoFilterMaster(tempFilterMaster)
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
    }
    // else if (filterName === screenlabels.dataset.crop) {
    //   resetFilterState("datavisiblity");
    //   resetFilterState(screenlabels.dataset.geography);
    //   resetFilterState(screenlabels.dataset.age);
    //   resetFilterState(screenlabels.dataset.status);
    //   resetFilterState(screenlabels.dataset.enabled);

    //   tempFilterDisplay = [...cropFilterDisplay];
    //   for (let i = 0; i < tempFilterDisplay.length; i++) {
    //     if (tempFilterDisplay[i].index == index) {
    //       tempFilterDisplay[i].isChecked = !tempFilterDisplay[i].isChecked;
    //     }
    //     if (tempFilterDisplay[i].isChecked) {
    //       payloadList.push(tempFilterDisplay[i].name);
    //       isAnyFilterChecked = true;
    //     }
    //   }
    //   setCropFilterDisplay(tempFilterDisplay);

    //   // tempFilterMaster = [...cropFilterMaster]
    //   // for(let i =0; i<tempFilterMaster.length; i++){
    //   //     if(tempFilterMaster[i].index == index){
    //   //         tempFilterMaster[i].isChecked = !tempFilterMaster[i].isChecked
    //   //     }
    //   //     if(tempFilterMaster[i].isChecked){
    //   //         payloadList.push(tempFilterMaster[i].name)
    //   //     }
    //   // }
    //   // setCropFilterMaster(tempFilterMaster)
    //   payload = buildFilterPayLoad("", getUserLocal(), "", "", payloadList, "");
    // }
    else if (filterName === screenlabels.dataset.status) {
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
      if (isMemberTab) {
        getMemberDatasets(false);
      } else {
        getMyDataset(false);
      }
      // getDatasetList(false)
    } else {
      clearAllFilters();
    }
  };

  const resetFilterState = (filterName) => {
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
    }
    // else if (filterName === screenlabels.dataset.crop) {
    //   // tempfilterMaster = [...cropFilterMaster]
    //   // for(let i=0; i<tempfilterMaster.length; i++){
    //   //     tempfilterMaster[i].isChecked = false
    //   // }
    //   // setCropFilterMaster(tempfilterMaster)

    //   tempFilerDisplay = [...cropFilterDisplay];
    //   for (let i = 0; i < tempFilerDisplay.length; i++) {
    //     tempFilerDisplay[i].isChecked = false;
    //     tempFilerDisplay[i].isDisplayed = true;
    //   }
    //   setCropFilterDisplay(tempFilerDisplay);
    //   setCropSearchState("");
    // }
    else if (filterName === screenlabels.dataset.status) {
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

  // const resetEnabledStatusFilter = () => {
  //     setIsEnabledFilter(false)
  //     setIsDisabledFilter(false)
  // }

  // const handleEnableStatusFilter = (filterName) => {
  //     //reset other filters and states
  //     setIsShowAll(false)
  //     resetDateFilters()
  //     // resetUrls()
  //     resetFilterState(screenlabels.dataset.geography)
  //     resetFilterState(screenlabels.dataset.age)
  //     resetFilterState(screenlabels.dataset.crop)
  //     resetFilterState(screenlabels.dataset.status)

  //     if (filterName == screenlabels.dataset.enabled) {
  //         setIsEnabledFilter(!isEnabledFilter)
  //         setIsDisabledFilter(false)
  //     } else {
  //         setIsEnabledFilter(false)
  //         setIsDisabledFilter(!isDisabledFilter)
  //     }
  //     payload = buildFilterPayLoad("", getUserLocal(), "", "", "", "")
  //     getDatasetList(false)
  // }

  const handleGeoSearch = (e) => {
    var searchFound = false;
    const searchText = e.target.value;
    setGeoSearchState(searchText);
    var tempList = [...geoFilterDisplay];
    for (let i = 0; i < tempList.length; i++) {
      if (searchText === "") {
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
  //     if (searchText == "") {
  //       tempList[i].isDisplayed = true;
  //       searchFound = true;
  //     } else {
  //       if (
  //         !tempList[i].name.toUpperCase().startsWith(searchText.toUpperCase())
  //       ) {
  //         tempList[i].isDisplayed = false;
  //       } else {
  //         searchFound = true;
  //         tempList[i].isDisplayed = true;
  //       }
  //     }
  //   }

  // setIsCropSearchFound(searchFound);
  // setCropFilterDisplay(tempList);
  // };
  async function getSearchOtherData(val, isLoadMore, isMemberTab) {
    // console.log(val, "Here is value")

    if (val && val.length < 3 && val !== "") val = "";
    // console.log(val)
    let data = {};
    setFilterState({});
    data["user_id"] = getUserLocal();
    data["org_id"] = getOrgLocal();
    data["name__icontains"] = val;
    if (isMemberTab) {
      data["others"] = true;
    } else {
      data["others"] = false;
    }

    // let ans = await fetch("https://jsonplaceholder.typicode.com/posts")
    // let data = await ans.json()
    // console.log("DATAAA", data, datasetList, memberDatasetList, val)

    HTTPService(
      "POST",
      // "GET",
      // isMemberTab ? memberDatasetUrl : datasetUrl,
      // UrlConstant.base_url + "participant/datasets/search_datasets/",
      !isLoadMore ? searchUrl : memberDatasetUrl ? memberDatasetUrl : searchUrl,
      data,
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("response:", response);
        console.log("datatset:", response.data.results);

        if (response.data.next == null) {
          // setisShowLoadMoreButton(false)
          // setShowLoadMoreAdmin(false)
          setShowLoadMoreMember(false);
          setFilterState({});
        } else {
          // setisShowLoadMoreButton(true)
          setMemberDatasetUrl(response.data.next);
          // memberUrl = response.data.next
          setShowLoadMoreMember(true);
        }
        let finalDataList = [];
        if (isLoadMore) {
          finalDataList = [...memberDatasetList, ...response.data.results];
        } else {
          finalDataList = [...response.data.results];
          console.log(finalDataList);
        }
        if (isMemberTab) {
          setMemberDatasetList(finalDataList);
        } else {
          setDatasetList(finalDataList);
        }
      })
      .catch((e) => {
        console.log(e);
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  }

  function fetchSearchDataWithLoadMoreButtonMember(isLoadMore) {
    setIsLoader(true);
    console.log("payload", searchDatasetVar);

    // if(!isLoadMore){
    resetUrls();

    // payload = buildFilterPayLoad("", getUserLocal(), "", "", "", "")
    payload = {};
    payload["user_id"] = getUserLocal();
    payload["org_id"] = getOrgLocal();
    payload["others"] = true;
    payload["name__icontains"] = searchValOtherOrg.val.trim();

    // setFilterState(payload)
    // if(searchDatasetVar){
    //     payload["name__icontains"] = searchDatasetVar
    // }
    // }

    HTTPService(
      "POST",
      // "GET",
      // isMemberTab ? memberDatasetUrl : datasetUrl,
      !isLoadMore ? searchUrl : memberDatasetUrl ? memberDatasetUrl : searchUrl,
      payload,
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("response:", response);
        console.log("datatset:", response.data.results);

        if (response.data.next == null) {
          // setisShowLoadMoreButton(false)
          // setShowLoadMoreAdmin(false)
          if (!isMemberTab) {
            setShowLoadMoreAdmin(false);
          } else {
            setShowLoadMoreMember(false)
          }
          setFilterState({});
        } else {
          // setisShowLoadMoreButton(true)
          setMemberDatasetUrl(response.data.next);

          if (!isMemberTab) {
            setShowLoadMoreAdmin(true);
          } else {
            setShowLoadMoreMember(true)
          }
          // memberUrl = response.data.next
          // setShowLoadMoreMember(true);
        }
        let finalDataList = [];
        if (isLoadMore) {
          finalDataList = [...memberDatasetList, ...response.data.results];
        } else {
          finalDataList = [...response.data.results];
        }
        setMemberDatasetList(finalDataList);
      })
      .catch((e) => {
        console.log(e);
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  }

  function fetchSearchDataWithLoadMoreButtonMyOrg(isLoadMore) {
    setIsLoader(true);
    console.log("payload", searchDatasetVar);

    // if(!isLoadMore){
    resetUrls();

    // payload = buildFilterPayLoad("", getUserLocal(), "", "", "", "")
    payload = {};
    payload["user_id"] = getUserLocal();
    payload["org_id"] = getOrgLocal();
    payload["others"] = false;
    payload["name__icontains"] = searchValMyOrg.val.trim();

    // setFilterState(payload)
    // if(searchDatasetVar){
    //     payload["name__icontains"] = searchDatasetVar
    // }
    // }

    HTTPService(
      "POST",
      // "GET",
      // isMemberTab ? memberDatasetUrl : datasetUrl,
      !isLoadMore ? searchUrl : datasetUrl ? datasetUrl : searchUrl,
      payload,
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("response:", response);
        console.log("datatset:", response.data.results);

        if (response.data.next == null) {
          // setisShowLoadMoreButton(false)
          // setShowLoadMoreAdmin(false)
          // setShowLoadMoreMember(false);
          if (!isMemberTab) {
            setShowLoadMoreAdmin(false);
          } else {
            setShowLoadMoreMember(false)
          }
          setFilterState({});
        } else {
          // setisShowLoadMoreButton(true)
          setDatasetUrl(response.data.next);
          // memberUrl = response.data.next
          // setShowLoadMoreMember(true);
          if (!isMemberTab) {
            setShowLoadMoreAdmin(true);
          } else {
            setShowLoadMoreMember(true)
          }
        }
        let finalDataList = [];
        if (isLoadMore) {
          finalDataList = [...datasetList, ...response.data.results];
        } else {
          finalDataList = [...response.data.results];
        }
        setDatasetList(finalDataList);
      })
      .catch((e) => {
        console.log(e);
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  }

  async function getSearchedData(val, isLoadMore, isMemberTab) {
    // console.log(val, "Here is value")

    if (val.length < 3 && val !== "") val = "";
    // console.log(val)
    let data = {};
    setFilterState({});
    data["user_id"] = getUserLocal();
    data["org_id"] = getOrgLocal();
    data["name__icontains"] = val;
    if (isMemberTab) {
      data["others"] = true;
    } else {
      data["others"] = false;
    }

    HTTPService(
      "POST",
      // "GET",
      // isMemberTab ? memberDatasetUrl : datasetUrl,
      // UrlConstant.base_url + "participant/datasets/search_datasets/",
      !isLoadMore ? searchUrl : datasetUrl,
      data,
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("response:", response);
        console.log("datatset:", response.data.results);

        if (response.data.next == null) {
          setisShowLoadMoreButton(false)
          // setShowLoadMoreAdmin(false)
          console.log(showLoadMoreMember)
          if (!isMemberTab) {
            setShowLoadMoreAdmin(false);
          } else {
            setShowLoadMoreMember(false)
          }
          setFilterState({});
        } else {
          // setisShowLoadMoreButton(true)
          // setDatasetUrl(response.data.next);
          if (isMemberTab) {
            setMemberDatasetUrl(response.data.next)
          } else {
            setDatasetUrl(response.data.next);
          }
          // memberUrl = response.data.next
          if (!isMemberTab) {
            setShowLoadMoreAdmin(true);
          } else {
            setShowLoadMoreMember(true)
          }
        }
        let finalDataList = [];
        if (isLoadMore) {
          if (isMemberTab) {
            finalDataList = [...memberDatasetList, ...response.data.results];
          } else {
            finalDataList = [...datasetList, ...response.data.results];
          }
        } else {
          finalDataList = [...response.data.results];
          console.log(finalDataList);
        }
        if (isMemberTab) {
          setMemberDatasetList(finalDataList);
        } else {
          setDatasetList(finalDataList);
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
    // getMyDataset(false)
    // payload = buildFilterPayLoad("", getUserLocal(), "", "", "", "")
    if (isMemberTab) {
      getMemberDatasets(false);
    } else {
      getMyDataset(false);
    }

    // getDatasetList(false)
  }, [isMemberTab]);

  const getFilters = () => {
    setIsLoader(true);
    var payloadData = {};
    payloadData["user_id"] = getUserLocal();
    // data['user_id'] = "aaa35022-19a0-454f-9945-a44dca9d061d"
    payloadData["org_id"] = getOrgLocal();
    if (isMemberTab) {
      payloadData["others"] = true;
    } else {
      payloadData["others"] = false;
    }
    HTTPService(
      "POST",
      UrlConstant.base_url + UrlConstant.dataset_filter_participant,
      payloadData,
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("filter response:", response);

        var geoFilterInput = response.data.geography;

        // var cropFilterInput = response.data.crop_detail;

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

        // console.log("tempGepList",geoFilter)
        // setGeoFilterMaster(initFilter(geoFilterInput))
        setGeoFilterDisplay(initFilter(geoFilterInput));

        // setCropFilterMaster(initFilter(cropFilterInput))
        // setCropFilterDisplay(initFilter(cropFilterInput));
        resetFilterState(screenlabels.dataset.age);
        resetFilterState(screenlabels.dataset.status);
        resetFilterState(screenlabels.dataset.enabled);
        setConstantyUpdateSwitch(false);

        // console.log("geoFilterMaster", geoFilterMaster)
        console.log("geoFilterDisplay", geoFilterDisplay);
        // console.log("cropFilterMaster",cropFilterMaster)
        // console.log("cropFilterDisplay", cropFilterDisplay);
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  const initFilter = (filterInput) => {
    let filter = [];
    for (var i = 0; i < filterInput.length; i++) {
      var data = {};
      data["index"] = i;
      data["name"] = filterInput[i];
      data["isChecked"] = false;
      data["isDisplayed"] = true;
      filter.push(data);
    }
    return filter;
  };

  const getDatasetList = (isLoadMore) => {
    if (!isLoadMore) {
      resetUrls();
    }
    setIsLoader(true);
    if (payload == "") {
      payload = buildFilterPayLoad("", getUserLocal(), "", "", "", "");
    }
    HTTPService(
      "POST",
      // "GET",
      // isMemberTab ? memberDatasetUrl : datasetUrl,
      !isLoadMore
        ? value == "2"
          ? memberUrl
          : adminUrl
        : value == "2"
          ? memberDatasetUrl
          : datasetUrl,
      payload,
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("response:", response);
        console.log("datatset:", response.data.results);

        if (response.data.next == null) {
          setisShowLoadMoreButton(false);
          setShowLoadMoreAdmin(false);
          setShowLoadMoreMember(false);
        } else {
          setisShowLoadMoreButton(true);
          if (value == "1") {
            setDatasetUrl(response.data.next);
            // adminUrl = response.data.next
            setShowLoadMoreAdmin(true);
            setShowLoadMoreMember(false);
          } else {
            setMemberDatasetUrl(response.data.next);
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

  const getMyDataset = (isLoadMore) => {
    setIsLoader(true);
    if (searchValMyOrg.val && isLoadMore) {
      fetchSearchDataWithLoadMoreButtonMyOrg(isLoadMore);
      return;
    }
    if (!isLoadMore) {
      resetUrls();
      if (payload == "") {
        payload = {};
        payload["user_id"] = getUserLocal();
        payload["org_id"] = getOrgLocal();
        payload["others"] = false;
        setFilterState(payload);
      }
    } else {
      payload = { ...filterState };
    }
    // setIsLoader(true);
    // if (payload == "") {
    //     // payload = buildFilterPayLoad("", getUserLocal(), "", "", "", "")
    //     // payload['others'] = false
    //     payload = {}
    //     payload['user_id'] = getUserLocal()
    //     payload['org_id'] = getOrgLocal()
    //     payload['others'] = false
    //     setFilterState(payload)
    // }
    // if(isLoadMore){
    //     payload = {...filterState}
    // }
    HTTPService(
      "POST",
      // "GET",
      // isMemberTab ? memberDatasetUrl : datasetUrl,
      !isLoadMore ? adminUrl : datasetUrl,
      payload,
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("response:", response);
        console.log("datatset:", response.data.results);

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
      .catch((e) => {
        console.log(e);
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  const getMemberDatasets = (isLoadMore) => {
    setIsLoader(true);
    if (searchValOtherOrg.val && isLoadMore) {
      fetchSearchDataWithLoadMoreButtonMember(isLoadMore);
      return;
    }
    if (!isLoadMore) {
      resetUrls();
      if (payload == "") {
        payload = {};
        payload["user_id"] = getUserLocal();
        payload["org_id"] = getOrgLocal();
        payload["others"] = true;
        setFilterState(payload);
      }
    } else {
      payload = { ...filterState };
    }

    // if (payload == "") {
    //     // payload = buildFilterPayLoad("", getUserLocal(), "", "", "", "")
    //     // payload['others'] = true
    //     payload = {}
    //     payload['user_id'] = getUserLocal()
    //     payload['org_id'] = getOrgLocal()
    //     payload['others'] = true
    //     setFilterState(payload)
    // }
    // if(isLoadMore){
    //     payload = {...filterState}
    // }
    HTTPService(
      "POST",
      // "GET",
      // isMemberTab ? memberDatasetUrl : datasetUrl,
      !isLoadMore ? memberUrl : memberDatasetUrl,
      payload,
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("response:", response);
        console.log("datatset:", response.data.results);

        if (response.data.next == null) {
          // setisShowLoadMoreButton(false)
          // setShowLoadMoreAdmin(false)
          setShowLoadMoreMember(false);
          setFilterState({});
        } else {
          // setisShowLoadMoreButton(true)
          setMemberDatasetUrl(response.data.next);
          // memberUrl = response.data.next
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
    setFilterState({});
    if (createdAtRange !== "") {
      data["created_at__range"] = createdAtRange;
    }
    data["user_id"] = userId;
    data["org_id"] = getOrgLocal();
    // data['user_id'] = "aaa35022-19a0-454f-9945-a44dca9d061d"
    if (isMemberTab) {
      data["others"] = true;
    } else {
      data["others"] = false;
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
    // if (isEnabledFilter || isDisabledFilter) {
    //     data['is_enabled'] = isEnabledFilter
    // }

    setFilterState(data);
    return data;
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

  const handleTabChange = (event, newValue) => {
    resetDateFilters();
    setValue(newValue);
    setSearchDatasetVar({ val: "" });

    if (newValue === "2") {
      console.log("isMemberTab", isMemberTab);
      setFilterState({});
      setIsShowAll(true);
      setConstantyUpdateSwitch(false);
      setSearchValMyOrg({ val: "" });
      setIsMemberTab(!isMemberTab);
      getMemberDatasets(false);
      console.log("isMemberTab", isMemberTab);
    } else {
      setSearchValOtherOrg({ val: "" });
      setFilterState({});
      setIsShowAll(true);
      setConstantyUpdateSwitch(false);
      setIsMemberTab(!isMemberTab);
      getMyDataset(false);
    }
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
    setIsShowAll(true);
    resetDateFilters();
    setConstantyUpdateSwitch(false);
    resetCatAndSubcatFilters();
    resetFilterState("datavisiblity");
    resetFilterState(screenlabels.dataset.geography);
    resetFilterState(screenlabels.dataset.age);
    // resetFilterState(screenlabels.dataset.crop);
    resetFilterState(screenlabels.dataset.status);
    resetFilterState(screenlabels.dataset.enabled);
    // resetEnabledStatusFilter()

    payload = buildFilterPayLoad("", getUserLocal(), "", "", "", "");
    if (isMemberTab) {
      getMemberDatasets(false);
    } else {
      getMyDataset(false);
    }
    // getDatasetList(false)
  };

  const getAllDataSets = () => {
    resetFilterState("datavisiblity");
    resetFilterState(screenlabels.dataset.geography);
    resetFilterState(screenlabels.dataset.age);
    // resetFilterState(screenlabels.dataset.crop);
    resetFilterState(screenlabels.dataset.status);
    resetFilterState(screenlabels.dataset.enabled);
    // resetUrls()

    setConstantyUpdateSwitch(false);
    setIsShowAll(true);
    setsecondrow(false);
    settodate(null);
    setfromdate(null);

    payload = buildFilterPayLoad("", getUserLocal(), "", "", "", "");

    if (isMemberTab) {
      getMemberDatasets(false);
    } else {
      getMyDataset(false);
    }
    // getDatasetList(false)
  };

  const filterByDates = () => {
    let fromDateandToDate = [];
    fromDateandToDate.push(new Date(fromdate.getTime() - (fromdate.getTimezoneOffset() * 60000)).toJSON());
    // Adding 86400000 will add 1 more day in date (86400000 == 24hrs)
    fromDateandToDate.push(new Date(todate.getTime() - (todate.getTimezoneOffset() * 60000) + 86400000).toJSON());
    console.log('payload in date fillter api',fromDateandToDate, fromdate, todate)


    setIsShowAll(false);
    setConstantyUpdateSwitch(false);
    resetFilterState("datavisiblity");
    resetFilterState(screenlabels.dataset.geography);
    resetFilterState(screenlabels.dataset.age);
    // resetFilterState(screenlabels.dataset.crop);
    resetFilterState(screenlabels.dataset.status);
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
    if (isMemberTab) {
      getMemberDatasets(false);
    } else {
      getMyDataset(false);
    }
    // getDatasetList(false)
  };
  const changeView = (keyname) => {
    let tempfilterObject = { ...screenView };
    Object.keys(tempfilterObject).forEach(function (key) {
      if (key !== keyname) {
        tempfilterObject[key] = false;
      } else {
        tempfilterObject[key] = true;
      }
    });
    setscreenView(tempfilterObject);
  };
  const viewCardDetails = (id, flag) => {
    if (id) {
      setid(id);
    }
    // setIsLoader(true);
    // setisAdminView(flag);
    history.push("/participant/dataset/view/" + id, { flag });
    // HTTPService(
    //   "GET",
    //   UrlConstant.base_url + UrlConstant.datasetparticipant + id + "/",
    //   "",
    //   false,
    //   true
    // )
    //   .then((response) => {
    //     setIsLoader(false);
    //     console.log("filter response:", response);
    //     let tempObject = { ...response.data };
    //     setviewdata(tempObject);
    //     if (response.data.content) {
    //       var tabelHeading = Object.keys(response.data.content[0]);
    //       var temptabelKeys = [...tabelHeading];
    //       settablekeys(temptabelKeys);
    //     }
    //     changeView("isDataSetView");
    //   })
    //   .catch((e) => {
    //     console.error(e);
    //     setIsLoader(false);
    //     history.push(GetErrorHandlingRoute(e));
    //   });
  };
  const deletedataset = () => {
    setIsLoader(true);
    HTTPService(
      "DELETE",
      UrlConstant.base_url + UrlConstant.datasetparticipant + id + "/",
      "",
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("filter response:", response);
        changeView("isDeleSuccess");
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };
  const downloadAttachment = (uri) => {
    FileSaver.saveAs(UrlConstants.base_url_without_slash + uri);
  };
  const changeStatus = (status, isenbaledisabledataset, sectioid) => {
    setIsLoader(true);
    var bodyFormData = new FormData();
    // bodyFormData.append("user_map", getUserMapId());
    if (isenbaledisabledataset) {
      bodyFormData.append("is_enabled", status);
    } else {
      bodyFormData.append("approval_status", status);
    }
    HTTPService(
      "PUT",
      UrlConstant.base_url + UrlConstant.dataset + id + "/",
      bodyFormData,
      true,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("filter response:", response);
        changeView(sectioid);
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };
  const requestChangeDataset = (status, isenbaledisabledataset, sectioid) => {
    setIsLoader(true);
    var bodyFormData = new FormData();
    bodyFormData.append("user_map", getUserMapId());
    bodyFormData.append("remarks", requestchange);
    HTTPService(
      "POST",
      UrlConstant.base_url + UrlConstant.dataset + id + "/",
      bodyFormData,
      true,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("filter response:", response);
        changeView("isChangeRequestSuccess");
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };
  return (
    <>
      {isLoader ? <Loader /> : ""}
      {screenView.isChangeRequestSuccess ? (
        <Success
          okevent={() => {
            changeView("isDataSetFilter");
          }}
          route={"datahub/participants"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Change Request Sent Successfully!"}
          imageText={"Disabled"}
          msg={"Change Request Sent."}
        ></Success>
      ) : (
        <></>
      )}
      {screenView.isDataSetView ? (
        <>
          <ViewDataSet
            isAdminView={true}
            downloadAttachment={(uri) => downloadAttachment(uri)}
            back={() => changeView("isDataSetFilter")}
            rowdata={viewdata}
            tabelkeys={tablekeys}
          ></ViewDataSet>
          <>
            {viewdata.approval_status !== "rejected" &&
              viewdata.user_id == getUserLocal() ? (
              <>
                <Row>
                  <Col xs={12} sm={12} md={6} lg={3}></Col>
                  <Col xs={12} sm={12} md={6} lg={6}>
                    <Button
                      onClick={() =>
                        history.push("/participant/datasets/edit/" + id)
                      }
                      variant="outlined"
                      className="editbtn"
                    >
                      Edit Dataset
                    </Button>
                  </Col>
                </Row>
                <Row className="marginrowtop8px">
                  <Col xs={12} sm={12} md={6} lg={3}></Col>
                  <Col xs={12} sm={12} md={6} lg={6}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        changeView("isDelete");
                      }}
                      className="cancelbtn"
                    >
                      Delete Dataset
                    </Button>
                  </Col>
                </Row>
              </>
            ) : (
              <></>
            )}
          </>
        </>
      ) : (
        <></>
      )}

      {screenView.isDisable ? (
        <Delete
          route={"login"}
          imagename={"disable"}
          firstbtntext={"Disable"}
          secondbtntext={"Cancel"}
          deleteEvent={() => {
            changeStatus(false, true, "isDisableSuccess");
          }}
          cancelEvent={() => {
            changeView("isDataSetView");
          }}
          heading={"Disable dataset"}
          imageText={"Are you sure you want to disable the dataset?"}
          firstmsg={"This action will disable the dataset from the system."}
          secondmsg={
            "The dataset will disappear to your members and connector will disconnect. "
          }
        ></Delete>
      ) : (
        <></>
      )}
      {screenView.isDisableSuccess ? (
        <Success
          okevent={() => {
            changeView("isDataSetFilter");
            isMemberTab ? getMemberDatasets(false) : getMyDataset(false);
          }}
          route={"datahub/participants"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Dataset disabled successfully!"}
          imageText={"Disabled"}
          msg={"You diabled a dataset."}
        ></Success>
      ) : (
        <></>
      )}
      {screenView.isEnable ? (
        <Delete
          route={"login"}
          imagename={"disable"}
          firstbtntext={"Enable"}
          secondbtntext={"Cancel"}
          deleteEvent={() => {
            changeStatus(true, true, "isEnableSuccess");
          }}
          cancelEvent={() => {
            changeView("isDataSetView");
          }}
          heading={"Enable dataset"}
          imageText={"Are you sure you want to enable the dataset?"}
          firstmsg={"This action will enable the dataset from the system."}
          secondmsg={
            "The dataset will appear to your members and connector will connect."
          }
        ></Delete>
      ) : (
        <></>
      )}
      {screenView.isEnableSuccess ? (
        <Success
          okevent={() => {
            changeView("isDataSetFilter");
            isMemberTab ? getMemberDatasets(false) : getMyDataset(false);
          }}
          route={"datahub/participants"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Dataset enabled successfully!"}
          imageText={"Enabled"}
          msg={"You enabled a dataset."}
        ></Success>
      ) : (
        <></>
      )}
      {screenView.isApprove ? (
        <Delete
          route={"login"}
          imagename={"thumbsup"}
          firstbtntext={"Approve Dataset"}
          secondbtntext={"Cancel"}
          deleteEvent={() => {
            changeStatus("approved", false, "isApproveSuccess");
          }}
          cancelEvent={() => {
            changeView("isDataSetView");
          }}
          heading={"Approve Dataset"}
          imageText={"Are you sure you want to approve Dataset?"}
          firstmsg={""}
          secondmsg={""}
        ></Delete>
      ) : (
        <></>
      )}
      {screenView.isApproveSuccess ? (
        <Success
          okevent={() => {
            changeView("isDataSetFilter");
            isMemberTab ? getMemberDatasets(false) : getMyDataset(false);
          }}
          route={"datahub/participants"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Approve Dataset"}
          imageText={"Approved"}
          msg={"You approved a dataset."}
        ></Success>
      ) : (
        <></>
      )}
      {screenView.isDisapprove ? (
        <Delete
          route={"login"}
          imagename={"thumbsdown"}
          firstbtntext={"Disapprove Dataset"}
          secondbtntext={"Cancel"}
          deleteEvent={() => {
            changeStatus("rejected", false, "isDisapproveSuccess");
          }}
          cancelEvent={() => {
            changeView("isDataSetView");
          }}
          heading={"Disapprove Dataset"}
          imageText={"Are you sure you want to disapprove Dataset?"}
          firstmsg={""}
          secondmsg={""}
        ></Delete>
      ) : (
        <></>
      )}
      {screenView.isDisapproveSuccess ? (
        <Success
          okevent={() => {
            changeView("isDataSetFilter");
            isMemberTab ? getMemberDatasets(false) : getMyDataset(false);
          }}
          route={"datahub/participants"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Disapprove Dataset"}
          imageText={"Disapprove"}
          msg={"You disapproved a dataset."}
        ></Success>
      ) : (
        <></>
      )}
      {screenView.isDelete ? (
        <Delete
          route={"login"}
          imagename={"thumbsdown"}
          firstbtntext={"Delete"}
          secondbtntext={"Cancel"}
          deleteEvent={() => {
            deletedataset();
          }}
          cancelEvent={() => {
            changeView("isDataSetFilter");
          }}
          heading={"Delete dataset"}
          imageText={"Are you sure you want to delete your dataset?"}
          firstmsg={"This action will delete the dataset from the system."}
          secondmsg={
            "The dataset will no longer be able to use in your datahub account."
          }
        ></Delete>
      ) : (
        <></>
      )}
      {screenView.isDeleSuccess ? (
        <Success
          okevent={() => {
            changeView("isDataSetFilter");
            isMemberTab ? getMemberDatasets(false) : getMyDataset(false);
            getFilters();
          }}
          route={"datahub/participants"}
          imagename={"success"}
          btntext={"ok"}
          heading={"Your dataset deleted successfully!"}
          imageText={"Deleted!"}
          msg={"You deleted a dataset."}
        ></Success>
      ) : (
        <></>
      )}
      {screenView.isDataSetFilter ? (
        <Row className="supportfirstmaindiv">
          {/* <Row className="secondmainheading width100percent">{screenlabels.support.heading}</Row> */}
          <Row className="supportmaindiv">
            <Row className="supportfilterRow">
              <Col className="supportfilterCOlumn">
                <DataSetFilter
                  setSearchValMyOrg={setSearchValMyOrg}
                  setSearchValOtherOrg={setSearchValOtherOrg}
                  searchValMyOrg={searchValMyOrg}
                  searchValOtherOrg={searchValOtherOrg}
                  searchDatasetVar={searchDatasetVar}
                  setSearchDatasetVar={setSearchDatasetVar}
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
                  dataAccessFilterDisplay={dataAccessFilterDisplay}
                  // Props for category filter
                  categoryFilterOptions={categoryFilterOptions}
                  subcategoryFilterOptions={subcategoryFilterOptions}
                  categoryFilterValue={categoryFilterValue}
                  subcategoryFilterValue={subcategoryFilterValue}
                  handleCategoryFilterChange={handleCategoryFilterChange}
                  filterByCategory={filterByCategory}
                  // End of catagory filter props
                  geoFilterDisplay={geoFilterDisplay}
                  // cropFilterDisplay={cropFilterDisplay}
                  ageFilterDisplay={ageFilterDisplay}
                  handleFilterChange={handleFilterChange}
                  resetFilterState={resetFilterState}
                  geoSearchState={geoSearchState}
                  // cropSearchState={cropSearchState}
                  checkForRegex={checkForRegex}
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
                <Col xs={12} sm={12} md={12} lg={12} className="settingsTabs">
                  <Box>
                    <TabContext value={value} className="tabstyle">
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList
                          onChange={handleTabChange}
                          aria-label="lab API tabs example"
                        >
                          <Tab label="My organisation" value="1" />
                          <Tab label="Other organisations" value="2" />
                        </TabList>
                      </Box>
                      <TabPanel value="1">
                        <DataSetListing
                          datasetList={datasetList}
                          isShowLoadMoreButton={showLoadMoreAdmin}
                          isMemberTab={isMemberTab}
                          getDatasetList={
                            isMemberTab ? getMemberDatasets : getMyDataset
                          }
                          viewCardDetails={(id) => viewCardDetails(id, true)}
                        />
                      </TabPanel>
                      <TabPanel value="2">
                        <DataSetListing
                          datasetList={memberDatasetList}
                          isShowLoadMoreButton={showLoadMoreMember}
                          isMemberTab={isMemberTab}
                          getDatasetList={
                            isMemberTab ? getMemberDatasets : getMyDataset
                          }
                          viewCardDetails={(id) => viewCardDetails(id, false)}
                        />
                        {/* <OrganisationSetting
                                        setisOrgUpdateSuccess={() => {
                                            setistabView(false);
                                            setisOrgUpdateSuccess(true);
                                        }}
                                        /> */}
                      </TabPanel>
                    </TabContext>
                  </Box>
                </Col>
              </Col>
            </Row>
          </Row>
        </Row>
      ) : (
        <></>
      )}
    </>
  );
}
