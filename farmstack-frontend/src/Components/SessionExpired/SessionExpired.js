import React, { useState, useMemo, useEffect } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from "@mui/material/Button";
import THEME_COLORS from '../../Constants/ColorConstants'
import { useHistory } from "react-router-dom";
import labels from '../../Constants/labels';
import { Container } from 'react-bootstrap';
import { Nav } from '../Navbar/NavbarElements';
import './../Navbar/Navbar.css'
import LocalStorageConstants from '../../Constants/LocalStorageConstants';
import { flushLocalstorage, isLoggedInUserAdmin, isLoggedInUserParticipant } from '../../Utils/Common';
import Footer from '../Footer/Footer';
// import Select from 'react-select'
const useStyles = {
    btncolor: {color: THEME_COLORS.THEME_COLOR, "border-color": THEME_COLORS.THEME_COLOR, "border-radius": 0},
    marginrowtop30: {"margin-top": "30px"},
    marginrowtop35: {"margin-top": "35px"},
    marginrowtop50: {"margin-top": "50px"},
    marginrowtop70: {"margin-top": "70px"},
    marginrowtop20: {"margin-top": "20px"},
    headingbold:{fontWeight: "bold"},
    headingcolorbold:{fontWeight: "bold",color: THEME_COLORS.THEME_COLOR}
};
export default function SessionExpired(props) {
    const [screenlabels, setscreenlabels] = useState(labels["en"]);
    const history = useHistory();

    useEffect(() => {
        flushLocalstorage();
    }, [])
    
    return (
        <div className='center_keeping_conatiner'>
            <Nav id="datahubnavbar" style={{border: 'none'}}>
            {/* <Bars /> */}
                <img
                src={require("../../Assets/Img/farmstack.jpg")}
                alt="new"
                style={{ width: "139.35px", height: "18.99px", "margin-top": "26px"}}
                />
            </Nav>
            <Container className='minHeightWithoutFooter'>
                <Row style={useStyles.marginrowtop70}>
                    <Col xs={12} sm={12} md={12} lg={12} >
                        <span className="mainheadingsuccess">
                            {screenlabels.sessiontimeout.heading}
                        </span>
                    </Col>
                </Row>
                <Row style={useStyles.marginrowtop30}>
                    <Col xs={12} sm={12} md={12} lg={12} >
                        <img
                            src={require('../../Assets/Img/session_expired.png')}
                            style={{width: '170px', height: '112px'}}
                            alt="Session Timeout"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} style={useStyles.marginrowtop35}>
                        <span className="secondmainheadingsuccess">
                        {screenlabels.sessiontimeout.secondmainheading}
                        </span>
                    </Col>
                </Row>
                <Row style={useStyles.marginrowtop30}>
                    <Col xs={12} sm={12} md={12} lg={12} >
                        <span className="thirdmainheadingsuccess">
                        {screenlabels.sessiontimeout.thirdmainheading}
                        </span>
                    </Col>
                </Row>
                <Row style={useStyles.marginrowtop70}>
                    <Col xs={12} sm={12} md={12} lg={12} >
                        <Button  onClick={()=> history.push("/home")} variant="contained" className="submitbtn">
                            <span>Sign in</span>
                        </Button>
                    </Col>
                </Row>
            </Container>
                <Footer/>
        </div>
    );
}
