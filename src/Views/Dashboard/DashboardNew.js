// Creating a dashboard for app

import { Box, FormControl, NativeSelect } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import localeStyle from "./dashboardNew.module.css";
import globalStyle from "../../Assets/CSS/global.module.css";
import CustomGraph from "../../Components/Graph/CustomGraph";
import CustomDashBoardTable from "../../Components/CustomDashboardTable.js/CustomDashBoardTable";
import { FarmStackContext } from "../../Components/Contexts/FarmStackContext";
import UrlConstant from "../../Constants/UrlConstants";
import HTTPService from "../../Services/HTTPService";
import {
  GetErrorHandlingRoute,
  isLoggedInUserParticipant,
} from "../../Utils/Common";
import { useHistory } from "react-router-dom";
import { Chart } from "chart.js";

function DashboardNew() {
  const { callLoader, callToast } = useContext(FarmStackContext);
  const [dashboardData, setDashboardData] = useState("");
  const [fileChart, setFileChart] = useState({});
  const [geographyChart, setGeographyChart] = useState({});
  const [categoryChart, setCategoryChart] = useState({});
  const [org, setOrg] = useState("my_organisation");
  const history = useHistory();

  const getDashboard = () => {
    callLoader(true);
    let url = UrlConstant.base_url + UrlConstant.new_datahub_dashboard;
    let payload = {};
    if (org != "other_organisation") {
      payload = {
        my_org: "True",
      };
    }
    HTTPService("GET", url, payload, false, true)
      .then((response) => {
        callLoader(false);
        setDashboardData(response?.data);
        formatData(response?.data);
      })
      .catch(async (e) => {
        console.log("🚀 ~ file: DashboardNew.js:44 ~ getDashboard ~ e:", e);
        callLoader(false);
        let error = await GetErrorHandlingRoute(e);
        console.log("Error obj", error);
        // console.log(e);
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

  const colorShades = (hexCode, numShades) => {
    // Remove the '#' symbol if present
    const cleanHexCode = hexCode.replace("#", "");

    // Convert the hex code to RGB values
    const red = parseInt(cleanHexCode.substr(0, 2), 16);
    const green = parseInt(cleanHexCode.substr(2, 2), 16);
    const blue = parseInt(cleanHexCode.substr(4, 2), 16);

    const shades = [];

    // Calculate the step value for changing brightness/saturation
    const step = 1 / (numShades + 1);

    // Generate the shades
    for (let i = 1; i <= numShades; i++) {
      // Adjust the brightness or saturation
      const factor = i * step;
      const newRed = Math.round(red * factor);
      const newGreen = Math.round(green * factor);
      const newBlue = Math.round(blue * factor);

      // Convert the RGB values back to hexadecimal
      const newHexCode =
        "#" +
        ((1 << 24) | (newRed << 16) | (newGreen << 8) | newBlue)
          .toString(16)
          .slice(1);

      shades.push(newHexCode);
    }

    return shades;
  };

  console.log("colorShades(#00A94F)", colorShades("#00A94F", 50));

  const formatData = (dashboardData) => {
    let tmpLabels = [];
    let datasets = {
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: [],
    };
    if (!dashboardData) {
      return;
    }
    if (dashboardData.dataset_file_metrics) {
      let uploadTypeObj = {
        file: "File",
        live_api: "API",
        mysql: "MySQL",
        postgresql: "PostgreSQL",
      };
      dashboardData.dataset_file_metrics.forEach((item) => {
        let size = (item?.total_size / (1024 * 1024)).toFixed(2);
        let uploadType = item?.datasets__source;

        tmpLabels.push(
          `${uploadTypeObj[uploadType]}`
          // `
          //  (${
          //   item?.total_size / (1024 * 1024) ? size + "MB" : "Not available"
          // })`
        );
        datasets.data.push(item?.dataset_count);
      });
      datasets.backgroundColor = [
        "#36a2eb",
        "#ff6384",
        "#4bc0c0",
        "#ff9f40",
        "#9966ff",
        "#ffcd56",
        "#c9cbcf",
      ];
      datasets.hoverBackgroundColor = "#af0000";
    }
    setFileChart({
      labels: tmpLabels,
      datasets: [datasets],
    });
    console.log("data after format1", {
      labels: tmpLabels,
      datasets: [datasets],
    });
    tmpLabels = [];
    datasets = {
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: [],
    };
    if (dashboardData.dataset_state_metrics) {
      dashboardData.dataset_state_metrics.forEach((item) => {
        let tmpStateName = item?.state_name;
        if (tmpStateName && tmpStateName.length > 20) {
          tmpStateName = tmpStateName.substring(0, 20) + "...";
        }
        tmpLabels.push(tmpStateName ?? "Others");
        item?.dataset_count
          ? datasets.data.push(item.dataset_count)
          : datasets.data.push(0);
      });
      datasets.backgroundColor = Chart.defaults.color.primary;
      datasets.backgroundColor = [
        "#36a2eb",
        "#ff6384",
        "#4bc0c0",
        "#ff9f40",
        "#9966ff",
        "#ffcd56",
        "#c9cbcf",
      ];
      datasets.hoverBackgroundColor = "#af0000";
    }
    setGeographyChart({
      labels: tmpLabels,
      datasets: [datasets],
    });
    tmpLabels = [];
    datasets = {
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: [],
    };
    if (dashboardData?.dataset_category_metrics) {
      let allCategories = Object.keys(dashboardData?.dataset_category_metrics);
      let tmpAllCategories = [];
      allCategories.forEach((item, index) => {
        if (item.length > 20) {
          tmpAllCategories.push(item.substring(0, 20) + "...");
        } else {
          tmpAllCategories.push(item);
        }
      });
      if (Object.keys(dashboardData?.dataset_category_metrics).length) {
        tmpLabels = tmpAllCategories;
        datasets = {
          data: Object.values(dashboardData?.dataset_category_metrics),
          // backgroundColor: "#d14f4f",
          backgroundColor: [
            "#36a2eb",
            "#ff6384",
            "#4bc0c0",
            "#ff9f40",
            "#9966ff",
            "#ffcd56",
            "#c9cbcf",
          ],
          hoverBackgroundColor: "#af0000",
        };
      }
    }
    setCategoryChart({
      labels: tmpLabels,
      datasets: [datasets],
    });
  };

  useEffect(() => {
    setDashboardData({});
    setCategoryChart({});
    setFileChart({});
    setGeographyChart({});
    getDashboard();
  }, [org]);

  let logoUrl = UrlConstant.base_url + "/" + dashboardData?.user?.logo;

  return (
    <Box className={`${localeStyle.dashboardContainer}`}>
      <Box className={`${localeStyle.basicDetailsContainer}`}>
        <div className={`${localeStyle.titleContainer}`}>
          <div
            className={`${localeStyle.title} ${globalStyle.size32}  ${globalStyle.bold700} ${globalStyle.break_word}`}
          >
            {" "}
            Hello {dashboardData?.user?.first_name}{" "}
          </div>
          <div
            className={`${localeStyle.subTitle} ${globalStyle.size20} ${globalStyle.bold500} ${localeStyle.secondaryColor}`}
          >
            Track and optimize network activities effortlessly. Gain valuable
            insights for efficient operations.
          </div>
        </div>
        <div className={`${localeStyle.userBasicDataContainer}`}>
          <div className={`${localeStyle.userBasicDataImg}`}>
            {dashboardData?.user ? (
              <img style={{ width: "auto", maxWidth: "180px" }} src={logoUrl} />
            ) : (
              ""
            )}
            <div>
              <div
                className={`${globalStyle.size26} ${globalStyle.bold600} ${localeStyle.ellipsis}`}
              >
                {dashboardData?.user?.name ?? "Not available"}
              </div>
              <div
                className={`${globalStyle.size16} ${globalStyle.bold600} ${localeStyle.secondaryColor} ${localeStyle.ellipsis}`}
              >
                {dashboardData?.user?.first_name
                  ? dashboardData?.user?.first_name +
                    " " +
                    dashboardData?.user?.last_name
                  : "Not available"}
              </div>
            </div>
          </div>
          <div
            className={
              isLoggedInUserParticipant()
                ? `${localeStyle.userBasicData} ${localeStyle.userBasicDataForParticipant}`
                : localeStyle.userBasicData
            }
          >
            {!isLoggedInUserParticipant() ? (
              <>
                <div>
                  <span>Participants</span>
                  <span>
                    {dashboardData?.total_participants?.participants_count ?? 0}
                  </span>
                </div>
              </>
            ) : (
              <></>
            )}
            <div>
              <span>Datasets</span>
              <span>{dashboardData?.total_dataset_count ?? 0}</span>
            </div>
            <div>
              <span>Connectors</span>
              <span>{dashboardData?.total_connectors_count ?? 0}</span>
            </div>
          </div>
        </div>
      </Box>
      <Box className={`${localeStyle.myAndOtherOrgDataset}`}>
        <span
          className={`${globalStyle.size24} ${globalStyle.bold700} ${localeStyle.secondaryColor}`}
        >
          Datasets
        </span>
        {!isLoggedInUserParticipant() ? (
          <FormControl sx={{ width: "150px" }}>
            <NativeSelect
              sx={{ fontWeight: "500", fontFamily: "Montserrat !important" }}
              defaultValue={"my_organisation"}
              onChange={(e) => setOrg(e.target.value)}
              value={org}
              data-testid="option-for-my-and-other-org-test"
            >
              <option value={"my_organisation"}>My organisation</option>
              <option value={"other_organisation"}>Other organisation</option>
            </NativeSelect>
          </FormControl>
        ) : (
          ""
        )}
      </Box>
      <div className={localeStyle.subTitle}>
        <p>Discover and Explore Insights</p>
      </div>
      <Box className={`${localeStyle.graphContainer}`}>
        <CustomGraph
          data={categoryChart}
          title="Datasets by Categories"
          chartType="doughnut"
          subTitle="Unleash insights of dataset distribution by category."
        />
        <CustomGraph
          data={fileChart}
          title="Dataset by Sources"
          chartType="bar"
          subTitle="Unleash insights categorized datasets based on upload methods."
        />
        <CustomGraph
          data={geographyChart}
          title="Dataset by Geography"
          chartType="pie"
          subTitle="Unlock insights on geographically categorized datasets."
        />
        <CustomDashBoardTable
          recentDatasetTable={true}
          title="Recent Datasets"
          data={dashboardData.recent_datasets}
          subTitle="Connector Insights and Recent Connector"
        />
      </Box>
      <Box>
        <span
          className={`${globalStyle.size24} ${globalStyle.bold700} ${localeStyle.secondaryColor}`}
        >
          Connectors
          <div className={localeStyle.subTitle}>
            <p>Connector Insights and Recent Connector</p>
          </div>
        </span>
        <div className={`${localeStyle.connectorsDataContainer}`}>
          <div
            className={`${localeStyle.connectorsData} ${localeStyle.userBasicData}`}
          >
            <div>
              <span>Total No. Of connectors</span>
              <span>{dashboardData?.total_connectors_count}</span>
            </div>
            <div>
              <span>My Datasets Integrated</span>
              <span>{dashboardData?.my_dataset_used_in_connectors}</span>
            </div>
            <div>
              <span>Others datasets Integrated</span>
              <span>{dashboardData?.other_datasets_used_in_my_connectors}</span>
            </div>
          </div>
          <div>
            <CustomDashBoardTable
              recentConnectorsTable={true}
              title="Recent Connectors"
              data={dashboardData?.recent_connectors}
              subTitle="Discover the Latest Connectors"
            />
          </div>
        </div>
      </Box>
    </Box>
  );
}

export default DashboardNew;
