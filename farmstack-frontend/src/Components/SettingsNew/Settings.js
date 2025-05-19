import React from "react";
import Tab from "@mui/material/Tab";
import { TabContext } from "@mui/lab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Col, Container, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import AccountSetting from "./AccountSettings";
import OrganisationSettings from "./OrganisationSettings";
import PolicySettings from "./PolicySettings";
import CategorySettings from "./CategorySettings";
import DatapointSettings from "./DatapointSettings";
import {
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "../../Utils/Common";
import LocalStyle from "./Settings.module.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Tabs } from "@mui/material";
import ResetPassword from "./ResetPassword";
import styles from "./Settings.module.css";
export default function Settings(props) {
  const history = useHistory();
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
    history.push(newValue);
  };
  const handleAddSettingRoutes = () => {
    if (isLoggedInUserCoSteward() || isLoggedInUserAdmin()) {
      return `/datahub/settings/1`;
    } else if (isLoggedInUserParticipant()) {
      return `/participant/settings/1`;
    }
  };
  return (
    <div>
      <TabContext value={value}>
        <Box
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: "#00A94F !important" },
            "& .MuiTab-root": {
              color: "#637381 !important",
              borderLeft: "none !important",
              borderTop: "none !important",
              borderRight: "none !important",
              display: "flex !important",
              flexDirection: "column !important",
              alignItems: "center !important",
              wordWrap: "normal !important",
              textTransform: "none !important",
              minWidth: "220px !important",
              fontWeight: "400",
              fontSize: "16px !important",
              fontFamily: "Montserrat !important",
              lineHeight: "22px",
            },
            "& .Mui-selected": { color: "#00A94F !important" },
          }}
        >
          <Row style={{ margin: "0 144px" }}>
            <Col>
              <div className="text-left mt-50">
                <span
                  className="add_light_text cursor-pointer breadcrumbItem"
                  onClick={() => history.push(handleAddSettingRoutes())}
                >
                  Settings
                </span>
                <span className="add_light_text ml-16">
                  <ArrowForwardIosIcon
                    sx={{ fontSize: "14px", fill: "#00A94F" }}
                  />
                </span>
                <span className="add_light_text ml-16 fw600">
                  {value == 1
                    ? "Account settings"
                    : value == 2
                    ? "Organisation settings"
                    : value == 3
                    ? "Policy settings"
                    : value == 4
                    ? "Categories settings"
                    : value == 5
                    ? "Datapoint settings"
                    : value == 6
                    ? "Reset Password"
                    : ""}
                </span>
              </div>
            </Col>
          </Row>
          <Container>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="lab API tabs example"
              sx={{
                ".MuiTabs-indicator": {
                  backgroundColor: "#00A94F",
                },
                "& .MuiTabs-flexContainer": {
                  display: "flex",
                },
                "& .MuiTab": {
                  minWidth: "auto",
                  textTransform: "none",
                },
                ".MuiTab-root": {
                  textTransform: "none",
                  minWidth: 100,
                  fontWeight: 300,
                  marginRight: "20px",
                  color: "gray",

                  "&:hover": {
                    color: "#00A94F",
                    opacity: 1,
                  },
                  "&.Mui-selected": {
                    color: "#00A94F",
                    fontWeight: "fontWeightMedium",
                  },
                  "&.Mui-focusVisible": {
                    backgroundColor: "rgba(100, 95, 228, 0.32)",
                  },
                },
              }}
            >
              <Tab
                label="Account settings"
                value="1"
                aria-labelledby="account-settings-1"
                id="account-settings-1"
              />
              <Tab
                label="Organisation settings"
                value="2"
                id="org-settings-2"
              />

              {!isLoggedInUserCoSteward() && !isLoggedInUserParticipant() ? (
                <Tab label="Policy settings" value="3" id="policy-settings-3" />
              ) : (
                ""
              )}
              {!isLoggedInUserCoSteward() && !isLoggedInUserParticipant() ? (
                <Tab
                  label="Categories settings"
                  value="4"
                  id="category-settings-4"
                />
              ) : (
                ""
              )}
              {!isLoggedInUserCoSteward() && !isLoggedInUserParticipant() ? (
                <Tab
                  label="Datapoint settings"
                  value="5"
                  id="datapoint-settings-5"
                />
              ) : (
                ""
              )}
              <Tab label="Reset Password" value="6" id="Reset-Password-6" />
            </Tabs>
          </Container>
          <TabPanel value="1" id="account-settings-1">
            <AccountSetting />
          </TabPanel>
          <TabPanel value="2" id="org-settings-2">
            <OrganisationSettings />
          </TabPanel>
          <TabPanel value="6" id="Reset-Password-6">
            <ResetPassword />
          </TabPanel>
          {!isLoggedInUserCoSteward() && !isLoggedInUserParticipant() ? (
            <>
              <TabPanel value="3" id="policy-settings-3">
                <PolicySettings />
              </TabPanel>
              <TabPanel value="4" id="category-settings-4">
                <CategorySettings />
              </TabPanel>
              <TabPanel value="5" id="datapoint-settings-5">
                <DatapointSettings />
              </TabPanel>
            </>
          ) : (
            ""
          )}
        </Box>
      </TabContext>
    </div>
  );
}
