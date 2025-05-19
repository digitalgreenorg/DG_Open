import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import THEME_COLORS from '../../Constants/ColorConstants'
import labels from '../../Constants/labels';
import { Tooltip } from '@mui/material';
import Button from "@mui/material/Button";
import { useHistory, useLocation } from 'react-router-dom';
import { isRoleName } from '../../Utils/Common';

const useStyles = {
    btncolor: { color: THEME_COLORS.THEME_COLOR, "border-color": THEME_COLORS.THEME_COLOR, "border-radius": 0, "text-transform": "none", "font-weight": "400", "font-size": "14px" },
    cardcolor: { border: "1px solid #E4E4E4", "box-shadow": "none", cursor: "pointer", height: "225px", "border-radius": "2px", width: "346px", "margin-left": "20px", "margin-top":"20px"},
    togglecardcolor: { "box-shadow": "0px 4px 20px rgba(216, 175, 40, 0.28)", "border": "1px solid #ebd79c", cursor: "pointer", height: "225px", width: "346px", "margin-left": "20px", "margin-top":"20px"},
    cardData: { "font-weight": 400, "font-size": "14px", color: "#3D4A52" },
    cardHeading: {"margin-top":"-15px", "background-color": "#f8f9fa", "text-align": "left", "overflow": "hidden", "text-overflow": "ellipsis"},
    cardHeading2: {"margin-top":"-15px", "background-color": "#f8f9fa", "text-align": "left", "overflow": "hidden", "text-overflow": "ellipsis", "padding-bottom":"10px"},
    left_align: {"text-align":"left"}

};

export default function ProjectCard(props) {

    const [isshowbutton, setisshowbutton] = useState(false)
    const [screenlabels, setscreenlabels] = useState(labels['en'])
    const history = useHistory()
    const location = useLocation()

  return (
    <div>
        <Card className={props.margingtop} style={!isshowbutton ? useStyles.cardcolor : useStyles.togglecardcolor} onMouseEnter={() => setisshowbutton(true)} onMouseLeave={() => setisshowbutton(false)}>
            <CardContent>
                 <Row style={useStyles.cardHeading}>
                    <Col className="fontweight600andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                        {screenlabels.project.department}
                    </Col>
                    <Col style={{"text-align":"left","margin-left":"60px","font-size":"14px","font-weight":"600","text-transform": "none" }} className="fontweight400andfontsize14pxandcolor3D4A52 supportcardsecondcolumn">
                        {screenlabels.project.project}
                    </Col>
                </Row>
                {/* <Row className="supportcardmargintop"> */}
                <Row style={useStyles.cardHeading2}>
                    <Tooltip title={props.departmentName}>
                    <Col className="fontweight600andfontsize14pxandcolor3D4A52 cardConnectorName">
                        {props.departmentName}
                        {/* Connector_P1 */}
                    </Col>
                    </Tooltip>
                    <Tooltip title={props.projectName}>
                    <Col style ={{"text-align":"left","margin-left":"50px"}} className="fontweight600andfontsize14pxandcolor3D4A52 cardProjectName">
                        {props.projectName}
                        {/* Provider */}
                    </Col>
                    </Tooltip>
                </Row>
                <Row>
                    <Col className="fontweight600andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                        {screenlabels.project.description}
                    </Col>
                    {/* <Col style={{"text-align":"left","margin-left":"60px","font-size":"14px","font-weight":"400","text-transform": "none" }} className="fontweight400andfontsize14pxandcolor3D4A52 supportcardsecondcolumn">
                        {screenlabels.connector.department_name}
                    </Col> */}
                </Row>
                <Row className="supportcardmargintop">
                    <Tooltip title={props.description}>
                    <Col className="fontweight600andfontsize14pxandcolor3D4A52 cardConnectorName">
                        {props.description}
                        {/* Sample_Project */}
                    </Col>
                    </Tooltip>
                    {/* <Tooltip title={props.departmentName}>
                    <Col style ={{"text-align":"left","margin-left":"53px"}} className="fontweight600andfontsize14pxandcolor3D4A52 cardConnectorName">
                        {props.departmentName}
                    </Col>
                    </Tooltip> */}
                </Row>
                <Row style={{"margin-top":"0px"}}>
                    {isshowbutton ? 
                    <Col className="fontweight600andfontsize14pxandcolor3D4A52 supportcardsecondcolumn">
                        <Button 
                        onClick={() => history.push(isRoleName(location.pathname)+'settings/viewproject/' + props.id)} 
                        variant="outlined" style={useStyles.btncolor}>
                            View details
                        </Button>
                    </Col>     : <></>}
                    </Row>
               
            </CardContent>
        </Card>
    </div>
  )
}
