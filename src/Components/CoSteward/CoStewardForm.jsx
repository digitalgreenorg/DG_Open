import React, { useState, useMemo } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import THEME_COLORS from '../../Constants/ColorConstants'
import labels from '../../Constants/labels';
import TextField from "@mui/material/TextField";
import MenuItem from '@mui/material/MenuItem';
import countryList from "react-select-country-list";
import MuiPhoneNumber from "material-ui-phone-number";
import { FormControlLabel } from '@mui/material';
import Checkbox from "@mui/material/Checkbox";
import RegexConstants from '../../Constants/RegexConstants';
import { handleAddressCharacters, handleNameFieldEntry, preventSpaceKey, validateInputField } from '../../Utils/Common';
// import Select from 'react-select'
const useStyles = {
    btncolor: {color: THEME_COLORS.THEME_COLOR, "border-color": THEME_COLORS.THEME_COLOR, "border-radius": 0},
    marginrowtop: {"margin-top": "30px"},
    marginrowtop50: {"margin-top": "50px"},
    inputwidth:{width: "95%", "text-align": "left", height: '48px', color: '#3D4A52'},
    inputwidthlastrow:{width: "95%", "text-align": "left", height: '48px', color: '#3D4A52', "margin-top": "-10px"},
    headingbold:{fontWeight: "bold"}
};

