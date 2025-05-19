import React, { useState, useEffect, useContext, lazy } from "react";
import Home from "../Views/Role/Participant/home/Home";
import { Switch, Route, useHistory } from "react-router-dom";
import {
  flushLocalstorage,
  GetErrorHandlingRoute,
  getRoleLocal,
  getTokenLocal,
  getUserLocal,
  goToTop,
  isLoggedInUserParticipant,
  setRoleLocal,
} from "../Utils/Common";

import NavbarNew from "../Components/Navbar/Navbar_New";
import FooterNew from "../Components/Footer/Footer_New";
import { FarmStackContext } from "../Components/Contexts/FarmStackContext";
import HTTPService from "../Services/HTTPService";
import UrlConstant from "../Constants/UrlConstants";
import Fab from "@mui/material/Fab";
import { Divider, useMediaQuery, useTheme } from "@mui/material";
import AddIcCallRoundedIcon from "@mui/icons-material/AddIcCallRounded";
import Footer from "../Components/Footer/SmallFooter/Footer";
import DashboardUpdated from "../Views/Dashboard_New";

// Lazy loading for faster initial load
const DatasetParticipant = lazy(() =>
  import("../Views/Dataset/DatasetParticipant/DatasetParticipant")
);
const DepartmentSettings = lazy(() =>
  import("../Views/Settings/ParticipantSettings/DepartmentSettings")
);
const EditDepartmentSettings = lazy(() =>
  import("../Views/Settings/ParticipantSettings/EditDepartmentSettings")
);
const ViewDepartment = lazy(() =>
  import("../Views/Settings/ParticipantSettings/ViewDepartment")
);
const ProjectDetailView = lazy(() =>
  import("../Views/Settings/ParticipantSettings/Project/ProjectDetailView")
);
const AddProjectParticipant = lazy(() =>
  import("../Views/Settings/ParticipantSettings/Project/AddProjectParticipant")
);
const EditProjectParticipant = lazy(() =>
  import("../Views/Settings/ParticipantSettings/Project/EditProjectParticipant")
);
const AddDataset = lazy(() =>
  import("../Components/AdminDatasetConnection/AddDataset")
);
const ViewMetaDatasetDetails = lazy(() =>
  import("../Components/AdminDatasetConnection/ViewMetaDatasetDetails")
);
const Connectors = lazy(() =>
  import("../Components/Connectors_New/Connectors")
);
const AddDataSetParticipantNew = lazy(() =>
  import("../Components/Datasets_New/AddDataSet")
);
const DataSets = lazy(() => import("../Components/Datasets_New/DataSets"));
const DataSetsView = lazy(() =>
  import("../Components/Datasets_New/DataSetsView")
);
const AddConnector = lazy(() => import("../Views/Connector_New/AddConnector"));
const EditConnector = lazy(() =>
  import("../Views/Connector_New/EditConnector")
);
const EditDataset = lazy(() =>
  import("../Components/Datasets_New/EditDataset")
);
const FooterVistaar = lazy(() => import("../Components/Footer/Vistaar/Footer"));
const Settings = lazy(() => import("../Components/SettingsNew/Settings"));
const Support = lazy(() => import("../Components/Support_New/Support"));
const AskSupport = lazy(() => import("../Components/Support_New/SupportForm"));
const SupportView = lazy(() => import("../Components/Support_New/SupportView"));
const DashboardNew = lazy(() => import("../Views/Dashboard/DashboardNew"));
const Resources = lazy(() => import("../Views/Resources/Resources"));
const AddResource = lazy(() => import("../Views/Resources/AddResource"));
const EditResource = lazy(() => import("../Views/Resources/EditResource"));
const ViewResource = lazy(() => import("../Views/Resources/ViewResource"));
const ChatSupport = lazy(() =>
  import("../Views/Resources/ChatSupport/ChatSupport")
);
const ViewDashboardAndApiRequesting = lazy(() =>
  import("../Components/Datasets_New/ViewDashboardAndApiRequesting")
);
const Feedbacks = lazy(() => import("../Views/Feedbacks/Feedbacks"));
const Feedback = lazy(() => import("../Views/Feedbacks/Feedback"));
function Participant(props) {
  const [verifyLocalData, setVerifyLocalData] = useState(false);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const history = useHistory();
  const { callToast } = useContext(FarmStackContext);
  const [showButton, setShowButton] = useState(false);

  let roleId = {
    1: "datahub_admin",
    3: "datahub_participant_root",
    6: "datahub_co_steward",
  };

  const verifyUserDataOfLocal = () => {
    let url = UrlConstant.base_url + UrlConstant.verify_local_data_of_user;
    let userId = getUserLocal();
    let returnValue = false;
    if (!userId) {
      flushLocalstorage();
      return;
    }
    let params = { user_id: userId };
    HTTPService("GET", url, params, false, false, false)
      .then(async (response) => {
        console.log("response to verify local data in datahub", response);
        if (!response?.data?.on_boarded) {
          flushLocalstorage();
          history.push("/login");
          return;
        }
        let role = roleId[response?.data?.role_id];
        let localRole = getRoleLocal();
        // if (localRole != role) {
        //   history.push("/login");
        //   return;
        // }
        setRoleLocal(role);
        setVerifyLocalData(true);
        console.log(
          "response to verify local data role in datahubasasas",
          getRoleLocal(),
          isLoggedInUserParticipant()
        );
      })
      .catch(async (e) => {
        console.log("error to verify local data", e);
        let error = await GetErrorHandlingRoute(e);
        console.log("error", error);
        if (error?.toast) {
          callToast(
            error?.message ?? "user login details are corrupted",
            error?.status == 200 ? "success" : "error",
            error?.toast
          );
        } else {
          history.push(error?.path);
        }
      });
  };
  const shouldRenderButton = () => {
    const currentPath = window.location.pathname;
    const excludedPaths = [
      "/participant/support",
      "/participant/support/add",
      "/participant/support/view/",
    ]; // Add the paths where the floating button should be excluded
    return !excludedPaths.some((path) => currentPath.includes(path));
  };

  useEffect(() => {
    verifyUserDataOfLocal();
    goToTop(0);
    setShowButton(true);
  }, []);
  return verifyLocalData ? (
    <>
      {getTokenLocal() && isLoggedInUserParticipant() ? (
        <div className="center_keeping_conatiner">
          {/* <ParticipantNavbar /> */}
          <NavbarNew loginType={"participant"} />
          <div
            className={
              mobile
                ? "minHeight67vhParticipantPage" + " " + "mt-70"
                : window.location.pathname ===
                  "/participant/resources/chat-with-content/"
                ? ""
                : "minHeight67vhParticipantPage" + " " + ""
            }
          >
            {window.location.pathname ===
            "/participant/resources/chat-with-content/" ? null : (
              <br />
            )}
            <Switch>
              <Route
                exact
                path="/participant/datasets"
                component={DatasetParticipant}
              />
              {/* temporary routes added - start */}
              <Route
                exact
                path="/participant/new_datasets"
                component={DataSets}
              />
              <Route
                exact
                path="/participant/new_datasets/view/:id"
                component={DataSetsView}
              />
              <Route
                exact
                path="/participant/new_datasets/edit/:id"
                component={EditDataset}
              />
              <Route
                exact
                path="/participant/new_datasets/add"
                component={AddDataSetParticipantNew}
              />
              {/* end */}
              {/* <Route
                exact
                path="/participant/connectors"
                component={ConnectorParticipant}
              /> */}
              <Route exact path="/participant/home" component={Home} />
              {/* <Route
                exact
                path="/participant/datasets/add"
                component={AddDataSetParticipant}
              /> */}
              <Route
                exact
                path="/participant/datasets/add"
                component={AddDataset}
              />
              {/* <Route
                exact
                path="/participant/datasets/edit/:id"
                component={EditDatasetParticipant}
              /> */}
              <Route
                exact
                path="/participant/connectors/add"
                component={AddConnector}
              />
              <Route
                exact
                path="/participant/connectors/edit/:id"
                component={EditConnector}
              />
              <Route
                exact
                path="/participant/settings/adddepartment"
                component={DepartmentSettings}
              />
              <Route
                exact
                path="/participant/settings/:id"
                component={Settings}
              />
              {/* <Route
                exact
                path="/participant/settings/adddepartment"
                component={DepartmentSettings}
              /> */}
              <Route
                exact
                path="/participant/settings/editdepartment/:id"
                component={EditDepartmentSettings}
              />
              {/* <Route
              exact
              path="/participant/settings/viewdepartment/:id/"
              component={ViewDepartment}
            /> */}
              <Route
                exact
                path="/participant/settings/project/add"
                component={AddProjectParticipant}
              />
              <Route
                exact
                path="/participant/settings/project/edit/:id"
                component={EditProjectParticipant}
              />
              <Route
                exact
                path="/participant/settings/viewdepartment/:id/"
                component={ViewDepartment}
              />
              <Route
                exact
                path="/participant/settings/viewproject/:id"
                component={ProjectDetailView}
              />
              {/* <Route
                exact
                path="/participant/connectors/detail"
                component={DemoDashboardTable}
              /> */}
              <Route
                exact
                path="/participant/dataset/view/:id"
                component={ViewMetaDatasetDetails}
              />
              {/* {/* <Route */}
              <Route
                exact
                path="/participant/new_dashboard"
                component={DashboardNew}
              />
              <Route
                exact
                path="/participant/bot_dashboard"
                component={DashboardUpdated}
              />
              {/* <Route
                exact
                path="/participant/connectors"
              >
                <DatasetIntegration />
              </Route> */}
              <Route exact path="/participant/connectors">
                <Connectors />
              </Route>
              <Route
                exact
                path="/participant/resources"
                component={Resources}
              />
              <Route
                exact
                path="/participant/resources/add"
                component={AddResource}
              />
              <Route
                exact
                path="/participant/resources/edit/:id"
                component={EditResource}
              />
              <Route
                exact
                path="/participant/resources/view/:id"
                component={ViewResource}
              />
              <Route
                exact
                path="/participant/resources/chat-with-content/"
                component={ChatSupport}
              />
              <Route
                exact
                path="/participant/feedbacks"
                component={Feedbacks}
              />
              <Route
                exact
                path="/participant/feedbacks/view/:id"
                component={Feedback}
              />
              <Route exact path="/participant/support">
                <Support />
              </Route>
              <Route exact path="/participant/support/add">
                <AskSupport />
              </Route>
              <Route exact path="/participant/support/view/:id">
                <SupportView />
              </Route>
              <Route exact path="/participant/dashboard-api-request/:datasetid">
                <ViewDashboardAndApiRequesting />
              </Route>
              {/* <Route
              exact
              path="/participant/connectors/list"
              >
              <ConnectorsList/>
              </Route> */}
            </Switch>
          </div>
          {shouldRenderButton() && showButton && (
            <Fab
              style={{
                position: "fixed",
                bottom: "20px",
                right: "30px",
                zIndex: 1000,
              }}
              onClick={() => {
                props.history.push("/participant/support");
              }}
              className={"fabIcon"}
              id="click-support-icon"
            >
              <AddIcCallRoundedIcon />
            </Fab>
          )}
          <Divider
            className={
              window.location.pathname ===
              "/participant/resources/chat-with-content/"
                ? ""
                : "mt-50"
            }
          />
          {/* <FooterNew /> */}
          {/* <Footer /> */}
          <FooterVistaar loginType={"participant"} />
        </div>
      ) : (
        props.history.push("/login")
      )}
    </>
  ) : (
    <></>
  );
}
export default Participant;
