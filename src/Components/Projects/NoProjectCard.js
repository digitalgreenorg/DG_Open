import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import labels from '../../Constants/labels';

const useStyles = {
    cardcolor: {background:"#FCFCFC", "box-shadow": "none", height: "225px", "border-radius": "2px", width: "346px", "margin-left": "20px", "margin-top": "20px","padding-top":"50px" },
    cardtext:{color:"#A3B0B8","font-size": "14px", 'font-family': 'Open Sans', 'font-style': 'normal', 'font-weight': 400, 'font-size': '14px', 'line-height': '19px', 'text-align': 'center', color: '#A3B0B8'},
    cardHeading: {"margin-top":"-15px", "background-color": "#f8f9fa", "text-align": "left", "overflow": "hidden", "text-overflow": "ellipsis", "padding-bottom":"10px"}

};

export default function NoProjectCard(props) {

    const [screenlabels, setscreenlabels] = useState(labels['en'])

    

  return (
    <div>
        <Card style={useStyles.cardcolor}>
            
            <CardContent>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} style={{'margin-top': '-15px'}}>
                        <img
                        src={require("../../Assets/Img/no_datasets.svg")}
                        alt="new"
                        />
                    </Col>
                </Row>
                <Row style={{"margin-top":"10px"}}>
                    <Col xs={12} sm={12} md={12} lg={12}>
                    <span style={useStyles.cardtext}>{screenlabels.project.no_project_text1}</span>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                    <span style={useStyles.cardtext}>__________________________________</span>
                    </Col>
                </Row> 
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12} style={{'margin-top': '20px', 'padding': '0','padding-left': '35px', 'padding-right': '35px'}}>
                    <span style={useStyles.cardtext}>{screenlabels.project.no_project_text2}</span>
                    </Col>
                </Row>
                
            </CardContent>
        </Card>
    </div>
  )
}
