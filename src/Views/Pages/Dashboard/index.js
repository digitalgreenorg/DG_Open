import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Line,
  PieChart,
  Pie,
  Sector,
  Text,
  Layer,
} from "recharts";
import {
  Typography,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Select,
  Chip,
  Box,
  useTheme,
} from "@mui/material";
import Lottie from "lottie-web";
import animationData from "./stateless/gearIcon.json";
import { Transition } from "react-transition-group";
import style from "./index.module.css";
import globalStyle from "../../../Assets/CSS/global.module.css";
import FarmerDemographics from "./stateless/FarmerDemography";
import WaterSource from "./stateless/WaterSource";
import InsuranceInformations from "./stateless/InsuranceInformation";
import MyMap from "./stateless/GoogleMap";
import HTTPService from "../../../Services/HTTPService";
import UrlConstant from "../../../Constants/UrlConstants";
import FarmStackProvider, {
  FarmStackContext,
} from "../../../Components/Contexts/FarmStackContext";
import { useHistory, useParams } from "react-router-dom";
import { GetErrorHandlingRoute } from "../../../Utils/Common";
import { Col, Row } from "react-bootstrap";
import EmptyFile from "../../../Components/Datasets_New/TabComponents/EmptyFile";
import DynamicFilter from "./stateless/DynamicFilters";
import NoDataAvailable from "./stateless/NoData";
// import { Select } from "@material-ui/core";
import useMediaQuery from "@mui/material/useMediaQuery";

