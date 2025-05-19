import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import THEME_COLORS from '../../Constants/ColorConstants'
import labels from '../../Constants/labels';
import { Tooltip } from '@mui/material';
import { dateTimeFormat } from '../../Utils/Common'
import Button from "@mui/material/Button";

const useStyles = {
    btncolor: { color: THEME_COLORS.THEME_COLOR, "border-color": THEME_COLORS.THEME_COLOR, "border-radius": 0, "text-transform": "none", "font-weight": "400", "font-size": "14px" },
    cardcolor: { border: "1px solid #E4E4E4", "box-shadow": "none", cursor: "pointer", height: "283px", "border-radius": "2px", width: "414px", "margin-left": "20px" },
    togglecardcolor: { "box-shadow": "0px 4px 20px rgba(216, 175, 40, 0.28)", "border": "1px solid #ebd79c", cursor: "pointer", height: "283px", width: "414px", "margin-left": "20px" },
    // marginrowtop: { "margin-top": "20px" },
    // margindescription: {"margin-left": "20px","margin-right":"20px"},
    // cardDataHeading: { "font-weight": "600", "font-size": "14px", color: "#3D4A52"},
    cardData: { "font-weight": 400, "font-size": "14px", color: "#3D4A52" },
    // datasetdescription: {"margin-left":"0px","margin-right":"0px","font-family": "Open Sans", "font-style": "normal", "font-weight": "400", "font-size": "14px", "line-height": "19px", 
    // "overflow": "hidden", "text-overflow": "ellipsis", 
    // "display": "-webkit-box",
    // "-webkit-line-clamp":"1",
    // "-webkit-box-orient": "vertical" }
    cardHeading: {"margin-top":"-15px", "background-color": "#f8f9fa", "text-align": "left", "overflow": "hidden", "text-overflow": "ellipsis"},
    cardHeading2: {"margin-top":"-15px", "background-color": "#f8f9fa", "text-align": "left", "overflow": "hidden", "text-overflow": "ellipsis", "padding-bottom":"10px"},
    left_align: {"text-align":"left"}

};

export default function ConnectorCard(props) {

    const [isshowbutton, setisshowbutton] = useState(false)
    const [screenlabels, setscreenlabels] = useState(labels['en'])

  return (
    <div>
        <Card className={props.margingtop} style={!isshowbutton ? useStyles.cardcolor : useStyles.togglecardcolor} onMouseEnter={() => setisshowbutton(true)} onMouseLeave={() => setisshowbutton(false)}>
            {/* <Tooltip title={props.title}>
            <CardHeader
                // avatar={
                //     props.orgLogo ? <Avatar alt="Remy Sharp" src={UrlConstants.base_url_without_slash + props.orgLogo} sx={{ width: 54, height: 54 }} /> :
                //         <Avatar sx={{ bgcolor: "#c09507", width: 54, height: 54 }} aria-label="recipe">{props.orgName.charAt(0)}</Avatar>
                // }
                // title={props.data.subject}
                // tooltip={<Tooltip title={props.title}>{props.title}</Tooltip>}
                
                title="Connector Name"
                style={{ "background-color": "#f8f9fa", padding: "9px", "text-align": "left", "overflow": "hidden", "text-overflow": "ellipsis"}}
            />
            </Tooltip> */}
            <CardContent>
                 <Row style={useStyles.cardHeading}>
                    <Col className="fontweight400andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                        {screenlabels.connector.connector_name}
                    </Col>
                    <Col style={{"text-align":"left","margin-left":"60px","font-size":"14px","font-weight":"400","text-transform": "none" }} className="fontweight400andfontsize14pxandcolor3D4A52 supportcardsecondcolumn">
                        {screenlabels.connector.connector_type}
                    </Col>
                </Row>
                {/* <Row className="supportcardmargintop"> */}
                <Row style={useStyles.cardHeading2}>
                    <Tooltip title={props.connectorName}>
                    <Col className="fontweight600andfontsize14pxandcolor3D4A52 cardConnectorName">
                        {props.connectorName}
                        {/* Connector_P1 */}
                    </Col>
                    </Tooltip>
                    <Col style ={{"text-align":"left","margin-left":"60px"}} className="fontweight600andfontsize14pxandcolor3D4A52 supportcardsecondcolumn">
                        {props.connectorType}
                        {/* Provider */}
                    </Col>
                </Row>
                <Row>
                    <Col className="fontweight400andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                        {screenlabels.connector.project_name}
                    </Col>
                    <Col style={{"text-align":"left","margin-left":"60px","font-size":"14px","font-weight":"400","text-transform": "none" }} className="fontweight400andfontsize14pxandcolor3D4A52 supportcardsecondcolumn">
                        {screenlabels.connector.department_name}
                    </Col>
                </Row>
                <Row className="supportcardmargintop">
                    <Tooltip title={props.projectName}>
                    <Col className="fontweight600andfontsize14pxandcolor3D4A52 cardConnectorName">
                        {props.projectName}
                        {/* Sample_Project */}
                    </Col>
                    </Tooltip>
                    <Tooltip title={props.departmentName}>
                    <Col style ={{"text-align":"left","margin-left":"53px"}} className="fontweight600andfontsize14pxandcolor3D4A52 cardConnectorName">
                        {props.departmentName}
                        {/* sample Department */}
                    </Col>
                    </Tooltip>
                </Row>
                <Row>
                    <Col className="fontweight400andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                       {screenlabels.connector.status} 
                    </Col>
                </Row>
                <Row className="supportcardmargintop">
                    <Col className="fontweight600andfontsize14pxandcolor3D4A52 supportcardfirstcolumn">
                        <span style={{"margin-left":"-15px"}} className="fontweight600andfontsize14pxandcolor3D4A52 supportfilterheadingtext">
                            <img
                                // src={require("../../Assets/Img/connector_status_icon.svg")}
                                src={require("../../Assets/Img/"+props.statusImageName)}
                                alt="new"
                            />
                        </span>
                        &nbsp;&nbsp;
                        {props.status}
                        {/* Pairing Request Received */}
                    </Col>
                    {/* <Tooltip title={props.cropDetail}>
                    <Col style={{"padding-right":"4px",color: "#3D4A52", "text-transform": "capitalize" }} className="fontweight400andfontsize14pxandcolor3D4A52 supportcardsecondcolumndata">
                        {props.cropDetail}
                        sample crop detail
                    </Col>
                    </Tooltip> */}
                </Row>    
                <Row style={{"margin-top":"-10px"}}>
                    {isshowbutton ? 
                    <Col className="fontweight600andfontsize14pxandcolor3D4A52 supportcardsecondcolumn">
                        <Button 
                        onClick={()=>props.viewCardDetails()} 
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