export default function CoStewardForm(props) {
    const [screenlabels, setscreenlabels] = useState(labels['en']);
    const options = useMemo(() => countryList().getData(), [])

    return (
        <>
            <Row style={useStyles.marginrowtop50}>
                <Col xs={12} sm={12} md={12} lg={12}>
                    <span className="mainheading" style={{float: 'left', 'margin-left': '15px'}}>
                        {props.first_heading}
                    </span>
                </Col>
            </Row>
            <Row style={useStyles.marginrowtop}>
                <Col xs={12} sm={12} md={6} lg={6} >
                    <TextField
                        style={useStyles.inputwidth}
                        id="filled-basic"
                        variant="filled"
                        required
                        value={props.organisationname}
                        onChange={(e) =>validateInputField(e.target.value,RegexConstants.ORG_NAME_REGEX)? props.setorganisationname(e.target.value): e.preventDefault()}
                        label={screenlabels.co_steward?.organisation_name}
                        error={props.orgNameErrorMessage ? true: false}
                        helperText={props.orgNameErrorMessage}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                    <TextField
                        style={useStyles.inputwidth}
                        id="filled-basic"
                        variant="filled"
                        required
                        value={props.orginsationemail}
                        onChange={(e) => validateInputField(e.target.value,RegexConstants.NO_SPACE_REGEX) ? props.setorginsationemail(e.target.value.trim()) : e.preventDefault()}
                        label={screenlabels.co_steward?.email}
                        error={props.isorganisationemailerror || props.orgEmailErrorMessage}
                        helperText={(props.isorganisationemailerror && !props.orgEmailErrorMessage) ? 
                            "Enter Valid Email id" : props.orgEmailErrorMessage}
                    />
                </Col>
            </Row>
            <Row style={useStyles.marginrowtop}>
                <Col xs={12} sm={12} md={6} lg={6} >
                    <TextField
                        style={useStyles.inputwidth}
                        variant="filled"
                        required
                        value={props.websitelink}
                        onChange={(e) => props.setwebsitelink(e.target.value.trim())}
                        label={screenlabels.co_steward?.website_link}
                        error={props.iswebsitelinkrerror || props.orgWebsiteErrorMessage}
                        helperText={(props.iswebsitelinkrerror && !props.orgWebsiteErrorMessage) 
                                    ? "Enter Valid Website Link" : props.orgEmailErrorMessage}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                    <TextField
                        style={useStyles.inputwidth}
                        id="filled-basic"
                        variant="filled"
                        required
                        label={screenlabels.co_steward?.organisation_address}
                        value={props.organisationaddress}
                        onKeyDown={(e) => handleAddressCharacters(props.organisationaddress,e)}
                        onChange={(e) => props.setorganisationaddress(e.target.value)}
                        
                    />
                </Col>
            </Row>
            <Row style={useStyles.marginrowtop}>
                <Col xs={12} sm={12} md={6} lg={6} >
                    <TextField 
                        select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        style={useStyles.inputwidth}
                        variant="filled"
                        required
                        value={props.countryvalue}
                        onChange={(e) => props.setcountryvalue(e.target.value)}
                        isSearchable={true}
                        label={screenlabels.co_steward?.country}
                    >
                        {options.map((rowData, index) => (
                            <MenuItem value={rowData.label}>{rowData.label}</MenuItem>
                        ))}
                    </TextField>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                    <TextField
                       style={useStyles.inputwidth}
                        id="filled-basic"
                        variant="filled"
                        required
                        type="number"
                        label={screenlabels.co_steward?.pincode}
                        value={props.pincode}
                        onKeyDown={(e) => {if(e.key == '-' || e.key == 'e' || e.key == 'E' || e.key == '+') {e.preventDefault()}}}
                        onChange={(e) => {if (e.target.value.length > 10) e.target.value = e.target.value.substring(0,10); 
                                          validateInputField(e.target.value,RegexConstants.PINCODE_REGEX) ? props.setpincode(e.target.value.trim()) : e.preventDefault()}}
                    />
                </Col>
            </Row>
            <hr style={{'margin-left' : '-200px', 'margin-right' : '-200px','margin-top' : '30px', 'border-top': '1px solid rgba(238, 238, 238, 0.5)'}}/>
            <Row style={useStyles.marginrowtop}>
            <Col xs={12} sm={12} md={12} lg={12}>
                <span className="mainheading" style={{float: 'left', 'margin-left': '15px'}}>
                    {props.second_heading}
                </span>
            </Col>
            </Row>
            <Row style={useStyles.marginrowtop}>
                <Col xs={12} sm={12} md={6} lg={6} >
                    <TextField
                        style={useStyles.inputwidth}
                        id="filled-basic"
                        variant="filled"
                        required
                        label={screenlabels.co_steward?.first_name}
                        value={props.firstname}
                        onChange={(e) => validateInputField(e.target.value,RegexConstants.TEXT_REGEX) ? props.setfirstname(e.target.value.trim()) : e.preventDefault()}
                        error={props.firstNameErrorMessage ? true: false}
                        helperText={props.firstNameErrorMessage}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                    <TextField
                        style={useStyles.inputwidth}
                        id="filled-basic"
                        variant="filled"
                        label={screenlabels.co_steward?.last_name}
                        value={props.lastname}
                        onChange={(e) => validateInputField(e.target.value,RegexConstants.TEXT_REGEX) ? props.setlastname(e.target.value.trim()) : e.preventDefault()}
                        error={props.lastNameErrorMessage ? true: false}
                        helperText={props.lastNameErrorMessage}
                    />
                </Col>
            </Row>
            <Row style={useStyles.marginrowtop}>
                <Col xs={12} sm={12} md={6} lg={6} >
                    <TextField
                        style={useStyles.inputwidth}
                        id="filled-basic"
                        variant="filled"
                        required
                        label={screenlabels.co_steward?.email}
                        value={props.useremail}
                        onChange={(e) => validateInputField(e.target.value,RegexConstants.NO_SPACE_REGEX) ? props.setuseremail(e.target.value.trim()) : e.preventDefault()}
                        error={props.isuseremailerror || props.isexisitinguseremail || props.emailErrorMessage}
                        helperText={(props.isuseremailerror && !props.emailErrorMessage) ? 
                                    "Enter Valid Email id" : 
                                    (props.isexisitinguseremail && !props.emailErrorMessage) ? 
                                    "User is already registered with this email ID" : props.emailErrorMessage}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                    <MuiPhoneNumber
                        defaultCountry={"in"}
                        countryCodeEditable={false}
                        style={useStyles.inputwidth}
                        id="filled-basic"
                        label={screenlabels.co_steward?.contact_number}
                        variant="filled"
                        required
                        value={props.contactnumber}
                        onChange={(e) => props.setcontactnumber(e)}
                        error={props.iscontactnumbererror || props.phoneNumberErrorMessage}
                        helperText={(props.iscontactnumbererror && !props.phoneNumberErrorMessage) 
                            ? "Enter Valid Number" : props.phoneNumberErrorMessage}
                    />
                </Col>
            </Row>
           </>
    )
}