const Dashboard = (props) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  console.log("🚀 ~ file: index.js:61 ~ mobile:", mobile);
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  console.log("🚀 ~ file: index.js:63 ~ tablet:", tablet);
  const miniLaptop = useMediaQuery(theme.breakpoints.down("lg"));
  console.log("🚀 ~ file: index.js:65 ~ miniLaptop:", miniLaptop);
  const laptop = useMediaQuery(theme.breakpoints.down("xl"));
  console.log("🚀 ~ file: index.js:67 ~ laptop:", laptop);
  const desktop = useMediaQuery(theme.breakpoints.down("xl"));
  console.log("🚀 ~ file: index.js:69 ~ desktop:", desktop);
  const largeDesktop = useMediaQuery(theme.breakpoints.up("xxl"));
  console.log("🚀 ~ file: index.js:71 ~ largeDesktop:", largeDesktop);

  const [dashboardData, setDashboardData] = useState({});
  const [county, setCounty] = useState([]);
  const [gender, setGender] = useState("");
  const [valueChain, setValueChain] = useState([]);
  const [allValueChain, setAllValueChain] = useState([]);

  const [allSubCounties, setAllSubCounties] = useState([]);
  const [dashboardType, setDashboardType] = useState();
  const [farmingPractices, setFarmingPractices] = useState([]);
  const [livestockAndPoultryProduction, setLivestockAndPoultryProduction] =
    useState({});
  console.log(
    "🚀 ~ file: index.js:62 ~ livestockAndPoultryProduction:",
    livestockAndPoultryProduction
  );
  const [financialLivelhood, setFinancialLivelhood] = useState({});
  const [populerFertilisers, setPopulerFertilisers] = useState({});
  const [femaleAndMaleFarmerCount, setFemaleAndMaleFarmerCount] = useState([
    {
      category: "Male",
      value: 0,
    },
    {
      category: "Female",
      value: 0,
    },
  ]);
  const [farmerInSubCounty, setFarmerInSubCounty] = useState([]);
  const [farmerBasedOnEducationLevel, setFarmerBasedOnEducationLevel] =
    useState([]);
  const [allCounty, setAllCounty] = useState(["BUSIA"]);
  const [subCounties, setSubCounties] = useState([]);
  const [filterCounty, setFilterCounty] = useState("");
  const [activeIndex, setActiveIndex] = useState({
    "Livestock & Poultry Production": null,
    "Female & Male Farmer": null,
    "Financial Livelihood": null,
  });
  const [selectAll, setSelectAll] = useState({
    county: false,
    sub_counties: false,
    value_chain: false,
  });
  const [primaryValueChain, setPrimaryValueChain] = useState({
    keys: [],
    data: {},
  });
  const [secondValueChain, setSecondValueChain] = useState({
    keys: [],
    data: {},
  });
  const [thirdValueChain, setThirdValueChain] = useState({
    keys: [],
    data: {},
  });
  const [allFilters, setAllFilters] = useState({});

  const { callLoader, callToast, selectedFileDetails } =
    useContext(FarmStackContext);

  const [notAvailableMessage, setNotAvailableMessage] = useState("");
  const history = useHistory();

  const onMouseOver = useCallback((data, index, title) => {
    setActiveIndex({ ...activeIndex, [title]: index });
  }, []);
  const onMouseLeave = useCallback((data, index, title) => {
    setActiveIndex({ ...activeIndex, [title]: null });
  }, []);
  const handleApplyFilter = (filters) => {
    getDashboardForDataset(filters, true);
  };

  const handleClearFilter = () => {
    if (props.datasetName.split(" ")?.[0] == "Busia") {
      setCounty(["BUSIA"]);
    } else {
      setCounty([]);
    }
    setGender("");
    setValueChain([]);
    setSubCounties([]);
    setSelectAll({
      county: false,
      sub_counties: false,
      value_chain: false,
    });
  };
  const livestockData = [
    { category: "Cattle", value: 120 },
    { category: "Sheep", value: 80 },
    { category: "Chickens", value: 250 },
    { category: "Pigs", value: 150 },
  ];

  const financialData = [
    { category: "January", value: 250 },
    { category: "February", value: 300 },
    { category: "March", value: 280 },
    // Add more financial data here
  ];

  const fertilisersData = [
    { category: "DAP", value: 80 },
    { category: "NPK", value: 30 },
    { category: "SSP", value: 50 },
    { category: "CAN", value: 20 },
    { category: "Urea", value: 90 },
    { category: "Others", value: 5 },
    // Add more fertilizers data here
  ];

  // const populerFertilisers = [
  //   {
  //     name: "",
  //     value: 8794,
  //     // pv: 4567,
  //     fill: "#fff",
  //   },

  //   {
  //     name: "Crop production 6794",
  //     value: 6794,
  //     // pv: 4567,
  //     fill: "#00A94F",
  //   },
  // ];

  const chartStyle = {
    margin: "20px 0",
    // padding: "10px 0",
    // border: "1px solid #e2e2e2",
  };

  const barStyle = {
    width: "20px",
  };

  const livestockColors = [
    "#00A94F",
    "#3366FF",
    "#9747FF",
    "#00A94F",
    "#3366FF",
    "#3366FF",
    "#3366FF",
    "#3366FF",

    "#3366FF",

    "#FFFF00",
    // "#FFA500",
    "#FF69B4",
    // "#808080",
    "#DB5126",
  ];
  const financialColors = ["#00A94F", "#3366FF", "#9747FF", "#DB5126"];
  const fertilisersColors = [
    "#0088FE",
    "#00C49F",
    "#00A94F",
    "#3366FF",
    "#9747FF",
    "#DB5126",
    "#D3008D",
  ];

  const RADIAN = Math.PI / 180;

  // const AnimatedRect = motion.rect; // Wrap rect component with motion
  // const AnimatedSector = motion.path; // Wrap path component with motion

  const [animationProps, setAnimationProps] = useState({ outerRadius: 0 });

  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      innerRadius,
      startAngle,
      endAngle,
      midAngle,
      outerRadius,
      fill,
      active,
      category,
    } = props;
    console.log("🚀 ~ file: index.js:147 ~ renderActiveShape ~ props:", props);
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (animationProps.outerRadius + 1) * cos;
    const sy = cy + (animationProps.outerRadius + 1) * sin;

    // const radiusOffset = active ? 10 : 0; // Offset for radius to keep the sector within the UI
    // const sin = Math.sin(-RADIAN * midAngle);
    // const cos = Math.cos(-RADIAN * midAngle);
    // const scaledOuterRadius = animationProps.outerRadius + radiusOffset;
    // const sx = Math.max(
    //   scaledOuterRadius,
    //   Math.min(cx + scaledOuterRadius * cos, 100)
    // );
    // const sy = Math.max(
    //   scaledOuterRadius,
    //   Math.min(cy + scaledOuterRadius * sin, 100)
    // );
    let customClassName =
      category == "Male" ? style.animatedSectorDown : style.animatedSector;
    return (
      <Sector
        className={customClassName}
        cx={sx}
        cy={sy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
          filter: `drop-shadow(0px 0px 5px ${fill})`,
        }}
      />
    );
  };
  const getDashboardForDataset = (filters, loaderToShow) => {
    let id = selectedFileDetails.id;
    // let tmpId = "7d3a52d2-5032-4613-85ca-0a6e25072903";
    // let tmpId = "6cd4c388-a633-4cfa-86e0-22d7e9777447";
    let url =
      UrlConstant.base_url +
      UrlConstant.get_dashboard_for_dataset +
      id +
      "/get_dashboard_chart_data/";
    let authToken = props.guestUser ? false : true;
    if (props.guestUser) {
      url =
        UrlConstant.base_url +
        UrlConstant.get_dashboard_for_dataset_guest_user +
        id +
        "/get_dashboard_chart_data/";
    }
    let payload = {};
    if (filters) {
      // if (county.length) {
      //   payload["county"] = county;
      // }
      // if (!county.length && props.datasetName.split(" ")?.[0] == "Busia") {
      //   payload["county"] = ["BUSIA"];
      // }

      // if (!selectAll.sub_counties && subCounties?.length > 0) {
      //   payload["sub_county"] = subCounties;
      // }
      // if (!selectAll.value_chain && valueChain?.length > 0) {
      //   payload["value_chain"] = valueChain;
      // }

      // if (gender) payload["gender"] = [gender];
      payload = filters;
      // if (valueChain?.length > 0) payload["value_chain"] = valueChain;
    }
    if (loaderToShow) callLoader(true);
    HTTPService("POST", url, payload, false, authToken)
      .then((response) => {
        console.log("🚀 ~ file: index.js:122 ~ .then ~ response:", response);
        if (loaderToShow) callLoader(false);
        if (
          typeof response?.data === "object" &&
          !Array.isArray(response?.data) &&
          response?.data !== null
        ) {
          setDashboardData(response?.data);
          setNotAvailableMessage("");
          let type = response?.data?.type;
          setDashboardType(type);
        } else {
          setNotAvailableMessage(response?.data);
        }
      })
      .catch(async (e) => {
        console.log("🚀 ~ file: DashboardNew.js:44 ~ getDashboard ~ e:", e);
        if (loaderToShow) callLoader(false);
        let error = await GetErrorHandlingRoute(e);
        console.log("Error obj", error);
        console.log(e);
        if (error?.status == 400) {
          setNotAvailableMessage("Dashboard currently inaccessible.");
          return;
        }
        if (error.toast) {
          callToast(
            error?.message || "Something went wrong",
            error?.status === 200 ? "success" : "error",
            true
          );
        }
        console.log("error", error);
        if (error.path) {
          history.push(error.path);
        }
      });
  };

  // const modifyFarmingPracticesData = () => {
  //   // expected data format

  //   // {
  //   //   name: "name",
  //   //   value: 6794,
  //   //   fill: "#00A94F",
  //   // },
  //   let allKey = dashboardData?.farming_practices
  //     ? Object.keys(dashboardData.farming_practices)
  //     : [];
  //   let tmpFarmingData = [
  //     {
  //       name: "",
  //       value: 150557,
  //       fill: "#fff",
  //     },
  //   ];
  //   const colors = ["#00A94F", "#3366FF", "#9747FF", "#DB5126"];
  //   let index = 0;
  //   for (let i in allKey) {
  //     let key = allKey[i];
  //     let obj = {};
  //     try {
  //       obj["name"] = key;
  //       obj["value"] = dashboardData?.farming_practices?.[key] || 0;
  //       obj["fill"] = colors[index];
  //       index++;
  //     } catch {
  //       // callToast("error","Something ")
  //     }
  //     tmpFarmingData.push(obj);
  //   }
  //   setFarmingPractices([...tmpFarmingData]);
  // };

  const modifyLiveStockAndPoultry = () => {
    let allKeys = dashboardData?.livestock_and_poultry_production
      ? Object.keys(dashboardData.livestock_and_poultry_production)
      : [];
    console.log(
      "🚀 ~ file: index.js:207 ~ modifyLiveStockAndPoultry ~ allKeys:",
      allKeys
    );
    // expected data format

    // [{ category: "Cattle", value: 120 },]
    if (dashboardData?.livestock_and_poultry_production) {
      var tmpLivestockAndPoultryProduction = [];
      for (let i in allKeys) {
        let obj = {};
        obj["category"] = firstLetterCaps(allKeys[i]);
        obj["value"] =
          (dashboardData?.livestock_and_poultry_production[allKeys[i]]?.MALE ??
            0) +
          (dashboardData?.livestock_and_poultry_production[allKeys[i]]
            ?.FEMALE ?? 0);
        console.log(
          "🚀 ~ file: index.js:216 ~ modifyLiveStockAndPoultry ~ obj:",
          obj
        );
        tmpLivestockAndPoultryProduction.push(obj);
      }
      setLivestockAndPoultryProduction([...tmpLivestockAndPoultryProduction]);
    }
  };
  const modifyFinancialLivelhood = () => {
    let allKeys = dashboardData?.financial_livelihood
      ? Object.keys(dashboardData.financial_livelihood)
      : [];

    // expected data format
    // [{ category: "Cattle", value: 120 },]

    if (dashboardData?.financial_livelihood) {
      var tmpFinancialLivelhood = [];
      for (let i in allKeys) {
        let obj = {};
        obj["category"] = firstLetterCaps(allKeys[i]);
        obj["value"] =
          (dashboardData?.financial_livelihood[allKeys[i]]?.MALE ?? 0) +
          (dashboardData?.financial_livelihood[allKeys[i]]?.FEMALE ?? 0);
        console.log(
          "🚀 ~ file: index.js:216 ~ modifyLiveStockAndPoultry ~ obj:",
          obj
        );
        tmpFinancialLivelhood.push(obj);
      }
      setFinancialLivelhood([...tmpFinancialLivelhood]);
    }
  };
  const modifyPopulerFertilisers = () => {
    let allKeys = dashboardData?.popular_fertilizer_used
      ? Object.keys(dashboardData.popular_fertilizer_used)
      : [];

    // expected data format
    // [{ category: "Cattle", value: 120 },]

    if (dashboardData?.popular_fertilizer_used) {
      let tmpPopularFertilisers = [];
      for (let i in allKeys) {
        let obj = {};
        obj["category"] = firstLetterCaps(allKeys[i]);
        obj["value"] =
          (dashboardData?.popular_fertilizer_used[allKeys[i]]?.MALE ?? 0) +
          (dashboardData?.popular_fertilizer_used[allKeys[i]]?.FEMALE ?? 0);

        tmpPopularFertilisers.push(obj);
      }
      console.log(
        "🚀 ~ file: index.js:417 ~ modifyPopulerFertilisers ~ tmpPopularFertilisers:",
        tmpPopularFertilisers,
        dashboardData?.popular_fertilizer_used
      );
      setPopulerFertilisers([...tmpPopularFertilisers]);
    }
  };

  const setDataForFemaleAndMaleFarmerCount = () => {
    setFemaleAndMaleFarmerCount([
      {
        category: "Female",
        value: dashboardData?.female_count,
      },
      {
        category: "Male",
        value: dashboardData?.male_count,
      },
    ]);
  };

  const setFarmerDataInSubCounty = () => {
    let allKeys = dashboardData?.gender_by_sub_county
      ? Object.keys(dashboardData.gender_by_sub_county)
      : [];
    console.log(
      "🚀 ~ file: index.js:3534 ~ setFarmerDataInSubCounty ~ allKeys:",
      allKeys
    );

    // expected data format
    // [{ category: "Cattle", value: 120 },]

    if (dashboardData?.gender_by_sub_county) {
      let tmpSubCountyRatio = [];
      for (let i in allKeys) {
        let obj = {};
        obj["name"] = firstLetterCaps(allKeys[i]);
        obj["Male"] = dashboardData?.gender_by_sub_county[allKeys[i]]?.MALE;
        obj["Female"] = dashboardData?.gender_by_sub_county[allKeys[i]]?.FEMALE;

        tmpSubCountyRatio.push(obj);
      }
      console.log(
        "🚀 ~ file: index.js:417 ~ modifyPopulerFertilisers ~ tmpPopularFertilisers:",
        tmpSubCountyRatio
      );
      setFarmerInSubCounty([...tmpSubCountyRatio]);
    }
  };

  const setEducationLevelData = () => {
    let allKeys = dashboardData?.education_level
      ? Object.keys(dashboardData.education_level)
      : [];

    // expected data format
    // [{ name: "Cattle", male: 120, female },]

    if (dashboardData?.education_level) {
      let tmpEducationLevel = [];
      for (let i in allKeys) {
        let obj = {};
        let key =
          allKeys[i]?.length > 15
            ? allKeys[i].slice(0, 13) + "..."
            : allKeys[i];
        obj["name"] = firstLetterCaps(key);
        obj["Male"] = dashboardData?.education_level[allKeys[i]]?.MALE;
        obj["Female"] = dashboardData?.education_level[allKeys[i]]?.FEMALE;

        tmpEducationLevel.push(obj);
      }
      console.log(
        "🚀 ~ file: index.js:417 ~ modifyPopulerFertilisers ~ tmpPopularFertilisers:",
        tmpEducationLevel
      );
      setFarmerBasedOnEducationLevel([...tmpEducationLevel]);
    }
  };

  const modifyValueChainData = (inputData) => {
    // expected data format
    // [{ name: "Cattle", key: 120, key: 23 },]
    const transformedData = [];
    let allKeys = [];

    if (inputData) {
      // Loop through the original data
      for (const subCountyName in inputData) {
        const subCountyData = inputData[subCountyName];
        if (Object.keys(subCountyName) && !allKeys.length) {
          allKeys = Object.keys(inputData?.[subCountyName]);
        }
        // Create an object with the sub-county name

        const transformedObject = { name: subCountyName };
        for (const key in subCountyData) {
          // if (subCountyData[key]) {
          transformedObject[key] = subCountyData[key];
          // }
        }

        transformedData.push(transformedObject);
      }
      return { keys: allKeys, data: transformedData };
    }
  };
  const firstLetterCaps = (text) => {
    return (
      text &&
      `${text}`.charAt(0).toUpperCase() + `${text}`.slice(1, text.length)
    );
  };
  const CustomXAxisTick = ({ x, y, payload }) => {
    if (payload && payload.value) {
      return (
        <Text
          fontSize={"12px"}
          width={"12px"}
          x={x}
          y={y}
          textAnchor="middle"
          verticalAnchor="start"
          angle={mobile ? 20 : 0}
        >
          {payload.value}
        </Text>
      );
    }
    return null;
  };

  function checkObjectOrArray(value) {
    console.log("🚀 ~ file: index.js:608 ~ checkObjectOrArray ~ value:", value);
    if (
      typeof value === "object" &&
      value !== null &&
      Object.keys(value).length > 0
    ) {
      return true;
    }

    if (Array.isArray(value) && value.length > 0) {
      return true;
    }

    return false;
  }
  const handleFillter = (filter, value, all, e) => {
    console.log(
      "🚀 ~ file: index.js:544 ~ handleFillter ~ filter, value:",
      filter,
      value,
      all
    );
    if (all) {
      setSelectAll((selectAll) => ({
        ...selectAll,
        [filter]: !selectAll[filter],
      }));
    }
    if (filter == "county") {
      if (value == "ALL" || value == "all") {
        if (props.datasetName.split(" ")?.[0] == "Busia") {
          setCounty(["BUSIA"]);
        } else {
          setCounty([]);
        }
      } else {
        setCounty(value);
      }
    }
    if (filter == "sub_counties") {
      // if (all) {
      //   setSubCounties([]);
      // } else {
      setSubCounties(value);
      // }
    }
    if (filter == "value_chain") {
      // if (all) {
      //   setValueChain([]);
      // } else {
      setValueChain(value);
      // }
    }
    if (filter == "gender") {
      setGender(value);
    }
  };
  console.log("pringing everthing", selectAll, subCounties);
  console.log("valuechain....", valueChain);
  // const handleSelectAll = (filter, value) => {
  //   console.log(
  //     "🚀 ~ file: index.js:576 ~ handleSelectAll ~ filter, value:",
  //     filter,
  //     value,
  //     subCounties
  //   );
  //   setSelectAll((selectAll) => ({
  //     ...selectAll,
  //     [filter]: !selectAll[filter],
  //   }));
  //   if (filter == "county") {
  //     // setCounty([]);
  //   }
  //   if (filter == "sub_counties") {
  //     setSubCounties([]);
  //   }
  //   if (filter == "value_chain") {
  //     setValueChain([]);
  //   }
  //   handleFillter(filter, value);
  // };

  console.log(
    "counties and all counties filter",
    subCounties,
    allSubCounties,
    selectAll
  );
  const handleChipDelete = (filterType, index, value) => {
    if (filterType == "county") {
    }
    if (filterType == "sub_county") {
      let tmpSubCounty = [...subCounties];
      tmpSubCounty.splice(index, 1);
      setSubCounties(tmpSubCounty);
    }
    if (filterType == "value_chain") {
      let tmpValueChain = [...valueChain];
      tmpValueChain.splice(index, 1);
      setValueChain(tmpValueChain);
    }
    if (filterType == "gender") {
      setGender("");
    }
  };

  function CustomTooltip({ active, label, payload }) {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "#ffffff", // White background
            color: "#333", // Text color
            borderRadius: "4px",

            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px", // 3D box shadow effect
            zIndex: 100, // Set the z-index to 100
            padding: "16px",
            fontSize: "14px",
            animation: "fadeIn 0.3s ease", // CSS animation for fadeIn
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            {label}
          </div>
          {payload?.map((entry, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <div>
                <p
                  style={{ margin: "0", color: entry.fill }}
                >{`${entry.name}: ${entry.value}`}</p>
                {/* <p
                  style={{ margin: "0", textAlign: "left", fontWeight: "bold" }}
                >
                  {entry.value}
                </p> */}
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  }

  useEffect(() => {
    // setDashboardData({});
    if (selectedFileDetails?.id) {
      getDashboardForDataset();
    }
  }, [JSON.stringify(selectedFileDetails)]);

  useEffect(() => {
    // modifyFarmingPracticesData();
    modifyLiveStockAndPoultry();
    modifyFinancialLivelhood();
    modifyPopulerFertilisers();
    setDataForFemaleAndMaleFarmerCount();
    setFarmerDataInSubCounty();
    setEducationLevelData();
    if (dashboardData?.primary_value_chain_by_sub_county) {
      let modifyedPrimaryValueChain = modifyValueChainData(
        dashboardData?.primary_value_chain_by_sub_county
      );
      console.log(
        "🚀 ~ file: index.js:761 ~ useEffect ~ modifyedPrimaryValueChain:",
        modifyedPrimaryValueChain
      );
      setPrimaryValueChain(modifyedPrimaryValueChain);
    }

    // optional data

    if (dashboardData?.second_value_chain_by_sub_county) {
      let modifyedSecondValueChain = modifyValueChainData(
        dashboardData?.second_value_chain_by_sub_county
      );
      setSecondValueChain(modifyedSecondValueChain);
    }

    if (dashboardData?.third_value_chain_by_sub_county) {
      let modifyedThirdValueChain = modifyValueChainData(
        dashboardData?.third_value_chain_by_sub_county
      );
      setThirdValueChain(modifyedThirdValueChain);
    }

    // filter state
    if (dashboardData?.filters?.county)
      setAllCounty(dashboardData?.filters?.county);
    if (dashboardData?.filters?.sub_county) {
      setAllSubCounties(dashboardData?.filters?.sub_county);
    }
    if (dashboardData?.filters?.value_chain) {
      setAllValueChain(dashboardData?.filters?.value_chain);
    }

    if (dashboardData?.filters) {
      setAllFilters(dashboardData.filters);
    }
  }, [dashboardData]);

  useEffect(() => {
    const container = document.getElementById("lottie-container");

    if (container) {
      Lottie.loadAnimation({
        container: container,
        animationData: animationData, // Your animation JSON data
        renderer: "svg", // Use 'svg' for better compatibility with React
        loop: true, // Set to true if you want the animation to loop
        autoplay: true, // Set to true to start the animation when mounted
      });
    }
  }, []);

  return (
    <div style={{ marginTop: "25px" }}>
      {/* checking if any call is going on */}
      {!Object.keys(dashboardData)[0] && !notAvailableMessage && (
        <>
          <div
            style={{ height: "250px", width: "250px", margin: "auto" }}
            id="lottie-container"
          ></div>
          <span>Building Dashboard!</span>
        </>
      )}
      {/* if call is done and no data for dashboard */}
      {!Object.keys(dashboardData)[0] && notAvailableMessage && (
        <EmptyFile text={notAvailableMessage ? notAvailableMessage : ""} />
      )}
      {/* if dashboard data got */}
      {Object.keys(dashboardData)[0] && !notAvailableMessage && (
        <div className={style.root}>
          {!props.guestUser ? (
            <div className={style.filterContainer}>
              <>
                {/* <Col className={style.padding0} sm={12} md={12} lg={12}>
                  <FormControl
                    size="medium"
                    sx={{ minWidth: 190, maxWidth: 200 }}
                    className={style.formControl}
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"

                    // MenuProps={MenuProps}
                  >
                    <InputLabel>Select County</InputLabel>
                    <Select
                      label="Select County"
                      onChange={(e) => {
                        if (
                          !e.target.value[e.target.value?.length - 1] &&
                          selectAll.county
                        ) {
                          handleFillter(
                            "county",
                            props.datasetName.split(" ")?.[0] == "Busia"
                              ? ["BUSIA"]
                              : [],
                            "all"
                          );
                        } else if (
                          e.target.value[e.target.value?.length - 1] == "ALL"
                        ) {
                          handleFillter("county", ["ALL"], "all");
                        } else if (!selectAll.county) {
                          // handleFillter("county", e.target.value);

                          // static county filter
                          handleFillter(
                            "county",
                            props.datasetName.split(" ")?.[0] == "Busia"
                              ? ["BUSIA"]
                              : e.target.value
                          );
                        }
                      }}
                      renderValue={(county) => {
                        if (selectAll.county) return "ALL";
                        else {
                          return county.length ? county.join(", ") : "ALL";
                        }
                      }}
                      multiple
                      value={county}
                    >
                      <MenuItem value={"ALL"}>
                        <Checkbox checked={selectAll.county} />
                        <ListItemText primary={"ALL"} />
                      </MenuItem>
                      {allCounty?.map((name) => {
                        return (
                          <MenuItem key={name} value={name}>
                            <Checkbox
                              checked={
                                selectAll.county || county?.indexOf(name) > -1
                              }
                            />
                            <ListItemText primary={name} />
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>

                  {allSubCounties?.length ? (
                    <FormControl
                      size="medium"
                      sx={{ minWidth: 190, maxWidth: 200 }}
                      className={style.formControl}
                    >
                      <InputLabel>Select Sub-County </InputLabel>
                      <Select
                        label="Select Sub-County "
                        value={subCounties}
                        multiple
                        onChange={(e) => {
                          console.log(
                            "e.target.value[e.target.value?.length - 1]",
                            e.target.value[e.target.value?.length - 1]
                          );
                          if (
                            !e.target.value[e.target.value?.length - 1] &&
                            selectAll.sub_counties
                          ) {
                            handleFillter("sub_counties", [], "all");
                          } else if (
                            e.target.value[e.target.value?.length - 1] == "ALL"
                          ) {
                            handleFillter("sub_counties", ["ALL"], "all");
                          } else if (!selectAll.sub_counties) {
                            handleFillter("sub_counties", e.target.value);
                          }
                        }}
                        renderValue={(subCounties) => {
                          if (selectAll.sub_counties) {
                            return "ALL";
                          } else {
                            return subCounties.length
                              ? subCounties.join(", ")
                              : "Default";
                          }
                        }}
                      >
                        <MenuItem value={"ALL"}>
                          <Checkbox checked={selectAll.sub_counties} />
                          <ListItemText primary={"ALL"} />
                        </MenuItem>
                        {allSubCounties?.map((name, index) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox
                              checked={
                                selectAll.sub_counties ||
                                subCounties?.indexOf(name) > -1
                              }
                            />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}

                      </Select>
                    </FormControl>
                  ) : (
                    ""
                  )}

                  <FormControl
                    size="medium"
                    sx={{ minWidth: 190, maxWidth: 200 }}
                    className={style.formControl}
                  >
                    <InputLabel>Gender</InputLabel>
                    <Select
                      label="Gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <MenuItem value="">ALL</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    
                    </Select>
                  </FormControl>
                  {allValueChain?.length ? (
                    <FormControl
                      size="medium"
                      sx={{ minWidth: 190, maxWidth: 200 }}
                      className={style.formControl}
                    >
                      <InputLabel>Value Chain</InputLabel>
                      <Select
                        label="Value Chain"
                        value={valueChain}
                        multiple
                        renderValue={(valueChain) =>
                          selectAll.value_chain
                            ? "ALL"
                            : valueChain.length
                            ? valueChain.join(", ")
                            : "Default"
                        }
                        onChange={(e) => {
                          if (
                            !e.target.value[e.target.value?.length - 1] &&
                            selectAll.value_chain
                          ) {
                            handleFillter("value_chain", [], "all");
                          }
                          if (
                            e.target.value[e.target.value?.length - 1] == "ALL"
                          ) {
                            handleFillter("value_chain", ["ALL"], "all");
                          } else if (!selectAll.value_chain) {
                            handleFillter("value_chain", e.target.value);
                          }
                        }}
                      >
                        <MenuItem value={"ALL"}>
                          <Checkbox checked={selectAll.value_chain} />
                          <ListItemText primary={"ALL"} />
                        </MenuItem>
                        {allValueChain?.map((name, index) => (
                          <MenuItem key={name} value={name}>
                            <Checkbox
                              checked={
                                selectAll.value_chain ||
                                valueChain?.indexOf(name) > -1
                              }
                            />
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    ""
                  )}
                  <div className={style.buttonContainer}>
                    <Button
                      className={`${style.primary_button} ${globalStyle.primary_button}`}
                      onClick={handleApplyFilter}
                    >
                      Apply Filter
                    </Button>
                    <Button
                      className={`${style.outlined_button} ${globalStyle.outlined_button}`}
                      onClick={handleClearFilter}
                    >
                      Clear Filter
                    </Button>
                  </div>
                </Col> */}
                <DynamicFilter
                  filters={allFilters}
                  handleFilter={handleApplyFilter}
                  getDashboardForDataset={getDashboardForDataset}
                  mobile={mobile}
                  tablet={tablet}
                  miniLaptop={miniLaptop}
                  desktop
                  largeDesktop
                />
              </>
              {/* <Box sx={{ textAlign: "left", margin: "15px 0 15px 100px" }}>
                {!selectAll.county &&
                  county?.map((county, index) =>
                    county ? (
                      <Chip
                        value={county}
                        label={county}
                        onDelete={() => handleChipDelete("county", index)}
                      />
                    ) : (
                      ""
                    )
                  )}
                {!selectAll.sub_counties &&
                  subCounties?.map((subCounty, index) =>
                    subCounty ? (
                      <Chip
                        value={subCounty}
                        label={subCounty}
                        onDelete={() => handleChipDelete("sub_county", index)}
                      />
                    ) : (
                      ""
                    )
                  )}
                {gender ? (
                  <Chip
                    value={gender}
                    label={gender}
                    onDelete={() => handleChipDelete("gender")}
                  />
                ) : (
                  ""
                )}
                {!selectAll.value_chain &&
                  valueChain?.map((valueChain, index) =>
                    valueChain ? (
                      <Chip
                        value={valueChain}
                        label={valueChain}
                        onDelete={() => handleChipDelete("value_chain", index)}
                      />
                    ) : (
                      ""
                    )
                  )}
              </Box> */}
            </div>
          ) : (
            ""
          )}
          <div style={{}}>
            <FarmerDemographics
              records={dashboardData?.total_number_of_records || 0}
              counties={
                dashboardData?.counties || dashboardData?.county?.length || 0
              }
              mobileNumber={dashboardData?.farmer_mobile_numbers || 0}
              subCounties={
                dashboardData?.sub_counties ||
                dashboardData?.sub_county?.length ||
                0
              }
              constituencies={dashboardData?.constituencies || 0}
              // showConstituencies={dashboardType.kiame}
            />
          </div>
          <Row
            className={`${style.mainGraphContainer} ${style.graphAndDataContainer}`}
          >
            <Col
              sm={12}
              xs={12}
              md={12}
              lg={4}
              xl={4}
              className={`${style.graphContainer}`}
            >
              <Typography className={`${style.ghraphTitle}`}>
                Female & Male Farmer
              </Typography>
              <div className={style.graph}>
                {femaleAndMaleFarmerCount[0]?.value &&
                femaleAndMaleFarmerCount[0]?.value ? (
                  <>
                    <PieChart
                      width={mobile ? 200 : tablet ? 600 : 400}
                      height={250}
                    >
                      <Tooltip />
                      <Pie
                        data={femaleAndMaleFarmerCount}
                        cx={mobile ? 110 : tablet ? 200 : 150}
                        cy={mobile ? 100 : tablet ? 110 : 120}
                        labelLine={false}
                        outerRadius={mobile || tablet ? 80 : 100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="category"
                        // paddingAngle={3}
                        activeShape={renderActiveShape}
                        activeIndex={activeIndex?.["Female & Male Farmer"]}
                        onMouseOver={(data, index) =>
                          onMouseOver(data, index, "Female & Male Farmer")
                        }
                        onMouseLeave={(data, index) =>
                          onMouseLeave(data, index, "Female & Male Farmer")
                        }
                      >
                        {femaleAndMaleFarmerCount?.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={livestockColors[index]}
                          />
                        ))}
                      </Pie>
                      <Legend
                        align={mobile ? "center" : "right"}
                        verticalAlign={mobile ? "bottom" : "middle"}
                        layout={mobile ? "radial" : "vertical"}
                        iconType="square"
                        iconSize={10}
                        formatter={(value, entry, index) => {
                          const color = livestockColors[index];
                          return <span style={{ color }}>{value}</span>;
                        }}
                      />
                    </PieChart>
                  </>
                ) : (
                  <EmptyFile
                    mt="0px"
                    text={"Data unavailable for this graph."}
                  />
                )}
              </div>
            </Col>

            {/* All female and male farmer per county */}
            <Col
              sm={12}
              xs={12}
              md={12}
              lg={8}
              xl={8}
              className={`${style.graphContainer} ${style.padding0}`}
            >
              <Typography className={`${style.ghraphTitle}`}>
                Female & Male Farmer Per Sub-County
              </Typography>
              <div className={style.graph}>
                {farmerInSubCounty?.length ? (
                  <>
                    <ResponsiveContainer
                      minWidth={"100%"}
                      width={
                        mobile
                          ? `${farmerInSubCounty.length * 20}%`
                          : `${farmerInSubCounty.length * 6}%`
                      }
                      height={250}
                    >
                      <BarChart
                        width={600}
                        height={300}
                        data={farmerInSubCounty}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid />
                        <XAxis
                          interval={0}
                          // minTickGap={5}
                          tick={<CustomXAxisTick />}
                          allowDataOverflow={true}
                          dataKey="name"
                        />
                        <YAxis />
                        <Tooltip />
                        {/* <Legend /> */}
                        <Bar
                          background={{ fill: "#eee", radius: 5 }}
                          dataKey="Male"
                          stackId="a"
                          fill={livestockColors[1]}
                          barSize={mobile ? 10 : 30}
                        />
                        <Bar
                          radius={[5, 5, 0, 0]}
                          // background={{ fill: "#eee", radius: 50 }}
                          dataKey="Female"
                          stackId="a"
                          fill={livestockColors[0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <EmptyFile
                    mt="0px"
                    text={"Data unavailable for this graph."}
                  />
                )}
              </div>
            </Col>
          </Row>
          {primaryValueChain["data"].length ? (
            <Row>
              {primaryValueChain && primaryValueChain["data"].length ? (
                <Col
                  sm={12}
                  xs={12}
                  md={12}
                  lg={12}
                  xl={12}
                  // style={{ height: "900px !important" }}
                  className={`${style.graphContainer} ${style.padding0}`}
                >
                  <Typography className={`${style.ghraphTitle}`}>
                    Primary Value Chain By Sub County
                  </Typography>
                  <div
                    className={style.graph}
                    // style={{ overflowX: "auto !important" }}
                  >
                    <ResponsiveContainer
                      minWidth={"100%"}
                      width={
                        mobile
                          ? `${primaryValueChain.length * 20}%`
                          : `${primaryValueChain?.data?.length * 6}%`
                      }
                      height={250}
                    >
                      <BarChart
                        width={900}
                        height={250}
                        data={primaryValueChain?.data}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid />
                        <XAxis
                          interval={0}
                          // minTickGap={5}
                          tick={<CustomXAxisTick />}
                          allowDataOverflow={true}
                          dataKey="name"
                        />
                        <YAxis />
                        <Tooltip content={CustomTooltip} />
                        {/* <Legend /> */}
                        {/* <Layer background={{ fill: "#eee" }}> */}
                        {primaryValueChain?.keys?.map((key, index) => {
                          return (
                            <>
                              {index == 0 ? (
                                <Bar
                                  key={key}
                                  dataKey={key}
                                  stackId="stack"
                                  barSize={mobile ? 10 : 30}
                                  // name={key}
                                  background={{ fill: "#eee", radius: 5 }}
                                  fill={
                                    livestockColors[
                                      index % livestockColors.length
                                    ]
                                  }
                                />
                              ) : (
                                <Bar
                                  key={key}
                                  dataKey={key}
                                  stackId="stack"
                                  barSize={30}
                                  // name={key}
                                  // background={{ fill: "#eee", radius: 50 }}
                                  fill={
                                    livestockColors[
                                      index % livestockColors.length
                                    ]
                                  }
                                />
                              )}
                            </>
                          );
                        })}
                        {/* </Layer> */}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Col>
              ) : (
                ""
              )}
              {secondValueChain && secondValueChain?.["data"]?.length ? (
                <Col
                  sm={12}
                  xs={12}
                  md={12}
                  lg={12}
                  xl={12}
                  // style={{ height: "900px !important" }}
                  className={`${style.graphContainer} ${style.padding0}`}
                >
                  <Typography className={`${style.ghraphTitle}`}>
                    Second Value Chain By Sub County
                  </Typography>
                  <div className={style.graph}>
                    <ResponsiveContainer
                      minWidth={"100%"}
                      width={
                        mobile
                          ? `${secondValueChain.length * 20}%`
                          : `${secondValueChain?.data?.length * 6}%`
                      }
                      height={250}
                    >
                      <BarChart
                        width={900}
                        height={250}
                        data={secondValueChain?.data}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid />
                        <XAxis
                          interval={0}
                          // minTickGap={5}
                          tick={<CustomXAxisTick />}
                          allowDataOverflow={true}
                          dataKey="name"
                        />
                        <YAxis />
                        <Tooltip />
                        {/* <Legend /> */}
                        {secondValueChain?.keys?.map((key, index) => {
                          return (
                            <>
                              {index == 0 ? (
                                <Bar
                                  key={key}
                                  dataKey={key}
                                  stackId="stack"
                                  barSize={30}
                                  // name={key}
                                  background={{ fill: "#eee", radius: 5 }}
                                  fill={
                                    livestockColors[
                                      index % livestockColors.length
                                    ]
                                  }
                                />
                              ) : (
                                <Bar
                                  key={key}
                                  dataKey={key}
                                  stackId="stack"
                                  barSize={30}
                                  // name={key}
                                  // background={{ fill: "#eee", radius: 50 }}
                                  fill={
                                    livestockColors[
                                      index % livestockColors.length
                                    ]
                                  }
                                />
                              )}
                            </>
                          );
                        })}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Col>
              ) : (
                ""
              )}
              {thirdValueChain && thirdValueChain?.["data"]?.length ? (
                <Col
                  sm={12}
                  xs={12}
                  md={12}
                  lg={12}
                  xl={12}
                  // style={{ height: "900px !important" }}
                  className={`${style.graphContainer} ${style.padding0}`}
                >
                  <Typography className={`${style.ghraphTitle}`}>
                    Third Value Chain By Sub County
                  </Typography>
                  <div className={style.graph}>
                    <ResponsiveContainer
                      minWidth={"100%"}
                      width={
                        mobile
                          ? `${thirdValueChain.length * 20}%`
                          : `${thirdValueChain?.data?.length * 6}%`
                      }
                      height={250}
                    >
                      <BarChart
                        width={900}
                        height={250}
                        data={thirdValueChain?.data}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid />
                        <XAxis
                          interval={0}
                          // minTickGap={5}
                          tick={<CustomXAxisTick />}
                          allowDataOverflow={true}
                          dataKey="name"
                        />
                        <YAxis />
                        <Tooltip />
                        {/* <Legend /> */}
                        {thirdValueChain?.keys?.map((key, index) => {
                          return (
                            <>
                              {index == 0 ? (
                                <Bar
                                  key={key}
                                  dataKey={key}
                                  stackId="stack"
                                  barSize={30}
                                  // name={key}
                                  background={{ fill: "#eee", radius: 5 }}
                                  fill={
                                    livestockColors[
                                      index % livestockColors.length
                                    ]
                                  }
                                />
                              ) : (
                                <Bar
                                  key={key}
                                  dataKey={key}
                                  stackId="stack"
                                  barSize={30}
                                  // name={key}
                                  // background={{ fill: "#eee", radius: 50 }}
                                  fill={
                                    livestockColors[
                                      index % livestockColors.length
                                    ]
                                  }
                                />
                              )}
                            </>
                          );
                        })}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Col>
              ) : (
                ""
              )}
            </Row>
          ) : (
            ""
          )}
          {dashboardData?.water_sources?.rivers &&
          dashboardData?.water_sources?.irrigation &&
          dashboardData?.water_sources?.water_pan ? (
            <>
              <Row className={`${style.mainGraphContainer}`}>
                {/* Water source and Insurance Information data */}
                <div
                  style={{
                    width: mobile || miniLaptop || tablet ? "100%" : "32%",
                  }}
                >
                  <WaterSource
                    rivers={
                      dashboardData?.water_sources?.rivers
                        ? (dashboardData?.water_sources?.rivers?.MALE ?? 0) +
                          (dashboardData?.water_sources?.rivers?.FEMALE ?? 0)
                        : 0
                    }
                    irrigation={
                      dashboardData?.water_sources?.irrigation
                        ? (dashboardData?.water_sources?.irrigation?.MALE ??
                            0) +
                          (dashboardData?.water_sources?.irrigation?.FEMALE ??
                            0)
                        : 0
                    }
                    waterPan={
                      dashboardData?.water_sources?.water_pan
                        ? (dashboardData?.water_sources?.water_pan?.MALE ?? 0) +
                          (dashboardData?.water_sources?.water_pan?.FEMALE ?? 0)
                        : 0
                    }
                  />
                  <InsuranceInformations
                    insuredCorps={
                      dashboardData?.insurance_information?.insured_crops
                        ? (dashboardData?.insurance_information?.insured_crops
                            ?.MALE ?? 0) +
                          (dashboardData?.insurance_information?.insured_crops
                            ?.FEMALE ?? 0)
                        : 0
                    }
                    insuredMachineries={
                      dashboardData?.insurance_information?.insured_machinery
                        ? (dashboardData?.insurance_information
                            ?.insured_machinery?.MALE ?? 0) +
                          (dashboardData?.insurance_information
                            ?.insured_machinery?.FEMALE ?? 0)
                        : 0
                    }
                  />
                </div>

                <Col
                  sm={12}
                  xs={12}
                  md={12}
                  lg={12}
                  xl={8}
                  className={`${style.graphContainer}`}
                >
                  <Typography className={`${style.ghraphTitle}`}>
                    Education Qualification
                  </Typography>
                  <div className={style.graph}>
                    {farmerBasedOnEducationLevel.length ? (
                      <>
                        <ResponsiveContainer
                          width={
                            mobile
                              ? `${farmerBasedOnEducationLevel.length * 20}%`
                              : "100%"
                          }
                          height={250}
                        >
                          <BarChart
                            width={600}
                            height={300}
                            data={farmerBasedOnEducationLevel}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid />
                            <XAxis
                              interval={0}
                              tick={<CustomXAxisTick />}
                              dataKey="name"
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                              background={{ fill: "#eee", radius: 5 }}
                              dataKey="Male"
                              stackId="a"
                              fill={livestockColors[1]}
                              barSize={mobile ? 10 : 30}
                            />
                            <Bar
                              radius={[5, 5, 0, 0]}
                              // background={{ fill: "#eee", radius: 50 }}
                              dataKey="Female"
                              stackId="a"
                              fill={livestockColors[0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </>
                    ) : (
                      <EmptyFile
                        mt="0px"
                        text={"Data unavailable for this graph."}
                      />
                    )}
                  </div>
                </Col>
              </Row>
              <Row className={`${style.mainGraphContainer}`}>
                {/* <div className={`${style.mainGraphContainer}`}> */}
                <Col
                  sm={12}
                  xs={12}
                  md={12}
                  lg={6}
                  xl={6}
                  className={`${style.graphContainer}`}
                >
                  <Typography className={`${style.ghraphTitle}`}>
                    Livestock & Poultry Production
                  </Typography>
                  <div className={style.graph}>
                    {/* <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  width={600}
                  height={200}
                  data={livestockAndPoultryProduction}
                  style={chartStyle}
                  margin={{ top: 5, right: 5, bottom: 5, left: 20 }}
                >
                  <CartesianGrid />
                  <XAxis axisLine={false} dataKey="category" />
                  <YAxis axisLine={false} />
                  <Tooltip />

                  <Bar
                    dataKey="value"
                    style={barStyle}
                    barSize={10}
                    radius={50}
                    background={{ fill: "#eee", radius: 50 }}
                  >
                    {livestockData.map((entry, index) => {
                      return <Cell fill={livestockColors[index]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer> */}
                    {checkObjectOrArray(livestockAndPoultryProduction) ? (
                      <>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart width={mobile ? 400 : 600} height={300}>
                            <Tooltip />
                            <Pie
                              data={livestockAndPoultryProduction}
                              cx={mobile ? 125 : 250}
                              cy={150}
                              labelLine={false}
                              outerRadius={mobile ? 80 : 130}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="category"
                              paddingAngle={3}
                              activeShape={renderActiveShape}
                              activeIndex={
                                activeIndex?.["Livestock & Poultry Production"]
                              }
                              onMouseOver={(data, index) =>
                                onMouseOver(
                                  data,
                                  index,
                                  "Livestock & Poultry Production"
                                )
                              }
                              onMouseLeave={(data, index) =>
                                onMouseLeave(
                                  data,
                                  index,
                                  "Livestock & Poultry Production"
                                )
                              }
                            >
                              {livestockAndPoultryProduction?.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={livestockColors[index]}
                                  />
                                )
                              )}
                            </Pie>
                            <Legend
                              align={mobile ? "left" : "right"}
                              verticalAlign={mobile ? "bottom" : "middle"}
                              layout={mobile ? "horizontal" : "vertical"}
                              iconType="square"
                              iconSize={10}
                              formatter={(value, entry, index) => {
                                const color = livestockColors[index];
                                return <span style={{ color }}>{value}</span>;
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </>
                    ) : (
                      <EmptyFile
                        mt="0px"
                        text={"Data unavailable for this graph."}
                      />
                    )}
                  </div>
                </Col>

                {/* Financial Livelihood Bar Chart */}
                <Col
                  sm={12}
                  xs={12}
                  md={12}
                  lg={6}
                  xl={6}
                  className={`${style.graphContainer}`}
                >
                  <Typography className={`${style.ghraphTitle}`}>
                    Financial Livelihood
                  </Typography>
                  <div className={style.graph}>
                    {checkObjectOrArray(financialLivelhood) ? (
                      <>
                        <ResponsiveContainer width="100%" height={300}>
                          {/* <BarChart
                  width={600}
                  height={200}
                  style={chartStyle}
                  data={financialLivelhood}
                >
                  <CartesianGrid />
                  <XAxis axisLine={false} dataKey="category" />
                  <YAxis axisLine={false} />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill={(entry, index) => financialColors[index]}
                    barSize={10}
                    radius={50}
                    background={{ fill: "#eee", radius: 50 }}
                  >
                    {financialData.map((entry, index) => {
                      return <Cell fill={financialColors[index]} />;
                    })}
                  </Bar>
                </BarChart> */}
                          <PieChart width={mobile ? 400 : 600} height={300}>
                            <Tooltip />
                            <Pie
                              data={financialLivelhood}
                              cx={mobile ? 140 : 150}
                              cy={mobile ? 100 : 150}
                              labelLine={false}
                              outerRadius={mobile ? 80 : 130}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="category"
                              paddingAngle={3}
                              activeShape={renderActiveShape}
                              activeIndex={
                                activeIndex?.["Financial Livelihood"]
                              }
                              onMouseOver={(data, index) =>
                                onMouseOver(data, index, "Financial Livelihood")
                              }
                              onMouseLeave={(data, index) =>
                                onMouseLeave(
                                  data,
                                  index,
                                  "Financial Livelihood"
                                )
                              }
                            >
                              {financialLivelhood?.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={financialColors[index]}
                                />
                              ))}
                            </Pie>
                            <Legend
                              align={mobile ? "left" : "right"}
                              verticalAlign={mobile ? "bottom" : "middle"}
                              layout={mobile ? "horizontal" : "vertical"}
                              iconType="square"
                              iconSize={10}
                              formatter={(value, entry, index) => {
                                const color = livestockColors[index];
                                return <span style={{ color }}>{value}</span>;
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </>
                    ) : (
                      <EmptyFile
                        mt="0px"
                        text="Data unavailable for this graph."
                      />
                    )}
                  </div>
                </Col>
                {/* Popular Fertilisers Used Bar Chart */}
                <Col
                  sm={12}
                  xs={12}
                  md={12}
                  lg={6}
                  xl={6}
                  className={`${style.graphContainer}`}
                >
                  <Typography className={`${style.ghraphTitle}`}>
                    Popular Fertilisers Used
                  </Typography>
                  <div className={style.graph}>
                    {checkObjectOrArray(populerFertilisers) ? (
                      <>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart width={800} height={400}>
                            <Tooltip />

                            <Pie
                              data={populerFertilisers}
                              cx={mobile ? 150 : 200}
                              cy={mobile ? 110 : 120}
                              innerRadius={50}
                              outerRadius={100}
                              fill="#8884d8"
                              paddingAngle={3}
                              dataKey="value"
                              nameKey="category"
                            >
                              {populerFertilisers?.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={fertilisersColors[index]}
                                />
                              ))}
                            </Pie>
                            <Legend
                              align={mobile ? "left" : "right"}
                              verticalAlign={mobile ? "bottom" : "middle"}
                              layout={mobile ? "horizontal" : "vertical"}
                              style={{ right: "30px" }}
                              iconType="square"
                              iconSize={10}
                              formatter={(value, entry, index) => {
                                const color = livestockColors[index];
                                return <span style={{ color }}>{value}</span>;
                              }}
                            />
                          </PieChart>
                          {/* <BarChart
                  width={600}
                  height={200}
                  data={populerFertilisers}
                  style={chartStyle}
                >
                  <CartesianGrid />
                  <XAxis axisLine={false} dataKey="category" />
                  <YAxis axisLine={false} />
                  <Tooltip />
                  {/* <Legend /> */}
                          {/* <Bar
                    dataKey="value"
                    style={barStyle}
                    barSize={10}
                    radius={50}
                    background={{ fill: "#eee", radius: 50 }}
                  >
                    {populerFertilisers.map((entry, index) => {
                      return <Cell fill={fertilisersColors[index]} />;
                    })}
                  </Bar>
                </BarChart> */}
                        </ResponsiveContainer>
                      </>
                    ) : (
                      <EmptyFile
                        mt="0px"
                        text="Data unavailable for this graph."
                      />
                    )}
                  </div>
                </Col>
                <Col
                  sm={12}
                  xs={12}
                  md={12}
                  lg={6}
                  xl={6}
                  className={`${style.graphContainer}`}
                >
                  <Typography className={`${style.ghraphTitle}`}>
                    Geographic Information
                  </Typography>
                  <MyMap />
                </Col>
              </Row>
            </>
          ) : (
            ""
          )}
          {/* </div> */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
