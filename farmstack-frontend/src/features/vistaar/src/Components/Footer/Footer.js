import React from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import './Footer.css'
export default function Footer(props) {
    return(
        <>
        <div style={{marginTop: '120px'}}> </div>
        <footer className="footer">
            <Row>
            <Col xs={12} sm={12} md={3} lg={3}>
            </Col>
            <Col xs={12} sm={12} md={1} lg={1}>
            {(props.disableHomeLink)? <Link className = "footerlink" to='#'>Home</Link>
             :<Link className="footerlink" to={'/'} target="_blank">Home</Link>}
            </Col>
            <Col xs={12} sm={12} md={2} lg={2}>
            <Link className="footerlink" to={{pathname: "https://farmstack.co/" }} target='_blank'>About Farmstack</Link>
            </Col>
            <Col xs={12} sm={12} md={1} lg={1}>
            {(props.disableLegalLink)?<Link className = "footerlink" to='#'>Legal</Link>
            :<Link className="footerlink" to={{pathname: "/legal" }} target='_blank'>Legal</Link>}
            </Col>
            <Col xs={12} sm={12} md={2} lg={2}>
            {(props.disableContactLink)? <Link className = "footerlink" to='#'>Contact us</Link>
            :<Link className = "footerlink" to={{pathname: "/contact" }} target='_blank'>Contact us</Link>}
            {/*<span className = "footerlink">Contact us</span>*/}
            </Col>
            <Col xs={12} sm={12} md={3} lg={3}>
            </Col>
            </Row>
        </footer>
        </>
    );
}