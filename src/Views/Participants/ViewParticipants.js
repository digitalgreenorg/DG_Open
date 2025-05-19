import React, { useState, useEffect } from 'react';
import ViewParticipantForm from '../../Components/Participants/ViewParticipantForm'
import Success from '../../Components/Success/Success'
import Delete from '../../Components/Delete/Delete'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container';
import labels from '../../Constants/labels';
import Button from "@mui/material/Button";
import THEME_COLORS from '../../Constants/ColorConstants'
import UrlConstants from '../../Constants/UrlConstants'
import HTTPService from '../../Services/HTTPService'
import { useParams } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import Loader from '../../Components/Loader/Loader';
import {GetErrorHandlingRoute} from '../../Utils/Common';
const useStyles = {
    btncolor: { color: "white", "border-color": THEME_COLORS.THEME_COLOR, "background-color": THEME_COLORS.THEME_COLOR, float: "right", "border-radius": 0 },
    btn: { width: "420px", height: "42px", "margin-top": "30px", background: "#ffffff", opacity: "0.5", border: "2px solid #c09507", color: "black" },
    marginrowtop: { "margin-top": "20px" },
    marginrowtop8px: { "margin-top": "8px" }
};
function ViewParticipants(props) {
    const [screenlabels, setscreenlabels] = useState(labels['en']);
    const [organisationname, setorganisationname] = useState("");
    const [organisationaddress, setorganisationaddress] = useState("");
    const [orginsationemail, setorginsationemail] = useState("");
    const [countryvalue, setcountryvalue] = useState("");
    const [contactnumber, setcontactnumber] = useState("");
    const [websitelink, setwebsitelink] = useState("");
    const [pincode, setpincode] = useState("");
    const [firstname, setfirstname] = useState("");
    const [lastname, setlastname] = useState("");
    const [useremail, setuseremail] = useState("");
    // const [organisationlength, setorganisationlength] = useState(3);
    const [istrusted, setistrusted] = React.useState(false);
    const [isorganisationemailerror, setisorganisationemailerror] = useState(false);
    const [iscontactnumbererror, setiscontactnumbererror] = useState(false);
    const [iswebsitelinkrerror, setwebsitelinkerror] = useState(false);
    const [isuseremailerror, setisuseremailerror] = useState(false);
    const [isSuccess, setisSuccess] = useState(true);
    const [isDelete, setisDelete] = useState(false);
    const [isDeleteCoSteward, setisDeleteCoSteward] = useState(false);
    const [isDeleteSuccess, setisDeleteSuccess] = useState(false);
    const[isLoader, setIsLoader] = useState(false)

    const history = useHistory();
    const { id } = useParams()
    useEffect(() => {
    }, []);
    const isValidURL = (string) => {
        console.log("dsvdsv", string)
        var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return (res !== null)
    };
    useEffect(() => {
        setIsLoader(true);
        HTTPService('GET', UrlConstants.base_url + UrlConstants.participant + id + '/', '', false, true).then((response) => {
            setIsLoader(false);
            console.log("otp valid", response.data);
            setorganisationname(response?.data?.organization?.name)
            setorganisationaddress(response?.data?.organization?.address?.address || JSON.parse(response?.data?.organization?.address)?.address)
            setorginsationemail(response?.data?.organization?.org_email)
            setcountryvalue(response?.data?.organization?.address?.country ||  JSON.parse(response?.data?.organization?.address)?.country)
            setcontactnumber(response?.data?.user?.phone_number)
            setwebsitelink(response?.data?.organization?.website)
            setpincode(response?.data?.organization?.address?.pincode ||  JSON.parse(response?.data?.organization?.address)?.pincode)
            setfirstname(response?.data?.user?.first_name)
            setlastname(response?.data?.user?.last_name)
            setuseremail(response?.data?.user?.email)
            // setorganisationlength(response.data.user.subscription)
            setistrusted(response?.data?.user?.approval_status)
            console.log("otp valid", response.data);
        }).catch((e) => {
            setIsLoader(false);
            history.push(GetErrorHandlingRoute(e));
        });
    }, []);
    const deleteParticipants = () => {
        setIsLoader(true);
        setisDelete(false);
        setisDeleteCoSteward(false);
        setisSuccess(false);
        setisDeleteSuccess(true)
        HTTPService('DELETE', UrlConstants.base_url + UrlConstants.participant + id + '/', "", false, true).then((response) => {
            setIsLoader(false);
            console.log("otp valid", response?.data);
            setisDeleteSuccess(true)
            setisSuccess(false)
            setisDelete(false);
        }).catch((e) => {
            setIsLoader(false);
            history.push(GetErrorHandlingRoute(e));
        });
    }
   
    console.log('view details', props)
    return (
        <>
            {isLoader ? <Loader />: ''}
            <Container style={useStyles.marginrowtop}>
                {isDelete ? <Delete
                    route={"login"}
                    imagename={'delete'}
                    firstbtntext={"Delete"}
                    secondbtntext={"Cancel"}
                    deleteEvent={() => deleteParticipants()}
                    cancelEvent={() => { setisDelete(false); setisSuccess(true); setisDeleteSuccess(false) }}
                    heading={screenlabels?.viewparticipants?.delete_participant}
                    imageText={screenlabels?.viewparticipants?.delete_msg}
                    firstmsg={screenlabels?.viewparticipants?.second_delete_msg}
                    secondmsg={screenlabels?.viewparticipants?.third_delete_msg}>
                </Delete>
                    : <></>}
                     {isDeleteCoSteward ? <Delete
                    route={"login"}
                    imagename={'delete'}
                    firstbtntext={"Delete"}
                    secondbtntext={"Cancel"}
                    deleteEvent={() => deleteParticipants()}
                    cancelEvent={() => { setisDeleteCoSteward(false); setisSuccess(true); setisDeleteSuccess(false) }}
                    heading={screenlabels.viewCoSteward.delete_coSteward}
                    imageText={screenlabels.viewCoSteward.delete_msg}
                    firstmsg={screenlabels.viewCoSteward.second_delete_msg}
                    secondmsg={screenlabels.viewCoSteward.third_delete_msg}>
                </Delete>
                    : <></>}
                {isDeleteSuccess ? <Success okevent={()=>history.push('/datahub/participants')} route={"datahub/participants"} imagename={'success'} btntext={"ok"} heading={`${ props.coSteward ? "Co-Steward deleted successfully !" : "Participant deleted successfully !"}`} imageText={"Deleted!"} msg={"You deleted a participant."}></Success> : <></>}
                {isSuccess ? <>
                    <ViewParticipantForm
                    coSteward={props.coSteward}
                        organisationname={organisationname}
                        orginsationemail={orginsationemail}
                        countryvalue={countryvalue}
                        contactnumber={contactnumber}
                        websitelink={websitelink}
                        organisationaddress={organisationaddress}
                        pincode={pincode}
                        firstname={firstname}
                        lastname={lastname}
                        useremail={useremail}
                        // organisationlength={organisationlength}
                        // istrusted={istrusted}
                    >
                    </ViewParticipantForm>
                    <Row>
                        <Col xs={12} sm={12} md={6} lg={3} >
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} >
                        {
                            props.coSteward ? <>
                            <Button onClick={() => history.push('/datahub/costeward/edit/' + id)} variant="outlined" className="editbtn">
                                Edit Co-steward
                         </Button>
                            
                            </> :
                            <Button onClick={() => history.push('/datahub/participants/edit/' + id)} variant="outlined" className="editbtn">
                            Edit Participants
                         </Button>
                        }
                        </Col>
                    </Row>
                    <Row style={useStyles.marginrowtop8px}>
                        <Col xs={12} sm={12} md={6} lg={3} >
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} >
                           

                          {
                            props.coSteward ? <>
                           <Button variant="outlined" onClick={() => { setisDeleteCoSteward(true); setisSuccess(false); setisDeleteSuccess(false) }} className="cancelbtn">
                                Delete Co-steward
                          </Button>
                            
                            </> :
                            <Button variant="outlined" onClick={() => { setisDelete(true); setisSuccess(false); setisDeleteSuccess(false) }} className="cancelbtn">
                            Delete Participants
                            </Button>
                        }

                        </Col>
                    </Row></> : <></>}
            </Container>
        </>
    );
}
export default ViewParticipants;
