import React, { useEffect, useState } from "react";
import labels from "../../../Constants/labels";
import TodoListSmallBox from "./TodoListSmallBox";
import styles from "./todoList.module.css";
import TodoListBigBox from "./TodoListBigBox";
import addTeamMembers from "../../../Assets/Img/add_team_members.svg";
import inviteMembers from "../../../Assets/Img/Invite_members_icon.svg";
import organizationDetails from "../../../Assets/Img/organization_details.svg";
import totalAmountOfDataExchange from "../../../Assets/Img/Total amount of data exchange icon.svg";
import totalNoOfActiveConnectors from "../../../Assets/Img/Total no.of active connectors icon.svg";
import totalNoOfDatasets from "../../../Assets/Img/Total no.of datasets icon.svg";
import totalNoOfParticipants from "../../../Assets/Img/Total no.of participants icon.svg";
import updateBrandingDetails from "../../../Assets/Img/Update branding details icon.svg";
import HTTPService from "../../../Services/HTTPService";
import UrlConstant from "../../../Constants/UrlConstants";
import { GetErrorHandlingRoute, goToTop } from "../../../Utils/Common";
import { FarmStackContext } from "../../Contexts/FarmStackContext";
import { useHistory } from "react-router-dom";

const TodoList = () => {
  // let {total_participants} =
  const { callToast } = React.useContext(FarmStackContext);
  const history = useHistory();
  const [todoListSmallBoxData, setTodoListSmallBoxData] = useState([
    {
      imgUrl: organizationDetails,
      title: labels.en.dashboard.organisation_details,
      click: "settings/2",
    },
    {
      imgUrl: addTeamMembers,
      title: labels.en.dashboard.add_team_members,
      click: "settings/addmember",
    },
    {
      imgUrl: inviteMembers,
      title: labels.en.dashboard.invite_members,
      click: "participants/invite",
    },
    {
      imgUrl: updateBrandingDetails,
      title: labels.en.dashboard.update_branding_details,
      click: "settings/5",
    },
  ]);

  // const [totalListDetails, setTotalListDetails] = useState([])
  const [totalListDetails, setTotalListDetails] = useState([]);
  const { to_do_list } = labels.en.dashboard;

  const getData = () => {
    let method = "GET";
    let url = UrlConstant.base_url + UrlConstant.datahub_dashboard;
    let data = "";
    HTTPService(method, url, data, false, true)
      .then((res) => {
        console.log(res.data, "RESPONSE");

        let data = [
          {
            imgUrl: totalNoOfParticipants,
            title: labels.en.dashboard.total_no_of_participants,
            value: res.data.total_participants,
          },
          {
            imgUrl: totalNoOfDatasets,
            title: labels.en.dashboard.total_no_of_datasets,
            value: res.data.total_datasets,
          },
          {
            imgUrl: totalNoOfActiveConnectors,
            title: labels.en.dashboard.total_no_of_active_connectors,
            value: res.data.active_connectors,
          },
          {
            imgUrl: totalAmountOfDataExchange,
            title: labels.en.dashboard.total_amount_of_data_exchange,
            value: res.data.total_data_exchange.total_data,
            valueUnit: res.data.total_data_exchange.unit,
          },
        ];

        setTotalListDetails([...data]);
      })
      .catch(async (err) => {
        let response = await GetErrorHandlingRoute(err);
        if (response.toast) {
          //callToast(message, type, action)
          callToast(
            response?.message ?? "Error occurred while getting datasets",
            response.status == 200 ? "success" : "error",
            response.toast
          );
        } else {
          history.push(response?.path);
        }
      });
  };

  useEffect(() => {
    getData();
    goToTop(0);
    // if(allDashboardDetails!==null){
    //   //  const {totalNoOfParticipants, totalNoOfDatasets, totalNoOfActiveConnectors, totalAmountOfDataExchange} = allDashboardDetails;
    //   //  setTotalListDetails([totalNoOfParticipants, totalNoOfDatasets, totalNoOfActiveConnectors, totalAmountOfDataExchange]);
    //   // console.log("Verified", allDashboardDetails)
    //   // let data = [{imgUrl:totalNoOfParticipants, title:labels.en.dashboard.total_no_of_participants,value:15},{imgUrl:totalNoOfDatasets, title:labels.en.dashboard.total_no_of_datasets,value:5012},{imgUrl:totalNoOfActiveConnectors, title:labels.en.dashboard.total_no_of_active_connectors,value:193},{imgUrl:totalAmountOfDataExchange, title:labels.en.dashboard.total_amount_of_data_exchange,value:50,valueUnit:"Gbs"}];
    //   // console.log("DATTTTTTTTTTTTTA", data)
    //   // setTotalListDetails([...data])
    // }else{
    //   console.log("problem in fetching Dashboard data from backend")
    // console.log("GOT",totalparticipant)
    // }
  }, []);
  return (
    <div>
      <div className={styles.todoListMain}>
        <span className={styles.todoListTextBox}>{to_do_list}</span>
        <div className={styles.todoListSmallBoxContainer}>
          {todoListSmallBoxData.map((todoListdata) => (
            <TodoListSmallBox todoListdata={todoListdata} />
          ))}
        </div>
      </div>
      <div className={styles.totalListContainerMain}>
        {totalListDetails.map((totalDetail) => (
          <TodoListBigBox totalDetail={totalDetail} />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
