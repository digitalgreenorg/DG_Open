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
import Navbar from '../Navbar/Navbar.js'
import ParticipantNavbar from '../Navbar/ParticipantNavbar'
import GuestUserNavbar from '../Navbar/GuestUserNavbar'
import LocalStorageConstants from '../../Constants/LocalStorageConstants';
import Footer from '../Footer/Footer';
import HTTPService from '../../Services/HTTPService';
import { flushLocalstorage, getErrorLocal, isLoggedInUserAdmin, isLoggedInUserParticipant, setErrorLocal } from '../../Utils/Common';
import axios from 'axios';
import NavbarNew from '../Navbar/Navbar_New';
// import Select from 'react-select'
const useStyles = {
    btncolor: { color: THEME_COLORS.THEME_COLOR, "border-color": THEME_COLORS.THEME_COLOR, "border-radius": 0 },
    marginrowtop30: { "margin-top": "30px" },
    marginrowtop35: { "margin-top": "35px" },
    marginrowtop50: { "margin-top": "50px" },
    marginrowtop70: { "margin-top": "70px" },
    marginrowtop20: { "margin-top": "20px" },
    headingbold: { fontWeight: "bold" },
    headingcolorbold: { fontWeight: "bold", color: THEME_COLORS.THEME_COLOR }
};
export default function Error(props) {
    const [screenlabels, setscreenlabels] = useState(labels["en"]);
    useEffect(() => {
        //    flushLocalstorage();
        // setErrorLocal({})
    }, []);

    return (
        <div classname="center_keeping_conatiner" style={{ width: "1440px", margin: "0 auto" }}>
            {/* {isLoggedInUserAdmin() ? <Navbar /> : (isLoggedInUserParticipant() ? <ParticipantNavbar /> :
                <GuestUserNavbar />)} */}

            {isLoggedInUserAdmin() ? <NavbarNew loginType={'admin'} /> : (isLoggedInUserParticipant() ? <NavbarNew loginType={'participant'} /> :
                <GuestUserNavbar />)}
            {/*
            <Nav id="datahubnavbar" style={{border: 'none'}}>                
                <img
                src={require("../../Assets/Img/farmstack.jpg")}
                alt="new"
                style={{ width: "139.35px", height: "18.99px", "margin-top": "26px"}}
                />
            </Nav>) */}
            <Container className='minHeightWithoutFooter'>
                <Row style={useStyles.marginrowtop70}>
                    <Col xs={12} sm={12} md={12} lg={12} >
                        <span className="mainheadingsuccess">
                            {screenlabels.error.heading} <br />
                            Error: {getErrorLocal() ? getErrorLocal().ErrorCode : 'unknown'}
                        </span>
                    </Col>
                </Row>
                <Row style={useStyles.marginrowtop30}>
                    <Col xs={12} sm={12} md={12} lg={12} >
                        <img
                            src={require('../../Assets/Img/error.png')}
                            style={{ width: '170px', height: '112px' }}
                            alt="Error"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} style={useStyles.marginrowtop35}>
                        <span className="secondmainheadingsuccess">
                            {screenlabels.error.secondmainheading}
                        </span>
                    </Col>
                </Row>
                <Row style={useStyles.marginrowtop20}>
                    <Col xs={12} sm={12} md={12} lg={12} >
                        <span className="thirdmainheadingsuccess">
                            {getErrorLocal() ? getErrorLocal().ErrorMessage : 'unknown'}<br />
                            {screenlabels.error.thirdmainheading}
                        </span>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
}