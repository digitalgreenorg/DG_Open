import * as React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoLabelIcon from "@mui/icons-material/VideoLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import OnboardingFooter from "../../../Components/Footer/OnboardingFooter";
import new_farmstack_main_logo from "../../../Assets/Img/Farmstack V2.0/new_farmstack_main_logo.svg";
import styles from "./home_screen.module.css";
import VerifyEmail from "../../../Components/NewOnboarding/VerifyEmail";
import VerifyEmailPassword from "../../../Components/NewOnboarding/VerifyEmailPassword";
import ProfileDetails from "../../../Components/NewOnboarding/ProfileDetails";
import OrganizationDetails from "../../../Components/NewOnboarding/OrganizationDetails";
import CompanyPolicies from "../../../Components/NewOnboarding/CompanyPolicies";
import CategoryDetails from "../../../Components/NewOnboarding/CategoryDetails";
import DatapointDetails from "../../../Components/NewOnboarding/DatapointDetails";
import LetsGetStarted from "../../../Components/NewOnboarding/LetsGetStarted";
import global_styles from "../../../Assets/CSS/global.module.css";
import { CSSTransition } from "react-transition-group";
import {
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "../../../Utils/Common";
import FooterNew from "../../../Components/Footer/Footer_New";
import { FarmStackContext } from "../../../Components/Contexts/FarmStackContext";
import { Divider, useMediaQuery, useTheme } from "@mui/material";
import KalroSpecificNavbar from "../../../Components/Navbar/KalroSpecificNavbar";
import UrlConstant from "../../../Constants/UrlConstants";
import Footer from "../../../Components/Footer/SmallFooter/Footer";
import NavbarNew from "../../../Components/Navbar/Navbar_New";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#00A94F",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#00A94F",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#00A94F",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

export default function OnBoarding() {
  const { setAdminData, callLoader, adminData } =
    React.useContext(FarmStackContext);
  const isLoginWithPasswordEnabled =
    window?.ENV_VARS?.REACT_APP_LOGIN_WITH_PASSWORD ||
    process.env.REACT_APP_LOGIN_WITH_PASSWORD;
  const [activeStep, setActiveStep] = React.useState(0);
  const [isPasswordLogin, setIsPasswordLogin] = useState(
    isLoginWithPasswordEnabled === "true"
  );
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  // function getAdminData() {
  //   callLoader(true);
  //   let url =
  //     UrlConstant.base_url + UrlConstant.microsite_admin_organization + "/";
  //   let method = "GET";
  //   HTTPService(method, url, "", false, false, false, false, false)
  //     .then((response) => {
  //       callLoader(false);

  //       setAdminData(response.data);
  //       let stepNumber = response.data?.organization?.logo ? 0 : -1;
  //       setActiveStep(stepNumber);
  //     })
  //     .catch((error) => {
  //       callLoader(false);
  //     });
  // }
  React.useEffect(() => {
    // getAdminData();
  }, []);

  let dev_mode =
    Window?.ENV_VARS?.REACT_APP_DEV_MODE || process.env.REACT_APP_DEV_MODE;
  localStorage.setItem("dev_mode", dev_mode);
  let steps = [];
  if (isLoggedInUserAdmin()) {
    steps = [
      {
        label: "Verify mail id",
        subLabel: "Step 1",
        completed: false,
      },
      {
        label: "Profile details",
        subLabel: "Step 2",
        completed: false,
      },
      {
        label: "Organisation details",
        subLabel: "Step 3",
        completed: false,
      },
      {
        label: "Company policies",
        subLabel: "Step 4",
        completed: false,
      },
      {
        label: "Category details",
        subLabel: "Step 5",
        completed: false,
      },
      {
        label: "DataPoint details",
        subLabel: "Step 6",
        completed: false,
      },
    ];
  } else if (isLoggedInUserParticipant() || isLoggedInUserCoSteward()) {
    steps = [
      {
        label: "Verify mail id",
        subLabel: "Step 1",
        completed: false,
      },
      {
        label: "Profile details",
        subLabel: "Step 2",
        completed: false,
      },
      {
        label: "Organisation details",
        subLabel: "Step 3",
        completed: false,
      },
    ];
  }
  return (
    <>
    <NavbarNew isOnboard={true} />
    <Stack
      className={
        styles.main_onboarding_box +
        " " +
        global_styles.font_family +
        " " +
        "mainOnboardingParent"
      }
      sx={{ width: "100%" }}
    >
      {/* <div className={styles.farmstack_logo}>
        <img
          className={styles.farmstack_logo_img}
          src={new_farmstack_main_logo}
          alt="Farmstack"
        />
      </div> */}
      {console.log(
        UrlConstant.base_url_without_slash + adminData?.organization?.logo
      )}
      <div style={{ marginTop: "20px" }}></div>
      <KalroSpecificNavbar
        orgLogo={adminData?.organization?.logo}
        showPowereBy={true}
        showBanner={false}
        showVerticalDivider={true}
        mobile={mobile}
      />
      {/* <div style={{ borderBottom: "1px solid #00a94f" }} /> */}
      {activeStep > 0 && (
        <Stepper
          className={
            styles.steppers + " " + global_styles.font_family + " " + "stepper_"
          }
          alternativeLabel
          activeStep={activeStep}
          connector={<QontoConnector />}
        >
          {steps.map((label, index) => {
            return (
              <Step key={label.label}>
                <StepLabel
                  onClick={() => dev_mode && setActiveStep(index)}
                  classes={styles.steps_label}
                  StepIconComponent={QontoStepIcon}
                >
                  Step {" " + (index + 1)} <br />
                  {label.label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      )}
      {activeStep >= 0 && (
        <div className={styles.description}>
          Login to access a world of data collaboration, insights, and
          innovation. <br />
          Let's make data-driven decisions together. <br />
        </div>
      )}
      <CSSTransition
        appear={activeStep === -1}
        in={activeStep === -1}
        timeout={{
          appear: 600,
          enter: 700,
          exit: 100,
        }}
        classNames="step"
        unmountOnExit
      >
        <LetsGetStarted setActiveStep={setActiveStep} />
      </CSSTransition>
      <CSSTransition
        in={activeStep === 0}
        timeout={{
          appear: 600,
          enter: 700,
          exit: 100,
        }}
        classNames="step"
        unmountOnExit
      >
        {isPasswordLogin ? (
          <VerifyEmailPassword setActiveStep={setActiveStep} />
        ) : (
          <VerifyEmail setActiveStep={setActiveStep} />
        )}
      </CSSTransition>
      <CSSTransition
        in={activeStep === 1}
        timeout={{
          appear: 600,
          enter: 700,
          exit: 100,
        }}
        classNames="step"
        unmountOnExit
      >
        <ProfileDetails setActiveStep={setActiveStep} />
      </CSSTransition>
      <CSSTransition
        in={activeStep === 2}
        timeout={{
          appear: 600,
          enter: 700,
          exit: 100,
        }}
        classNames="step"
        unmountOnExit
      >
        <OrganizationDetails setActiveStep={setActiveStep} />
      </CSSTransition>
      <CSSTransition
        in={activeStep === 3}
        timeout={{
          appear: 600,
          enter: 700,
          exit: 100,
        }}
        classNames="step"
        unmountOnExit
      >
        <CompanyPolicies setActiveStep={setActiveStep} />
      </CSSTransition>
      <CSSTransition
        in={activeStep === 4}
        timeout={{
          appear: 600,
          enter: 700,
          exit: 100,
        }}
        classNames="step"
        unmountOnExit
      >
        <CategoryDetails setActiveStep={setActiveStep} />
      </CSSTransition>

      {activeStep == 5 && (
        <CSSTransition
          in={activeStep === 5}
          timeout={{
            appear: 600,
            enter: 700,
            exit: 100,
          }}
          classNames="step"
          unmountOnExit={true}
        >
          <DatapointDetails setActiveStep={setActiveStep} />
        </CSSTransition>
      )}
      <Divider className="mt-50" />
      {activeStep == 0 ? <Footer /> : <OnboardingFooter />}
    </Stack>
    </>
  );
}
