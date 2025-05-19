import React, { useState, useMemo } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import countryList from "react-select-country-list";
import { useHistory } from 'react-router-dom';
import { Avatar, Tooltip } from '@mui/material';
import { Zoom } from '@material-ui/core';
import labels from '../../../Constants/labels';
import { Container } from 'react-bootstrap';
import parse from "html-react-parser";
import UrlConstant from '../../../Constants/UrlConstants';

// import Select from 'react-select'
const useStyles = {
    data: { float: "left", "margin-top": "5px" },
    left: { float: "left", "text-align": "left" },
    marginrowtop: { "margin-top": "40px" },
    headingbold: { fontWeight: "bold" },
    fourthhead: { float: 'left', 'margin-left': '700px', 'margin-top': '-27px' },
    Fourthhead: { float: 'right', 'margin-right': '383px', 'margin-top': '17px' }

};
export default function ViewDetail(props) {
    const [screenlabels, setscreenlabels] = useState(labels['en']);
    // const options = useMemo(() => countryList().getData(), [])
    const history = useHistory();
    // console.log('props in view details', props)

    console.log('view details', props)
    console.log(props)
    return (
        <Container>
            <Row style={useStyles.marginrowtop}>
                <Col xs={12} sm={12} md={12} lg={12} style={useStyles.left}>
                    <div class="link" onClick={() => props.setIsViewDetails(false)}>
                        <img
                            src={require('../../../Assets/Img/back.svg')}
                            alt="new"
                            style={{ width: '16px', height: '16px' }}
                        />&nbsp;&nbsp;&nbsp;
                        <span className="backlabel">
                            {screenlabels.common.back}
                        </span>
                    </div>
                </Col>
            </Row>
            <hr style={{ 'margin-left': '-200px', 'margin-right': '-200px', 'margin-top': '20px', 'border-top': '1px solid rgba(238, 238, 238, 0.5)' }} />
            <Row style={useStyles.marginrowtop}>
                <Col xs={12} sm={12} md={12} lg={12} style={useStyles.left}>
                    <span className="mainheading">
                        {/* {props.coSteward ? screenlabels.viewCoSteward.first_heading : screenlabels.viewparticipants.first_heading} */}
                    </span>
                </Col>
            </Row>
            <Row>
                {Object.keys(props.viewDetailData.organization).map((each, index) => {
                    if (each !== "address" && each != "" && each != "id" && each != "org_description") {
                        return <Col xs={12} sm={12} md={12} lg={3} style={{ textAlign: "left", padding: "20px 0px", textOverflow: "clip" }}>
                            <div style={{ textTransform: "capitalize" }}>{each ? each : ""}</div>
                            {each == "logo" ?
                                <div style={{ maxWidth: "200px", overflowWrap: "anywhere" }}>
                                    {console.log(UrlConstant.base_url_without_slash + props?.viewDetailData?.organization[each])}
                                    {props?.viewDetailData?.organization[each] ? <Avatar sx={{ width: 100, height: 100 }} alt="Remy Sharp" src={UrlConstant.base_url_without_slash + props?.viewDetailData?.organization[each]} /> : "NA"}
                                </div> :
                                <div style={{ maxWidth: "200px", overflowWrap: "anywhere" }}>
                                    {props?.viewDetailData?.organization[each] ? ` ${props?.viewDetailData?.organization[each]}` : "NA"}
                                </div>}
                        </Col>
                    }
                })}
            </Row>


            <hr className="separatorline" />
        </Container>
    );
}
