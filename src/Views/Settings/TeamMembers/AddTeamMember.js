import React, { useState, useEffect } from 'react';
import AddMemberForm from '../../../Components/Settings/TeamMember/AddMemberForm'
import Success from '../../../Components/Success/Success'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container';
import labels from '../../../Constants/labels';
import Button from "@mui/material/Button";
import THEME_COLORS from '../../../Constants/ColorConstants'
import HTTPService from '../../../Services/HTTPService'
import UrlConstants from '../../../Constants/UrlConstants'
import validator from "validator";
import { useHistory } from "react-router-dom";
import Loader from '../../../Components/Loader/Loader';
import { GetErrorHandlingRoute, GetErrorKey } from '../../../Utils/Common';
const useStyles = {
    btncolor: { color: "white", "border-color": THEME_COLORS.THEME_COLOR, "background-color": THEME_COLORS.THEME_COLOR, float: "right", "border-radius": 0 , "box-shadow": "none"},
    marginrowtop: { "margin-top": "40px", "font-family": "Open Sans", "width": "1300px", "height": "893px"}, 
    marginrowtop8px: { "margin-top": "8px" },
};
function AddTeamMember(props) {
    const history = useHistory();
    const [screenlabels, setscreenlabels] = useState(labels['en']);
    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [useremail, setuseremail] = useState("");
    const [userrole, setuserrole] = useState("");
    const [isuseremailerror, setisuseremailerror] = useState(false);
    const [isexistinguseremail, setisexisitinguseremail] =useState(false)
    const [isSuccess, setisSuccess] = useState(false);
    const[isLoader, setIsLoader] = useState(false)

    const[firstNameErrorMessage, setFirstNameErrorMessage] = useState(null)
    const[lastNameErrorMessage,setLastNameErrorMessage] = useState(null)
    const[emailErrorMessage, setEmailErrorMessage] = useState(null)
    const[roleErrorMessage, setRoleErrorMessage] = useState(null)

    const addNewMember = () => {

        setFirstNameErrorMessage(null)
        setLastNameErrorMessage(null)
        setEmailErrorMessage(null)
        setRoleErrorMessage(null)

        // var bodyFormData = new FormData();
        // bodyFormData.append('first_name', firstname);
        // bodyFormData.append('last_name', lastname);
        // bodyFormData.append('email', useremail);
        // bodyFormData.append('role', userrole);
        let data={
            'first_name':firstname,
            'last_name': lastname,
            'email':useremail.toLowerCase(),
            'role':userrole
        }
        setIsLoader(true);
        HTTPService('POST', UrlConstants.base_url + UrlConstants.team_member, data, false, true).then((response) => {
            setisSuccess(true);
            setIsLoader(false);
        }).catch((e) => {
            setIsLoader(false);
            //history.push(GetErrorHandlingRoute(e));
            var returnValues = GetErrorKey(e, Object.keys(data))
            var errorKeys = returnValues[0]
            var errorMessages = returnValues[1]
            if (errorKeys.length > 0){
                for (var i=0; i<errorKeys.length; i++){
                    switch(errorKeys[i]){
                    case "first_name": setFirstNameErrorMessage(errorMessages[i]); break;
                    case "last_name": setLastNameErrorMessage(errorMessages[i]); break;
                    case "email": setEmailErrorMessage(errorMessages[i]); break;
                    case "role": setRoleErrorMessage(errorMessages[i]); break;
                    default: history.push(GetErrorHandlingRoute(e)); break;
                    }
                }
            }
            else{
            history.push(GetErrorHandlingRoute(e))
            }
                //setisexisitinguseremail(true)
        });
    }
    return (
        
        <>
            {isLoader ? <Loader />: ''}
            <Container style={useStyles.marginrowtop}>
                {isSuccess ? <Success okevent={()=>history.push('/datahub/settings/4')} route={"datahub/settings"} imagename={'success'} btntext={"ok"} heading={"Team Member added successfully !"} imageText={"Success!"} msg={"You added a team member."}></Success> : 
                <><AddMemberForm
                    firstname={firstname}
                    setfirstname={ref => { setfirstname(ref) }}
                    lastname={lastname}
                    setlastname={ref => { setlastname(ref) }}
                    useremail={useremail}
                    setuseremail={ref => { setuseremail(ref); setisuseremailerror(!validator.isEmail(ref)); setisexisitinguseremail(false) }}
                    isuseremailerror={isuseremailerror}
                    isexistinguseremail={isexistinguseremail}
                    userrole={userrole}
                    setuserrole={ref => { setuserrole(ref) }}
                    first_heading={screenlabels.settings.heading}
                    firstNameErrorMessage={firstNameErrorMessage}
                    lastNameErrorMessage={lastNameErrorMessage}
                    emailErrorMessage={emailErrorMessage}
                    roleErrorMessage={roleErrorMessage}
                >
                </AddMemberForm>
                    <Row style={useStyles.marginrowtop8px}>
                        <Col xs={12} sm={12} md={6} lg={3} >
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} >
                            {(firstname && useremail && !isuseremailerror && userrole)
                                ? (
                                    <Button onClick={() => addNewMember()} style={{textTransform:"none"}} variant="contained" className="submitbtnteam">
                                        {screenlabels.common.submit}
                                    </Button>
                                ) : (
                                    <Button variant="outlined" style={{textTransform:"none"}} disabled className="disbalesubmitbtnteam">
                                        {screenlabels.common.submit}
                                    </Button>
                                )}
                        </Col>
                    </Row>
                    <Row style={useStyles.marginrowtop8px}>
                        <Col xs={12} sm={12} md={6} lg={3} >
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} >
                            <Button onClick={() => history.push('/datahub/settings/4')} style={{textTransform:"none"}} variant="outlined" className="cancelbtnteam">
                                {screenlabels.common.cancel}
                            </Button>
                        </Col>
                    </Row></>}
            </Container>
        </>
    );
}
export default AddTeamMember;
