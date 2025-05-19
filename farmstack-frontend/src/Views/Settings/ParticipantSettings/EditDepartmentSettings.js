import React from "react";
import { useState, useEffect } from "react";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Loader from "../../../Components/Loader/Loader";
import labels from "../../../Constants/labels";
import Success from "../../../Components/Success/Success";
import DepartmentSettingsForm from "./DepartmentSettingsForm";
import THEME_COLORS from "../../../Constants/ColorConstants";
import { useHistory, useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Button } from "@material-ui/core";
import HTTPService from "../../../Services/HTTPService";
import { GetErrorHandlingRoute, isRoleName } from "../../../Utils/Common";
import UrlConstant from "../../../Constants/UrlConstants";
import Footer from "../../../Components/Footer/Footer";
import { useParams } from "react-router-dom";

const useStyles = {
    btncolor: { color: "white", "border-color": THEME_COLORS.THEME_COLOR, "background-color": THEME_COLORS.THEME_COLOR, float: "right", "border-radius": 0 },
    marginrowtop: { "margin-top": "20px", },
    marginrowtop8px: { "margin-top": "8px" },
}
function EditDepartmentSettings(props) {
    const history = useHistory();
    const location = useLocation()
    const { id } = useParams();
    const [screenlabels, setscreenlabels] = useState(labels['en']);
    const [departmentname, setdepartmentname] = useState("");
    const [departmentdescription, setdepartmentdescription] = useState("");
    const [isLoader, setIsLoader] = useState(false);
    const [isSuccess, setisSuccess] = useState(false)


    // let Formdata= new FormData()
    // Formdata.append("organization", JSON.parse(localStorage.getItem("org_id")))
    // Formdata.append("department_name", departmentname)
    // Formdata.append("department_discription", departmentdescription)

useEffect(() => {
    setIsLoader(true);
    HTTPService(
        'GET',
        UrlConstant.base_url+ UrlConstant.department + id + '/' ,
        "",
        true,
        true).then((response) => {
            console.log(response.data)
            // console.log(response.data)
            setdepartmentname(response.data[0].department_name)
            setdepartmentdescription(response.data[0].department_discription)
            setIsLoader(false);
            //setdepartmentname(response.Formdata.department_name);
            //setdepartmentdescription(response.Formdata.department_discription)
        }).catch((error)=>{
            setIsLoader(false);
            history.push(GetErrorHandlingRoute(error));
        });
    
}, []);

      const editdepartment = () => {
        // e.preventDefault()
        let Formdata= new FormData()
    // Formdata.append("organization", )
    Formdata.append("department_name", departmentname)
    Formdata.append("department_discription", departmentdescription)
    //  console.log(Formdata.)
    setIsLoader(true);
      HTTPService(
        'PUT',
        UrlConstant.base_url+ UrlConstant.department + id + '/',
                                                //JSON.stringify
        Formdata,
        true,
        true).then((response) => {
            console.log(response)
            setisSuccess(true);
            setIsLoader(false);
        }).catch((error) => {
            console.log(error.message)
            setIsLoader(false);
            history.push(GetErrorHandlingRoute(error));

        })
    }

    const getTabNumber = () => {
        if(isRoleName(location.pathname) == '/datahub/'){
          return '6'
        } else{
          return '4'
        }
    }

    return (
        <>
            {isLoader ? <Loader /> : ''}
            <Container style={useStyles.marginrowtop}>
                {isSuccess ?
                    <Success okevent={() => history.push(isRoleName(location.pathname)+"settings/"+getTabNumber())}
                        route={isRoleName(location.pathname)+"settings/adddepartment"}
                        imagename={'success'}
                        btntext={"Ok"}
                        heading={"Department updated successfully !"}
                        imageText={"Success !"}
                        msg={"Your department details are updated"}
                    >
                    </Success> :
                    <>
                    <DepartmentSettingsForm
                        departmentname={departmentname}
                        setdepartmentname={ref => { setdepartmentname(ref) }}
                        departmentdescription={departmentdescription}
                        setdepartmentdescription={ref => { setdepartmentdescription(ref) }}
                        first_dept_heading={screenlabels.department.editheading}
                    ></DepartmentSettingsForm>
                        <Row style={useStyles.marginrowtop8px}>
                        <Col xs={12} sm={12} md={6} lg={3} >
                                </Col>
                            <Col xs={12} sm={12} md={6} lg={6} >
                                {(departmentname && departmentdescription)
                                    ? (
                                        <Button onClick={() => editdepartment()} variant="contained" className="submitbtndept">
                                            {screenlabels.common.update}
                                        </Button>
                                    ) : (
                                        <Button variant="outlined" disabled className="disbalesubmitbtndept">
                                            {screenlabels.common.update}
                                        </Button>
                                    )}
                            </Col>
                        </Row>
                        <Row style={useStyles.marginrowtop8px}>
                        <Col xs={12} sm={12} md={6} lg={3} >
                                </Col>
                            <Col xs={12} sm={12} md={6} lg={6} >
                                <Button onClick={() => history.push(isRoleName(location.pathname)+"settings/"+getTabNumber())} variant="outlined" className="cancelbtndept">
                                    {screenlabels.common.cancel}
                                </Button>
                            </Col>
                        </Row></>}
            </Container>
            {/* <Footer /> */}
        </>
    )
}
export default EditDepartmentSettings;
