import React, { useState, useMemo } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import labels from '../../Constants/labels';
import countryList from "react-select-country-list";
import { useHistory } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { Zoom } from '@material-ui/core';
// import Select from 'react-select'
const useStyles = {
    data: { float: "left","margin-top": "5px" },
    left: {float: "left", "text-align": "left"},
    marginrowtop: {"margin-top": "40px" },
    headingbold:{fontWeight: "bold"},
    fourthhead:{float: 'left', 'margin-left': '700px', 'margin-top': '-27px'},
    Fourthhead:{float: 'right', 'margin-right': '383px', 'margin-top': '17px'}

};
export default function ViewParticipantForm(props) {
    const [screenlabels, setscreenlabels] = useState(labels['en']);
    const options = useMemo(() => countryList().getData(), [])
    const history = useHistory();
    // console.log('props in view details', props)

    console.log('view details', props)
    return (
        <>
            <Row style={useStyles.marginrowtop}>
                <Col xs={12} sm={12} md={12} lg={12} style={useStyles.left}>
                <div class="link" onClick={()=> history.push('/datahub/participants' +
                  `?costeward=${props.coSteward == true}`)}>
                <img
                    src={require('../../Assets/Img/back.svg')}
                    alt="new"
                    style={{width: '16px', height: '16px'}}
                />&nbsp;&nbsp;&nbsp;
                    <span className="backlabel">
                        {screenlabels.common.back}
                    </span>
                </div>
                </Col>
            </Row>
            <hr style={{'margin-left' : '-200px', 'margin-right' : '-200px','margin-top' : '20px', 'border-top': '1px solid rgba(238, 238, 238, 0.5)'}}/>
            <Row style={useStyles.marginrowtop}>
                <Col xs={12} sm={12} md={12} lg={12} style={useStyles.left}>
                    <span  className="mainheading">
                        {props.coSteward ? screenlabels.viewCoSteward.first_heading : screenlabels.viewparticipants.first_heading}
                    </span>
                </Col>
            </Row>
            <Row style={useStyles.marginrowtop}>
                <Col xs={12} sm={12} md={4} lg={4} style={{textAlign:"left"}}>
                        <span className="secondmainheading" style={useStyles.left}>
                        {screenlabels.viewparticipants.organisation_name}
                        </span><br />
                        <Tooltip placement='bottom-start' TransitionComponent={Zoom} title={props.organisationname}>

                        <span className="thirdmainheading d-inline-block text-truncate width300px_mt5px" >
                            {props.organisationname}
                        </span>
                        </Tooltip>

                </Col>
                <Col xs={12} sm={12} md={4} lg={4} style={{textAlign:"left"}}>
                    
                        <span className="secondmainheading" style={useStyles.left}>
                        {screenlabels.viewparticipants.website_link}
                        </span><br />
                        <Tooltip placement='bottom-start' TransitionComponent={Zoom} title={props.websitelink}>

                        <span className="thirdmainheading d-inline-block text-truncate width300px_mt5px">
                            {props.websitelink}
                        </span>
                        </Tooltip>


                </Col>
                <Col xs={12} sm={12} md={4} lg={4} style={{textAlign:"left"}}>
                    <span className="secondmainheading" style={useStyles.left}>
                    {screenlabels.viewparticipants.email}
                    </span><br />
                    <Tooltip placement='bottom-start' TransitionComponent={Zoom} title={props.orginsationemail}>

                    <span className="thirdmainheading d-inline-block text-truncate width300px_mt5px">
                        {props.orginsationemail}
                    </span>
                    </Tooltip>

                </Col>
            </Row>
            <Row style={useStyles.marginrowtop}>
                <Col xs={12} sm={12} md={4} lg={4} style={{textAlign:"left"}}>
                    <span className="secondmainheading" style={useStyles.left}>
                    {screenlabels.viewparticipants.organisation_address}
                    </span><br />
                    <Tooltip placement='bottom-start' TransitionComponent={Zoom} title={props.organisationaddress}>

                    <span className="thirdmainheading d-inline-block text-truncate width300px_mt5px" >
                        {props.organisationaddress}
                    </span>
                    </Tooltip>

                </Col>
                <Col xs={12} sm={12} md={4} lg={4} style={{textAlign:"left"}}>
                        <span className="secondmainheading" style={useStyles.left}>
                        {screenlabels.viewparticipants.country}
                        </span><br />
                    <Tooltip placement='bottom-start' TransitionComponent={Zoom} title={props.countryvalue}>

                        <span className="thirdmainheading d-inline-block text-truncate width300px_mt5px" >
                            {props.countryvalue}
                        </span>
                    </Tooltip>

                </Col>
                <Col xs={12} sm={12} md={4} lg={4} style={{textAlign:"left"}}>
                    <span className="secondmainheading" style={useStyles.left}>
                    {screenlabels.viewparticipants.pincode}
                    </span><br />
                    <Tooltip placement='bottom-start' TransitionComponent={Zoom} title={props.pincode}>

                    <span className="thirdmainheading d-inline-block text-truncate width300px_mt5px" >
                        {props.pincode}
                    </span>
                    </Tooltip>

                </Col>
            </Row>
            <hr className="separatorline"/>
            <Row style={useStyles.marginrowtop}>
                <Col xs={12} sm={12} md={12} lg={12} style={useStyles.left}>
                <span className="mainheading">
                    { props.coSteward ? screenlabels.viewCoSteward.second_heading : screenlabels.viewparticipants.second_heading}
                </span>
                </Col>
            </Row>

            <Row style={useStyles.marginrowtop}>
                <Col xs={12} sm={12} md={4} lg={4} style={{textAlign:"left"}}>
                        <span className="secondmainheading" style={useStyles.left}>
                        {screenlabels.viewparticipants.first_name}
                        </span><br />
                    <Tooltip placement='bottom-start' TransitionComponent={Zoom} title={props.firstname}>

                        <span className="thirdmainheading d-inline-block text-truncate width300px_mt5px" >
                            {props.firstname}
                        </span>
                    </Tooltip>

                        
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} style={{textAlign:"left"}}>
                    <span className="secondmainheading" style={useStyles.left}>
                    {screenlabels.viewparticipants.last_name}
                    </span><br />
                    <Tooltip placement='bottom-start' TransitionComponent={Zoom} title={props.lastname}>

                    <span className="thirdmainheading d-inline-block text-truncate width300px_mt5px" >
                        {props.lastname}
                    </span>
                    </Tooltip>

                </Col>
                <Col xs={12} sm={12} md={4} lg={4} style={{textAlign:"left"}}>
                    <span className="secondmainheading" style={useStyles.left}>
                    {screenlabels.viewparticipants.email}
                    </span><br />
                    <Tooltip placement='bottom-start' TransitionComponent={Zoom} title={props.useremail}>

                    <span className="thirdmainheading d-inline-block text-truncate width300px_mt5px" >
                        {props.useremail}
                    </span>
                    </Tooltip>

                </Col>
            </Row>
            <Row style={useStyles.marginrowtop}>
                
                <Col xs={12} sm={12} md={4} lg={4} style={{textAlign:"left"}}>
                    <span className="secondmainheading" style={useStyles.left}>
                    {screenlabels.viewparticipants.contact_number}
                    </span><br />
                    <Tooltip placement='bottom-start' TransitionComponent={Zoom} title={props.contactnumber}>

                    <span className="thirdmainheading d-inline-block text-truncate width300px_mt5px" >
                        {props.contactnumber}
                    </span>
                    </Tooltip>

                </Col>
            </Row>
            {/* <hr className="separatorline"/> */}
            {/* <Row style={useStyles.marginrowtop}> */}
                {/* <Col xs={12} sm={12} md={12} lg={12}  style={useStyles.left}>
                    <span className="mainheading" style={{"margin-top": "-37px"}}>
                        {screenlabels.viewparticipants.third_heading}
                    </span>
                </Col> */}
                {/* <Col xs={12} sm={12} md={12} lg={12} style={{"float":"left", "text-align":"left", "margin-top":"-32px"}}>
                <span className="mainheading" style={{"margin-top": "-37px"}}>
                    {screenlabels.viewparticipants.fourth_heading}
                </span>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} style={useStyles.left}>
                    <span className="thirdmainheading d-inline-block text-truncate width300px_mt5px">
                    {props.istrusted ? "Yes" : "No"}
                </span>
                </Col>
                
            </Row> */}
            {/* <Row style={useStyles.marginrowtop}> */}
                {/* <Col xs={12} sm={12} md={12} lg={12} style={useStyles.left}>
                    <span className="secondmainheading" style={{"float":"left", "text-align":"left", "margin-top":"-62px"}}>
                    {screenlabels.viewparticipants.subscripiton_length}
                    </span>
                </Col><br />
                <Col xs={12} sm={12} md={12} lg={12} style={{"float":"left", "text-align":"left", "margin-top":"-62px"}}>
                <Tooltip placement='bottom-start' TransitionComponent={Zoom} title={props.organisationlength+" Months"}>

                    <span className="thirdmainheading d-inline-block text-truncate width300px_mt5px">
                        {props.organisationlength+" Months"}
                    </span>
                    </Tooltip>

                </Col> */}
            {/* </Row> */}
            <hr className="separatorline"/>
        </>
    );
}
