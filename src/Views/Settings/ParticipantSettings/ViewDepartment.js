import React from "react";
import { useState, useEffect } from "react";
import ViewDepartmentForm from "../ParticipantSettings/ViewDepartmentForm";
import labels from "../../../Constants/labels";
import Success from "../../../Components/Success/Success";
import Delete from "../../../Components/Delete/Delete";
import Row from "react-bootstrap/Row";
import Button from "@mui/material/Button";
import UrlConstant from "../../../Constants/UrlConstants";
import HTTPService from "../../../Services/HTTPService";
import { useLocation, useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Loader from "../../../Components/Loader/Loader";
import { GetErrorHandlingRoute, isRoleName } from "../../../Utils/Common";
//

function ViewDepartment(props) {
  const [screenlabels, setscreenlabels] = useState(labels["en"]);
  const [departmentname, setdepartmentname] = useState("");
  const [departmentdescription, setdepartmentdescription] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [isSuccess, setisSuccess] = useState(false);
  const [isDeleteSuccess, setisDeleteSuccess] = useState(false);
  const [isDelete, setisDelete] = useState(false);

  const history = useHistory();
  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    setIsLoader(true);
    console.log("Hello from the other side");
    console.log(id);
    HTTPService(
      "GET",
      UrlConstant.base_url + UrlConstant.department + id + "/",
      "",
      false,
      true
    )
      .then((response) => {
        setIsLoader(false);
        console.log(response, "RESPONSEEEEEEEE");
        let arr = [{ name: "shurti", desc: "xyz" }];
        console.log(arr[0].name);
        setdepartmentname(response.data[0].department_name);
        setdepartmentdescription(response.data[0].department_discription);
        setisSuccess(true);
      })
      .catch((e) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(e));
      });
  }, []);

  const deleteDepartment = () => {
    setIsLoader(true);
    setisDelete(false);
    setisSuccess(false);
    setisDeleteSuccess(true);
    HTTPService(
      "DELETE",
      UrlConstant.base_url + UrlConstant.department + id + "/",
      "",
      false,
      true
    )
      .then((response) => {
        console.log(response);
        setIsLoader(false);
        setisDeleteSuccess(true);
        // setisSuccess(true)
        setisDelete(false);
      })
      .catch((error) => {
        setIsLoader(false);
        history.push(GetErrorHandlingRoute(error));
      });
  };

  const getTabNumber = () => {
    if (isRoleName(location.pathname) == "/datahub/") {
      return "6";
    } else {
      return "4";
    }
  };

  return (
    <>
      <div>
        {isLoader ? <Loader /> : ""}
        <div>
          {isDelete ? (
            <Delete
              route={"login"}
              imagename={"delete"}
              firstbtntext={"Delete"}
              secondbtntext={"Cancel"}
              deleteEvent={() => deleteDepartment()}
              cancelEvent={() => {
                setisDelete(false);
                setisDeleteSuccess(false);
                history.push(
                  isRoleName(location.pathname) + "settings/" + getTabNumber()
                );
              }}
              heading={screenlabels.department.delete_department}
              imageText={screenlabels.department.delete_msg}
              msg={screenlabels.department.second_delete_msg}
              firstmsg={screenlabels.department.second_delete_msg}
              secondmsg={screenlabels.department.third_delete_msg}
            ></Delete>
          ) : (
            <></>
          )}
          {isDeleteSuccess ? (
            <Success
              okevent={() =>
                history.push(
                  isRoleName(location.pathname) + "settings/" + getTabNumber()
                )
              }
              imagename={"success"}
              btntext={"ok"}
              heading={"Your department deleted successfully!"}
              imageText={"Success!"}
              msg={"You deleted a department."}
            ></Success>
          ) : (
            <></>
          )}
          {isSuccess ? (
            <>
              <ViewDepartmentForm
                departmentname={departmentname}
                //setdepartmentname={ref => { setdepartmentname(ref) }}
                departmentdescription={departmentdescription}
                // setdepartmentdescription={ref => { setdepartmentdescription(ref) }}
              ></ViewDepartmentForm>
              <Row style={{ "margin-left": "550px", "margin-top": "50px" }}>
                {/* <Col xs={12} sm={12} md={6} ls={3}> */}
                {/* // </Col> */}
                {/* <Col xs={12} sm={12} md={6} ls={4}> */}
                <Button
                  onClick={() =>
                    history.push(
                      isRoleName(location.pathname) +
                        "settings/editdepartment/" +
                        id
                    )
                  }
                  variant="outlined"
                  className="editbtn"
                >
                  <span style={{ "text-align": "center" }}>
                    Edit department
                  </span>
                </Button>
                {/* </Col> */}
              </Row>
              <Row style={{ "margin-left": "550px" }}>
                {/* <Col xs={12} sm={12} md={6} ls={3}>
                </Col> */}
                {/* <Col xs={12} sm={12} md={6} ls={6}> */}
                <Button
                  onClick={() => {
                    setisDelete(true);
                    setisSuccess(false);
                    setisDeleteSuccess(false);
                  }}
                  variant="outlined"
                  className="cancelbtn"
                >
                  Delete department
                </Button>
                {/* </Col> */}
              </Row>
            </>
          ) : (
            <></>
          )}
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
}
export default ViewDepartment;
