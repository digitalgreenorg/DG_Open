import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import labels from '../../Constants/labels';
import { Tooltip } from '@mui/material';
import { dateTimeFormat } from '../../Utils/Common'
import Button from "@mui/material/Button";

const useStyles = {
    cardcolor: {background:"#FCFCFC", "box-shadow": "none", cursor: "pointer", height: "283px", "border-radius": "2px", width: "414px", "margin-left": "20px", "margin-top": "20px","padding-top":"50px" },
    // togglecardcolor: { "box-shadow": "0px 4px 20px rgba(216, 175, 40, 0.28)", "border": "1px solid #ebd79c", cursor: "pointer", height: "283px", width: "414px", "margin-left": "20px" },
    // marginrowtop: { "margin-top": "20px" },
    // margindescription: {"margin-left": "20px","margin-right":"20px"},
    // cardDataHeading: { "font-weight": "600", "font-size": "14px", color: "#3D4A52"},
    cardtext:{color:"#A3B0B8","font-size": "14px", 'font-family': 'Open Sans', 'font-style': 'normal', 'font-weight': 400, 'font-size': '14px', 'line-height': '19px', 'text-align': 'center', color: '#A3B0B8'},
    // datasetdescription: {"margin-left":"0px","margin-right":"0px","font-family": "Open Sans", "font-style": "normal", "font-weight": "400", "font-size": "14px", "line-height": "19px", 
    // "overflow": "hidden", "text-overflow": "ellipsis", 
    // "display": "-webkit-box",
    // "-webkit-line-clamp":"1",
    // "-webkit-box-orient": "vertical" }
    cardHeading: {"margin-top":"-15px", "background-color": "#f8f9fa", "text-align": "left", "overflow": "hidden", "text-overflow": "ellipsis", "padding-bottom":"10px"}

};

export default function NoConnectorCard(props) {

    const [screenlabels, setscreenlabels] = useState(labels['en'])

    

  return (
    <div>
        <Card style={useStyles.cardcolor}>
            
            <CardContent>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} style={{'margin-top': '20px'}}>
                        <img
                        src={require("../../Assets/Img/no_datasets.svg")}
                        alt="new"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                    <span style={useStyles.cardtext}>{screenlabels.connector.no_connector_text1}</span>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                    <span style={useStyles.cardtext}>__________________________________</span>
                    </Col>
                </Row> 
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} style={{'margin-top': '20px', 'padding': '0','padding-left': '35px', 'padding-right': '35px'}}>
                    <span style={useStyles.cardtext}>{screenlabels.connector.no_connector_text2}</span>
                    </Col>
                </Row>
                
            </CardContent>
        </Card>
    </div>
  )
}
