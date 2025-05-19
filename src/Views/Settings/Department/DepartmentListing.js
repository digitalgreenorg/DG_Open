import React, { useEffect, useState } from 'react'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "@mui/material/Button";
import AddCard from '../../../Components/AddCard/AddCard';
import { useHistory, useLocation } from 'react-router-dom';
import DepartmentSettingsCard from '../ParticipantSettings/DepartmentSettingsCard';
import labels from '../../../Constants/labels';
import Loader from '../../../Components/Loader/Loader';
import UrlConstant from '../../../Constants/UrlConstants';
import HTTPService from '../../../Services/HTTPService';
import { GetErrorHandlingRoute, isRoleName } from '../../../Utils/Common';

export default function DepartmentListing(props) {

    const useStyles = {
        departmentword: {
            "font-weight": "700",
            "font-size": "20px",
            "margin-left": "15px",
            "margin-top": "30px",
            "margin-bottom": "20px",
            "font-style": "normal",
            "font-family": "Open Sans",
          }
    }

    const history = useHistory()
    const location = useLocation()
    const [screenlabels, setscreenlabels] = useState(labels["en"]);
    const [isLoader, setIsLoader] = useState(false);

    const [getdepartmentList, setgetdepartmentList] = useState([]);
    const [isShowLoadMoreButton, setisShowLoadMoreButton] = useState(false);
    const [departmenturl, setdepartmenturl] = useState("");

    useEffect(() => {

        setIsLoader(true);
        HTTPService(
          "GET",
          UrlConstant.base_url +
            "/participant/department/department_list/" +
            "?org_id=" +
            JSON.parse(localStorage.getItem("org_id")),
          "",
          false,
          true
        )
          .then((response) => {
            setIsLoader(false);
            console.log("otp valid", response.data);
            //     let dataFromBackend = [...response.data]
            // setgetdepartmentList(dataFromBackend)
            if (response.data.next == null) {
              setisShowLoadMoreButton(false);
            } else {
              setisShowLoadMoreButton(true);
              console.log(response.data.next);
              setdepartmenturl(response.data.next);
            }
            // setgetdepartmentList(response.data.results)
            let tempList = [...response.data.results];
            setgetdepartmentList(tempList);
            //1 let deptList = getdepartmentList;
            // 2let dataFromBackend = [...deptList, ...response.data.results];
            // 3setgetdepartmentList(dataFromBackend);
            // setgetdepartmentList(...eachDepartmentData)
            // let deptList = getdepartmentList();
            // let finalDeptList = [...deptList, ...response.data.results];
            // setgetdepartmentList(finalDeptList);
          })
          .catch((e) => {
            setIsLoader(false);
            history.push(GetErrorHandlingRoute(e));
          });
        // getDatafrombackendfordepartcard ()
      }, []);
    
      const getdepartmentcardList = () => {
        setIsLoader(true);
        HTTPService("GET", departmenturl, "", false, true)
          .then((response) => {
            setIsLoader(false);
            if (response.data.next == null) {
              setisShowLoadMoreButton(false);
            } else {
              setisShowLoadMoreButton(true);
              setdepartmenturl(response.data.next);
            }
            let deptList = getdepartmentList;
            let dataFromBackend = [...deptList, ...response.data.results];
            console.log(deptList);
            setgetdepartmentList(dataFromBackend);
          })
          .catch((e) => {
            setIsLoader(false);
            history.push(GetErrorHandlingRoute(e));
          });
      };

  return (
    <div>
        {isLoader ? <Loader /> : ""}
        <Row>
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
                    history.push(isRoleName(location.pathname)+"settings/adddepartment")
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
        </Row>
        <Row style={useStyles.marginrowtop}>
            <Col xs={12} sm={12} md={6} lg={3}></Col>
            {isShowLoadMoreButton ? (
                <Col xs={12} sm={12} md={6} lg={6}>
                <Button
                    onClick={() => getdepartmentcardList()}
                    variant="outlined"
                    className="cancelbtn">
                    Load more
                </Button>
                </Col>
            ) : (
                <></>
            )}
        </Row>
      
    </div>
  )
}
