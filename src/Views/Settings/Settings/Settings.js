import React, { useState, useEffect } from "react";
import TeamMemberCard from "../../../Components/Settings/TeamMember/TeamMemberCard";
import AddParticipantCard from "../../../Components/Participants/AddParticipantCard";
import AddCard from "../../../Components/AddCard/AddCard";
import Success from "../../../Components/Success/Success";
import Delete from "../../../Components/Delete/Delete";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import labels from "../../../Constants/labels";
import THEME_COLORS from "../../../Constants/ColorConstants";
import UrlConstants from "../../../Constants/UrlConstants";
import { useHistory } from "react-router-dom";
import HTTPService from "../../../Services/HTTPService";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { TabContext } from "@mui/lab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Button from "@mui/material/Button";
import AccountSetting from "../accounts/accountSetting";
import OrganisationSetting from "../organisation/OrganisationSetting";
import { useParams } from "react-router-dom";
import PolicySettings from "../PolicySettings/PolicySettings";
import BrandingSetting from "../branding/BrandingSetting";
import HandleSessionTimeout, { isLoggedInUserAdmin, isLoggedInUserCoSteward } from "../../../Utils/Common";
import Loader from "../../../Components/Loader/Loader";
import { GetErrorHandlingRoute } from "../../../Utils/Common";
import DepartmentSettingsCard from "../ParticipantSettings/DepartmentSettingsCard";
import ProjectListing from "../ParticipantSettings/Project/ProjectListing";
import DepartmentListing from "../Department/DepartmentListing";
import AdminCategorySetupAndEdit from "../../../Components/Catergories/AdminCategorySetupAndEdit";
import AddingCategory from "../../../Components/Catergories/AddingCategory";
import StandardizationInOnbord from "../../../Components/Standardization/StandardizationInOnbording";

const useStyles = {
  btncolor: {
    color: "white",
    "text-transform": "capitalize",
    "border-color": THEME_COLORS.THEME_COLOR,
    "background-color": THEME_COLORS.THEME_COLOR,
    float: "right",
    "border-radius": 0,
  },
  btn: {
    width: "420px",
    height: "42px",
    "margin-top": "30px",
    background: "#ffffff",
    opacity: "0.5",
    border: "2px solid #c09507",
    color: "black",
  },
  marginrowtop: { "margin-top": "20px" },
  marginrowtop50px: { "margin-top": "20px" },
  marginrowtoptab50px: { "margin-top": "50px" },
  marginrowtop10px: { "margin-top": "20px" },
  marginrowtopscreen10px: { "margin-top": "10px" },
  teamword: {
    "font-weight": "700",
    "font-size": "20px",
    "margin-left": "15px",
    "margin-top": "30px",
    "margin-bottom": "20px",
    "font-style": "normal",
    "font-family": "Open Sans",
  },
  background: {
    "margin-left": "70px",
    "margin-right": "70px",
    background: "#FCFCFC"
  },
};

