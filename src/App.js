import React, { useContext, useEffect, lazy, Suspense } from "react";
import "mdbreact/dist/css/mdb.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useParams,
} from "react-router-dom";
import { Navbar } from "react-bootstrap";

import { FarmStackContext } from "./Components/Contexts/FarmStackContext";
import Loader from "./Components/Loader/Loader";
import Toast from "./Components/Generic/Toast";
import GuestUserContactNew from "./Views/GuestUser/GuestUserContactNew";
import UrlConstant from "./Constants/UrlConstants";
import HTTPService from "./Services/HTTPService";
import {
  getUserLocal,
  flushLocalstorage,
  setRoleLocal,
  isLoggedInUserAdmin,
  isLoggedInUserParticipant,
} from "./Utils/Common";
import ScrollToTop from "./Components/ScrollTop/ScrollToTop";
//all css imports
import "./Components/Accordion/Accordion.css";
import "./Components/AdminDatasetConnection/admin-add-dataset.css";
import "./Components/AdminDatasetConnection/DataStandardizationInAddDataset.css";
import "./Components/AdminDatasetConnection/LocalMachineUploadDataset.css";
import "./Components/Datasets/DataSetForm.css";
import "./Components/Datasets_New/DataSetsTab/DataSetsTab.css";
import "./Components/Datasets_New/TabComponents/Standardise.css";
import "./Components/Datasets_New/TabComponents/UploadFile.css";
import "./Components/Datasets_New/AddDataSet.css";
import "./Components/Datasets_New/DataSets.css";
import "./Components/Datasets_New/DataSetsListView.css";
import "./Components/Datasets_New/DataSetsView.css";
import "./Components/Datasets_New/FileTable.css";
import "./Components/Footer/Footer.css";
import "./Components/GuestUser/GuestUserBanner.css";
import "./Components/GuestUser/GuestUserDatasets.css";
import "./Components/GuestUser/noDatasetGuestUser.css";
import "./Components/IntegrationConnectors/cards.css";
import "./Components/intros/Leftintro.css";
import "./Components/intros/LeftintroParticipant 2.css";
import "./Components/intros/LeftintroParticipant.css";
import "./Components/Navbar/Navbar.css";
import "./Components/Participants/ParticipantMain.css";
import "./Components/Participants/participantsCards.css";
import "./Components/Settings/accounts/UploadProfileimg.css";
import "./Components/Settings/Participants/Project/ProjectForm.css";
import "./Components/Standardization/standardizationInOnbording.css";
import "./Constants/CssConstants.css";
import "./Views/Connector/ConnectorParticipant.css";
import "./Views/Dataset/DatasetFilter.css";
import "./Views/GuestUser/GuestUserHome.css";

const Datahub = lazy(() => import("./Layout/Datahub"));
const Participant = lazy(() => import("./Layout/Participant"));
const OnBoarding = lazy(() => import("./Views/Pages/HomeScreen/OnBoarding"));
const GuestRoutes = lazy(() => import("./Layout/GuestRoutes"));
const NewError = lazy(() => import("./Components/Error/NewError"));
function App() {
  const { isLoading, toastDetail, setAdminData, setIsVerified } =
    useContext(FarmStackContext);

  // const webSiteUrl = useParams();
  function getAdminData() {
    let url =
      UrlConstant.base_url + UrlConstant.microsite_admin_organization + "/";
    let method = "GET";
    // let url = UrlConstant.base_url + UrlConstant.microsite_admin_organization
    HTTPService(method, url, "", false, false, false, false, false)
      .then((response) => {
        setAdminData(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

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
      return;
    }
    let params = { user_id: userId };
    HTTPService("GET", url, params, false, false, false)
      .then((response) => {
        if (!response?.data?.on_boarded) {
          flushLocalstorage();
          return;
        }
        setIsVerified(true);
        setRoleLocal(roleId[response?.data?.role_id]);
      })
      .catch((err) => {
        console.log("error", err);
        setIsVerified(false);
      });
  };
  useEffect(() => {
    // TODO: to be removed
    console.log(
      window?.ENV_VARS?.REACT_APP_LOGIN_WITH_PASSWORD ||
        process.env.REACT_APP_LOGIN_WITH_PASSWORD,
      "REACT_APP_LOGIN_WITH_PASSWORD"
    );
    verifyUserDataOfLocal();
    getAdminData();
  }, []);
  return (
    <React.Fragment>
      {isLoading ? <Loader /> : ""}
      {toastDetail.status ? (
        <Toast message={toastDetail.message} type={toastDetail.type} />
      ) : (
        ""
      )}
      <Suspense
        fallback={
          <>
            {/* <Navbar
              loginType={
                isLoggedInUserAdmin()
                  ? "admin"
                  : isLoggedInUserParticipant()
                  ? "participant"
                  : "guest"
              }
            /> */}
            <Loader />
          </>
        }
      >
        <Router>
          <ScrollToTop />
          <Switch>
            <Route exact path="/login" component={OnBoarding} />
            <Route path="/datahub" component={Datahub} />
            <Route path="/participant" component={Participant} />
            <Route path="/error/:status" component={NewError} />
            <Route path="/home" component={GuestRoutes} />
            <Route exact path="/contact" component={GuestUserContactNew} />
            <Redirect from="/" to="/home" />
          </Switch>
        </Router>
      </Suspense>
    </React.Fragment>
  );
}

export default App;
