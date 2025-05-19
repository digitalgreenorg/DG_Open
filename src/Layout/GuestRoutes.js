import React, { useState, useContext, useEffect, lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import FooterNew from "../Components/Footer/Footer_New";
import NavbarNew from "../Components/Navbar/Navbar_New";
import {
  checkProjectFor,
  flushLocalstorage,
  getRoleLocal,
  getUserLocal,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
  setRoleLocal,
} from "../Utils/Common";
import { Divider, useMediaQuery, useTheme } from "@mui/material";
import ScrollToTop from "../Components/ScrollTop/ScrollToTop";
import { FarmStackContext } from "../Components/Contexts/FarmStackContext";
import Loader from "../Components/Loader/Loader";
import Footer from "../Components/Footer/SmallFooter/Footer";
import HTTPService from "../Services/HTTPService";
import UrlConstant from "../Constants/UrlConstants";
import DashboardNew from "../Views/Dashboard/DashboardNew";
import DashboardUpdated from "../Views/Dashboard_New";

// Lazy loading for faster initial load
const GuestUserDatatsets = lazy(() =>
  import("../Views/Dataset/GuestUserDataset")
);
const GuestUserLegalNew = lazy(() =>
  import("../Views/GuestUser/GuestUserLegalNew")
);
const GuestUserViewDataset = lazy(() =>
  import("../Components/GuestUser/GuestUserViewDataset")
);
const GuestUserParticipants = lazy(() =>
  import("../Views/GuestUser/GuestUserParticipants")
);
const GuestUserParticipantsDetails = lazy(() =>
  import("../Views/GuestUser/GuestUserParticipantsDetails")
);
const GuestUserContactNew = lazy(() =>
  import("../Views/GuestUser/GuestUserContactNew")
);
const GuestUserCoStewardNew = lazy(() =>
  import("../Views/GuestUser/GuestUserCoStewardNew")
);
const GuestUserCostewardDetailsNew = lazy(() =>
  import("../Views/GuestUser/GuestUserCostewardDetailsNew")
);
const RegisterParticipants = lazy(() =>
  import("../Components/GuestUser/RegisterParticipants")
);
const GetStarted = lazy(() => import("../Views/GetStarted/GetStarted"));
const GuestUserResources = lazy(() =>
  import("../Views/Resources/Guest/GuestUserResources")
);
const GuestUserViewResource = lazy(() =>
  import("../Views/Resources/Guest/GuestUserViewResource")
);
const GuestUserConnectors = lazy(() =>
  import("../Components/Connectors_New/GuestUserConnectors")
);
const GuestUserConnectorDetailsView = lazy(() =>
  import("../Components/Connectors_New/GuestUserConnectorDetailsView")
);
const ViewDashboardAndApiRequesting = lazy(() =>
  import("../Components/Datasets_New/ViewDashboardAndApiRequesting")
);
const GuestUserHomeNew = lazy(() =>
  import("../Views/GuestUser/GuestUserHomeNew")
);
const ChatSupport = lazy(() =>
  import("../Views/Resources/ChatSupport/ChatSupport")
);

const FooterVistaar = lazy(() => import("../Components/Footer/Vistaar/Footer"));
const GuestRoutes = () => {
  const { isVerified, setIsVerified } = useContext(FarmStackContext);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const miniLaptop = useMediaQuery(theme.breakpoints.down("lg"));
  const desktop = useMediaQuery(theme.breakpoints.up("xl"));
  const largeDesktop = useMediaQuery(theme.breakpoints.up("xxl"));
  // const [isVerified, setIsVerified] = useState(false);

  let roleId = {
    1: "datahub_admin",
    3: "datahub_participant_root",
    6: "datahub_co_steward",
  };

  const verifyUserDataOfLocal = () => {
    let url = UrlConstant.base_url + UrlConstant.verify_local_data_of_user;
    let userId = getUserLocal();
    if (!userId) {
      flushLocalstorage();
      setIsVerified(false);
      return false;
    }
    let params = { user_id: userId };
    HTTPService("GET", url, params, false, false, false)
      .then((response) => {
        console.log("response to verify local data", url, response);
        if (!response?.data?.on_boarded) {
          flushLocalstorage();
          setIsVerified(false);
          return false;
        }
        setIsVerified(true);
        setRoleLocal(roleId[response?.data?.role_id]);
        console.log(
          "response to verify local data role",
          getRoleLocal(),
          isLoggedInUserAdmin()
        );
      })
      .catch((err) => {
        console.log("error to verify local data", err);
        setIsVerified(false);
        return true;
      });
    // setIsVerified(true);
    // return true;
  };
  useEffect(() => {
    verifyUserDataOfLocal();
  }, []);

  return (
    <div className="center_keeping_conatiner">
      <ScrollToTop />

      {
        <NavbarNew
          loginType={
            isLoggedInUserAdmin() || (isLoggedInUserCoSteward() && isVerified)
              ? "admin"
              : isLoggedInUserParticipant() && isVerified
              ? "participant"
              : "guest"
          }
        />
      }
      {/* {(isLoggedInUserAdmin() || isLoggedInUserCoSteward()) &&
      (isVerified || verifyUserDataOfLocal()) ? (
        <NavbarNew loginType={"admin"} />
      ) : isLoggedInUserParticipant() &&
        (isVerified || verifyUserDataOfLocal()) ? (
        <NavbarNew loginType={"participant"} />
      ) : (
        <NavbarNew loginType={"guest"} />
      )} */}
      {/* <NavbarNew loginType={"guest"} /> */}
      <div className={"minHeight67vhDatahubPage" + " " + (mobile || tablet)}>
        {/* <br /> */}
        <Switch>
          <Route exact path="/home" component={GuestUserHomeNew} />
          <Route exact path="/home/get-started" component={GetStarted} />
          <Route exact path="/home/datasets" component={GuestUserDatatsets} />
          <Route
            exact
            path="/home/datasets/:id"
            component={GuestUserViewDataset}
          />
          <Route exact path="/home/dashboard-api-request/:datasetid">
            <ViewDashboardAndApiRequesting guestUser={true} />
          </Route>
          <Route
            exact
            path="/home/participants"
            component={GuestUserParticipants}
          />
          <Route exact path="/home/register" component={RegisterParticipants} />
          <Route
            exact
            path="/home/participants/view/:id"
            component={GuestUserParticipantsDetails}
          />
          {!checkProjectFor("kalro") && (
            <Route
              exact
              path="/home/costeward"
              component={GuestUserCoStewardNew}
            />
          )}
          {!checkProjectFor("kalro") && (
            <Route
              exact
              path="/home/costeward/view/:id"
              component={GuestUserCostewardDetailsNew}
            />
          )}
          <Route exact path="/home/legal" component={GuestUserLegalNew} />
          <Route exact path="/home/contact" component={GuestUserContactNew} />
          <Route exact path="/home/resources" component={GuestUserResources} />
          <Route exact path="/home/dashboard" component={DashboardUpdated} />
          <Route
            exact
            path="/home/resources/view/:id"
            component={GuestUserViewResource}
          />
          {/* <Route
            exact
            path="/home/resources/chat-with-content/"
            component={ChatSupport}
          /> */}
          {/* <Route
            exact
            path="/home/connectors"
            component={GuestUserConnectors}
          />
          <Route
            exact
            path="/home/connectors/view/:id"
            component={GuestUserConnectorDetailsView}
          /> */}
        </Switch>
      </div>
      <Divider className="mt-50" />
      {/* <FooterNew /> */}
      {/* <Footer /> */}
      <FooterVistaar
        loginType={
          isLoggedInUserAdmin() || (isLoggedInUserCoSteward() && isVerified)
            ? "admin"
            : isLoggedInUserParticipant() && isVerified
            ? "participant"
            : "guest"
        }
      />
    </div>
  );
};

export default GuestRoutes;