function Settings(props) {
  const [getdepartmentList, setgetdepartmentList] = useState([]);
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  const [teamMemberList, setteamMemberList] = useState([]);
  const [teampList, setteampList] = useState([]);
  const [istabView, setistabView] = useState(true);
  const [isDelete, setisDelete] = useState(false);
  const [teamMemberId, setteamMemberId] = useState("");
  const [isDeleteSuccess, setisDeleteSuccess] = useState(false);
  const [isAccountUpdateSuccess, setisAccountUpdateSuccess] = useState(false);
  const [isOrgUpdateSuccess, setisOrgUpdateSuccess] = useState(false);
  const [isBrandUpdateSuccess, setisBrandUpdateSuccess] = useState(false);
  const [isPolicyUpdateSuccess, setisPolicyUpdateSuccess] = useState(false);
  const [value, setValue] = React.useState("1");
  const [isShowLoadMoreButton, setisShowLoadMoreButton] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  const [memberUrl, setMemberUrl] = useState(
    UrlConstants.base_url + UrlConstants.team_member
  );
  const { id } = useParams();

  const history = useHistory();
  useEffect(() => {
    getMemberList();
    if (id) {
      setValue(id);
    } else {
      setValue(1);
    }
  }, []);

  const getMemberList = (flag) => {
    setIsLoader(true);
    HTTPService("GET", memberUrl, "", false, true)
      .then((response) => {
        setIsLoader(false);
        console.log("otp valid", response.data);
        if (response.data.next == null) {
          setisShowLoadMoreButton(false);
        } else {
          setisShowLoadMoreButton(true);
          setMemberUrl(response.data.next);
        }
        if (flag) {
          let tempList = [...response.data.results];
          setteamMemberList(tempList);
        } else {
          let dataList = teamMemberList;
          let finalDataList = [...dataList, ...response.data.results];
          setteamMemberList(finalDataList);
        }
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };
  const deleteTeamMember = () => {
    // setisDelete(false);
    // setistabView(false);
    // setisDeleteSuccess(true)
    setIsLoader(true);
    HTTPService(
      "DELETE",
      UrlConstants.base_url + UrlConstants.team_member + teamMemberId + "/",
      "",
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log("otp valid", response.data);
        setisDeleteSuccess(true);
        setistabView(false);
        setisDelete(false);
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    history.push(newValue)
  };
  return (
    <div
      className="minHeight501pxsettingpagemaindiv"
      style={useStyles.background}>
      {isLoader ? <Loader /> : ""}
      {/* <Container style={useStyles.marginrowtopscreen10px}> */}
      {isDelete ? (
        <Delete
          route={"login"}
          imagename={"delete"}
          firstbtntext={"Delete"}
          secondbtntext={"Cancel"}
          deleteEvent={() => deleteTeamMember()}
          cancelEvent={() => {
            setisDelete(false);
            setistabView(true);
            setisDeleteSuccess(false);
          }}
          heading={screenlabels.settings.delete_member}
          imageText={screenlabels.settings.delete_msg}
          msg={screenlabels.settings.second_delete_msg}
          firstmsg={screenlabels.settings.second_delete_msg}
          secondmsg={screenlabels.settings.third_delete_msg}></Delete>
      ) : (
        <></>
      )}
      {isDeleteSuccess ? (
        <Success
          okevent={() => {
            setMemberUrl(UrlConstants.base_url + UrlConstants.team_member);
            setteamMemberId("");
            setisDelete(false);
            setistabView(true);
            setisDeleteSuccess(false);
            getMemberList(true);
          }}
          imagename={"success"}
          btntext={"ok"}
          heading={"Team Member deleted successfully!"}
          imageText={"Deleted!"}
          msg={"You deleted a member."}></Success>
      ) : (
        <></>
      )}
      {isAccountUpdateSuccess ? (
        <Success
          okevent={() => {
            //   setteamMemberId("");
            //   setisDelete(false);
            setistabView(true);
            setisAccountUpdateSuccess(false);
            window.location.reload();
            //   getMemberList();
          }}
          imagename={"success"}
          btntext={"ok"}
          heading={"Account Settings updated successfully !"}
          imageText={"Success!"}
          msg={"Your account settings are updated."}></Success>
      ) : (
        <></>
      )}
      {isOrgUpdateSuccess ? (
        <Success
          okevent={() => {
            //   setteamMemberId("");
            //   setisDelete(false);
            setistabView(true);
            setisOrgUpdateSuccess(false);
            //   getMemberList();
          }}
          imagename={"success"}
          btntext={"ok"}
          heading={"Organisation details updated successfully !"}
          imageText={"Success!"}
          msg={"Your organisation details are updated."}></Success>
      ) : (
        <></>
      )}
      {isBrandUpdateSuccess ? (
        <Success
          okevent={() => {
            //   setteamMemberId("");
            //   setisDelete(false);
            setistabView(true);
            setisBrandUpdateSuccess(false);
            //   getMemberList();
          }}
          imagename={"success"}
          btntext={"ok"}
          heading={"Customize Design successfully !"}
          imageText={"Success!"}
          msg={"Your Customize Design are updated."}></Success>
      ) : (
        <></>
      )}
      {isPolicyUpdateSuccess ? (
        <Success
          okevent={() => {
            //   setteamMemberId("");
            //   setisDelete(false);
            setistabView(true);
            setisPolicyUpdateSuccess(false);
            //   getMemberList();
          }}
          imagename={"success"}
          btntext={"ok"}
          heading={"Policy details updated successfully !"}
          imageText={"Success!"}
          msg={"Your policy details are updated."}></Success>
      ) : (
        <></>
      )}
      {istabView ? (
        <Row style={useStyles.marginrowtoptab50px}>
          <Col xs={12} sm={12} md={12} lg={12} className="settingsTabs">
            <Box>
              <TabContext value={value} className="tabstyle">
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example">
                    <Tab label="Account settings" value="1" />
                    <Tab label="Organization settings" value="2" />
                    {!isLoggedInUserCoSteward() ?
                    <Tab label="Policy settings" value="3" /> : "" }
                    {!isLoggedInUserCoSteward() ?
                    <Tab label="Team members" value="4" /> : "" }
                    {!isLoggedInUserCoSteward() ?
                    <Tab label="Customize design" value="5" /> : "" }
                    {!isLoggedInUserCoSteward() ?
                    <Tab label="Categories" value="6" /> : " "}
                    {
                      isLoggedInUserAdmin() ?
                      <Tab label="Data Standardization" value="7" /> 
                      : ""
                    }
                    {/* <Tab label="Department" value="6" />
                    // <Tab label="Project" value="7" /> */}
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <AccountSetting
                    setisAccountUpdateSuccess={() => {
                      setistabView(false);
                      setisAccountUpdateSuccess(true);
                    }}
                  />
                </TabPanel>
                <TabPanel value="2">
                  <OrganisationSetting
                    setisOrgUpdateSuccess={() => {
                      setistabView(false);
                      setisOrgUpdateSuccess(true);
                    }}
                  />
                </TabPanel>
                <TabPanel value="3">
                  <PolicySettings
                    setisPolicyUpdateSuccess={() => {
                      setistabView(false);
                      setisPolicyUpdateSuccess(true);
                    }}
                  />
                </TabPanel>
                <TabPanel value="4">
                  <Row>
                    <span style={useStyles.teamword}>Team</span>
                  </Row>
                  <Row>
                    <Col
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      style={useStyles.marginrowtop10px}>
                      <AddCard
                        firstText={screenlabels.settings.firstText}
                        secondText={screenlabels.settings.secondText}
                        addevent={() =>
                          history.push("/datahub/settings/addmember")
                        }></AddCard>
                    </Col>
                    {teamMemberList.map((rowData, index) => (
                      <Col
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        style={useStyles.marginrowtop10px}>
                        <TeamMemberCard
                          id={rowData.id}
                          profilepic={rowData.profile_picture}
                          firstname={rowData.first_name}
                          mainheading={
                            rowData.first_name + " " + rowData.last_name
                          }
                          subheading={rowData.email}
                          index={index}
                          role={rowData.role}
                          deleteTeamMember={(id) => {
                            setteamMemberId(id);
                            setisDelete(true);
                            setistabView(false);
                            setisDeleteSuccess(false);
                          }}></TeamMemberCard>
                      </Col>
                    ))}
                  </Row>
                  <Row style={useStyles.marginrowtop}>
                    <Col xs={12} sm={12} md={6} lg={3}></Col>
                    {isShowLoadMoreButton ? (
                      <Col xs={12} sm={12} md={6} lg={6}>
                        <Button
                          style={{ textTransform: "none" }}
                          onClick={() => getMemberList()}
                          variant="outlined"
                          className="cancelbtn">
                          Load more
                        </Button>
                      </Col>
                    ) : (
                      <></>
                    )}
                  </Row>
                </TabPanel>
                <TabPanel value="5">
                  <BrandingSetting
                    setisBrandUpdateSuccess={() => {
                      setistabView(false);
                      setisBrandUpdateSuccess(true);
                    }}
                  />
                </TabPanel>

                {/* <TabPanel value="6"></TabPanel> */}

                {/* <TabPanel value="6">
                  <DepartmentListing /> */}
                  {/* <Row>
                    <span style={useStyles.departmentword}>My departments</span>
                  </Row>
                  <Row>
                    <Col
                      xs={12}
                      sm={6}
                      md={4}
                      lg={4}
                      style={useStyles.marginrowtop10px}>
                      <AddCard
                        firstText={screenlabels.department.firstText}
                        secondText={screenlabels.department.secondText}
                        addevent={() =>
                          history.push("/participant/settings/adddepartment")
                        }></AddCard>
                    </Col>
                    {getdepartmentList.map((each, index) => (
                      // console.log(each, index)
                      <Col
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        style={useStyles.marginrowtop10px}>
                        <DepartmentSettingsCard
                          id={each.id}
                          // each={each}
                          organization={each.organization}
                          department_name={each.department_name}
                          departmentdescription={each.department_discription}
                          index={index}></DepartmentSettingsCard>
                      </Col>
                    ))}
                  </Row> */}

                {/* </TabPanel> */}
                <TabPanel value="6">
                  <AddingCategory />
                </TabPanel>
                <TabPanel value="7">
                  {/* <ProjectListing /> */}
                  <StandardizationInOnbord inSettings={true}/>
                </TabPanel>
              </TabContext>
            </Box>
          </Col>
        </Row>
      ) : (
        <></>
      )}
      {/* </Container> */}
    </div>
  );
}
export default Settings;
