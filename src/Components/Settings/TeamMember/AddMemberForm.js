import React, { useState, useMemo } from 'react';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import THEME_COLORS from '../../../Constants/ColorConstants'
import labels from '../../../Constants/labels';
import TextField from "@mui/material/TextField";
import MenuItem from '@mui/material/MenuItem';

import { validateInputField } from '../../../Utils/Common.js'
import RegexConstants from '../../../Constants/RegexConstants';
// import Select from 'react-select'
const useStyles = {
    btncolor: {color: THEME_COLORS.THEME_COLOR, "border-color": THEME_COLORS.THEME_COLOR, "border-radius": 0},
    marginrowtop: {"margin-top": "30px"},
    inputwidth:{width: "95%", "text-align": "left", "font-family": "Open Sans", 'width': '420px', "height": '48px', 'left': "65px",},
    inputwidthright:{width: "95%", "text-align": "left", "font-family": "Open Sans", 'width': '420px', "height": '48px', "right": "65px"},
    headingbold:{fontWeight: "bold"},
    marginrowtophead:{"margin-top": "40px", 'font-weight': "600", 'font-family': 'Open Sans', "width": "202px", "height": "27px", "margin-left": "122px"},

};
export default function AddMemberForm(props) {
    const [screenlabels, setscreenlabels] = useState(labels['en']);
    return (
        <>
            <Row style={useStyles.marginrowtophead}>
                <span className="mainheading">
                    {props.first_heading}
                </span>
            </Row>
            <Row style={useStyles.marginrowtop}>
                <Col xs={12} sm={12} md={6} lg={6} >
                    <TextField
                        style={useStyles.inputwidth}
                        id="filled-basic"
                        variant="filled"
                        required
                        label={screenlabels.settings.first_name}
                        value={props.firstname}
                        onChange={(e) => validateInputField(e.target.value,RegexConstants.TEXT_REGEX) ? props.setfirstname(e.target.value.trim()) : e.preventDefault() }
                        error={props.firstNameErrorMessage ? true : false}
                        helperText = {props.firstNameErrorMessage}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6}>
                    <TextField
                        style={useStyles.inputwidthright}
                        id="filled-basic"
                        variant="filled"
                        label={screenlabels.settings.last_name}
                        value={props.lastname}
                        // onKeyDown={(e) => validateInputField(e.key,RegexConstants.APLHABET_REGEX)?"":e.preventDefault()}
                        onChange={(e) => validateInputField(e.target.value,RegexConstants.TEXT_REGEX) ? props.setlastname(e.target.value.trim()) : e.preventDefault() }

                        error={props.lastNameErrorMessage ? true : false}
                        helperText = {props.lastNameErrorMessage}
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
                        label={screenlabels.settings.email}
                        value={props.useremail}
                        onChange={(e) => validateInputField(e.target.value,RegexConstants.NO_SPACE_REGEX) ? props.setuseremail(e.target.value.trim()) : e.preventDefault()}
                        error={props.isuseremailerror || props.isexistinguseremail || props.emailErrorMessage}
                        helperText={(props.isuseremailerror && !props.emailErrorMessage) ? 
                                    "Enter Valid Email id" : 
                                    (props.isexistinguseremail && !props.emailErrorMessage) 
                                    ? "User is already registered with this email ID" : props.emailErrorMessage}
                    />
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} >
                    <TextField
                        select
                        variant="filled"
                        required
                        style={useStyles.inputwidthright}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label={screenlabels.settings.role}
                        value={props.userrole}
                        onChange={(e) => props.setuserrole(e.target.value)}
                    >
                        {/* <MenuItem value={'Team Member'}>Team Member</MenuItem>
                        <MenuItem value={'Guest User'}>Guest User</MenuItem> */}
                        <MenuItem value={2}>Team Member</MenuItem>
                        <MenuItem value={5}>Guest User</MenuItem>
                    </TextField>
                </Col>
         
            </Row>
        </>
    );
}
