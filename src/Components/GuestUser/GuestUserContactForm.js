import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./guestUserContactForm.module.css";
import { useHistory } from "react-router-dom";

import {
  createTheme,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from "@mui/material";
import { openLinkInNewTab, mobileNumberMinimunLengthCheck, validateInputField } from "../../Utils/Common";
import RegexConstants from "../../Constants/RegexConstants";
import MuiPhoneNumber from "material-ui-phone-number";
import { yellow } from "@mui/material/colors";
import { MuiThemeProvider, Zoom } from "@material-ui/core";
import parse from "html-react-parser"
import success from "../../Assets/Img/successiconsvg.svg"
const theme = createTheme({
  palette: {
    secondary: {
      main: '#F1F1F1'
    }
  }
});


const GuestUserContactForm = ({
  isSuccess,
  guestUserConstants,
  useStyles,
  setUserDetails,
  useDetails,
  handleChange,
  setIsSuccess,
  validator,
  setEmailError,
  emailError,
  iscontactnumbererror,
  datahubUserDetails,
  isdescriptionerror,
  addNewGuestUserData,
  firstNameErrorMessage,
  lastNameErrorMessage,
  emailErrorMessage,
  contactNumberErrorMessage,
  subjectErrorMessage,
  describeQueryErrorMessage
}) => {
  const history = useHistory();

  return (
    <>
      <Row>
        <Col className={styles.guestUserContactUsHeading}>
          {guestUserConstants.guestUser.contact_us}

        </Col>
      </Row>
      <Row>
        <Col
          onClick={() => history.push("/home")}
          className={styles.backButtonMainDiv}
        >
          <ArrowBackIcon className={styles.backArrowIcon}></ArrowBackIcon>{" "}
          <div className={styles.backButtonText}>
            {guestUserConstants.common.back}
          </div>
        </Col>
      </Row>
      <hr className={styles.guestDividerHr}></hr>
      <Row>
        <Col>
          <div
            style={{
              marginTop: "30px",
              marginLeft: "290px",
              textAlign: "left",
              fontSize: "20px",
              fontWeight: "700",
              color: "#3D4A52",
              marginBottom: "30px",
            }}
          >
            {guestUserConstants.guestUser.touch_with_us}
          </div>
        </Col>
      </Row>
      <Container
        style={{
          marginTop: "0",
          justifyContent: "space-between",
          width: "860px",
          marginLeft: "290px",
          padding: "0",
          //   border: "1px solid red",
        }}
        className="d-flex"
      >
        <Col style={{ maxWidth: "346px", textAlign: "left" }}>
          <Row
            style={{
              marginBottom: "69px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>{guestUserConstants.guestUser.datahub_admin_name}</div>
            <Tooltip placement="bottom-start" TransitionComponent={Zoom} title={datahubUserDetails.admin_name}>

              <div className={styles.guestUserDatahubAdminDetails}>
                {datahubUserDetails.admin_name}
              </div>
            </Tooltip>
          </Row>
          <Row
            style={{
              marginBottom: "69px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>{guestUserConstants.guestUser.organization_name}</div>
            <Tooltip placement="bottom-start" TransitionComponent={Zoom} title={datahubUserDetails.org_name}>

              <div className={styles.guestUserDatahubAdminDetails}>
                {" "}
                {datahubUserDetails.org_name
                }
              </div>
            </Tooltip>
          </Row>
          <Row
            style={{
              marginBottom: "69px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>{guestUserConstants.guestUser.address}</div>
            <Tooltip placement="bottom-start" TransitionComponent={Zoom} title={datahubUserDetails.address}>

              <div className={styles.guestUserDatahubAdminDetails}>
                {datahubUserDetails.address
                }
              </div>
            </Tooltip>

          </Row>
          <Row
            style={{
              marginBottom: "50px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>{guestUserConstants.guestUser.phone}</div>
            <Tooltip placement="bottom-start" TransitionComponent={Zoom} title={datahubUserDetails.phone_number}>

              <div className={styles.guestUserDatahubAdminDetails}>
                {datahubUserDetails.phone_number
                }
              </div>
            </Tooltip>

          </Row>
        </Col>
        <Col style={{ maxWidth: "340px", textAlign: "left" }}>
          <Row
            style={{
              marginBottom: "69px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div> {guestUserConstants.guestUser.datahub_admin_email}</div>
            <Tooltip placement="bottom-start" TransitionComponent={Zoom} title={datahubUserDetails.admin_email}>

              <div className={styles.guestUserDatahubAdminDetails}>
                {datahubUserDetails.admin_email
                }
              </div>
            </Tooltip>

          </Row>
          <Row
            style={{
              marginBottom: "69px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>{guestUserConstants.guestUser.country}</div>
            <Tooltip placement="bottom-start" TransitionComponent={Zoom} title={datahubUserDetails.country}>

              <div className={styles.guestUserDatahubAdminDetails}>
                {datahubUserDetails.country
                }
              </div>
            </Tooltip>

          </Row>
          <Row
            style={{
              marginBottom: "69px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>{guestUserConstants.guestUser.city}</div>
            <Tooltip placement="bottom-start" TransitionComponent={Zoom} title={datahubUserDetails.city}>

              <div className={styles.guestUserDatahubAdminDetails}>
                {datahubUserDetails.city}
              </div>
            </Tooltip>

          </Row>
          <Row
            style={{
              marginBottom: "50px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>{guestUserConstants.guestUser.website}</div>
            <Tooltip placement="bottom-start" TransitionComponent={Zoom} title={datahubUserDetails.website}>

              <div className={styles.guestUserDatahubAdminDetails} style={{ color: '#3491EE', cursor: 'pointer' }}
                onClick={() => openLinkInNewTab(datahubUserDetails.website)}>
                {datahubUserDetails.website
                }
              </div>
            </Tooltip>

          </Row>
        </Col>
        <Col style={{ maxWidth: "174px", textAlign: "left" }}>
          <Row
            style={{
              marginBottom: "69px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>{guestUserConstants.guestUser.datahub_admin_phone}</div>
            <Tooltip placement="bottom-start" TransitionComponent={Zoom} title={datahubUserDetails.admin_phone}>

              <div className={styles.guestUserDatahubAdminDetails}>
                {datahubUserDetails.admin_phone ? datahubUserDetails.admin_phone : "-"
                }
              </div>
            </Tooltip>

          </Row>
          <Row
            style={{
              marginBottom: "69px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>{guestUserConstants.guestUser.pin_code}</div>
            <Tooltip placement="bottom-start" TransitionComponent={Zoom} title={datahubUserDetails.admin_pin_code}>

              <div className={styles.guestUserDatahubAdminDetails}>
                {datahubUserDetails.admin_pin_code
                }
              </div>
            </Tooltip>

          </Row>

          <Row
            style={{
              marginBottom: "69px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div> {guestUserConstants.guestUser.email}</div>
            <Tooltip placement="bottom-start" TransitionComponent={Zoom} title={datahubUserDetails.email_id}>

              <div className={styles.guestUserDatahubAdminDetails}>
                {datahubUserDetails.email_id
                }
              </div>
            </Tooltip>

          </Row>
        </Col>
      </Container>
      <hr className={styles.guestDividerHr}></hr>

      <Row
        style={{ padding: "0" }}
        p={0}
        m={0}
        className={styles.guestUserFormHead}
      >
        <Col style={{ padding: "0" }} m={0} p={0}>
          {guestUserConstants.guestUser.say_hello}
        </Col>
      </Row>
      <Form>
        <Row
          className={styles.marginLeftRight290}
          style={(useStyles.marginrowtop, { marginBottom: "30px" })}
        >
          <Col
            xs={12}
            sm={12}
            md={6}
            lg={6}
            style={{
              width: "100%",
              //   border: "1px solid red",
              padding: 0,
              marginRight: "20px",
            }}
          >
            <TextField
              name="firstName"
              style={{ width: "100%", height: "49px" }}
              //   style={useStyles.inputwidth}
              id="filled-basic"
              variant="filled"
              required
              value={useDetails.firstName}
              onChange={(e) =>
                validateInputField(e.target.value, RegexConstants.TEXT_REGEX)
                  ? handleChange(e)
                  : e.preventDefault()
              }
              label={guestUserConstants.guestUser.first_name}
              error={firstNameErrorMessage ? true : false}
              helperText={firstNameErrorMessage}
            />
          </Col>
          <Col style={{ width: "100%", padding: 0 }}>
            <TextField
              name="lastName"
              style={{ width: "100%", height: "49px" }}
              id="filled-basic"
              variant="filled"
              value={useDetails.lastName}
              onChange={(e) =>
                validateInputField(e.target.value, RegexConstants.TEXT_REGEX)
                  ? handleChange(e)
                  : e.preventDefault()
              }
              label={guestUserConstants.guestUser.last_name}
              error={lastNameErrorMessage ? true : false}
              helperText={lastNameErrorMessage}
            // error={"enter correct details"}
            //   helperText={"error"}
            />
          </Col>
        </Row>
        <Row
          className={styles.marginLeftRight290}
          style={{ marginBottom: "30px" }}
        >
          <Col
            style={{
              width: "100%",
              //   border: "1px solid red",
              padding: 0,
              marginRight: "20px",
            }}
            xs={12}
            sm={12}
            md={6}
            lg={6}
          >
            <TextField
              // autoComplete={false}
              name="email"
              //   style={useStyles.inputwidth}
              style={{ width: "100%", height: "49px" }}
              id="filled-basic"
              variant="filled"
              required
              value={useDetails.email}
              onChange={(e) =>
                validateInputField(
                  e.target.value,
                  RegexConstants.NO_SPACE_REGEX
                )
                  ? handleChange(e)
                  : e.preventDefault()
              }
              label={guestUserConstants.guestUser.email}
              error={emailErrorMessage || (emailError && useDetails.email.length > 0) ? true : false}
              // helperText = {emailErrorMessage}
              helperText={
                useDetails.email.length > 0 && emailError && !emailErrorMessage
                  ? "Enter Valid Email id"
                  : emailErrorMessage
              }
            // error={props.isorganisationemailerror}
            // helperText={
            //   props.isorganisationemailerror ? "Enter Valid Email id" : ""
            // }
            />
          </Col>
          <Col style={{ width: "100%", padding: 0 }}>

            <MuiPhoneNumber
              // autoComplete={false}
              countryCodeEditable={false}

              name="contactNumber"
              defaultCountry={"in"}
              style={{ width: "100%", height: "49px" }}
              //   style={useStyles.inputwidth}
              //   placeholder={}

              id="filled-basic"
              variant="filled"
              // color="false"
              label={guestUserConstants.guestUser.contact_number}
              required
              value={useDetails.contactNumber}
              onChange={(value) =>
                handleChange({
                  target: { name: "contactNumber", value: value },
                })
              }
              error={contactNumberErrorMessage ? true : false}
              helperText={contactNumberErrorMessage}
            // error={iscontactnumbererror}
            // helperText={iscontactnumbererror ? "Enter Valid Number" : ""}
            />
          </Col>
        </Row>
        <Row
          style={{
            // border: "1px solid red",
            width: "860px",
            margin: "auto",
            textAlign: "left",
            padding: 0,
            color: "#3D4A52",
          }}
        >
          <Col style={{ padding: 0 }}>
            <FormLabel
              style={{
                color: "#3D4A52",
                fontSize: "600",
                fontSize: "16px",
                lineHeight: "22px",
              }}
              id="demo-row-radio-buttons-group-label"
            >
              {guestUserConstants.guestUser.subject}
            </FormLabel>
          </Col>
        </Row>
        <Row
          //   style={{ display: "flex", border: "1px solid red" }}
          className={styles.marginLeftRight290}
        >
          <RadioGroup
            name="subject"
            onChange={(e) => handleChange(e)}
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            defaultValue="null"
            // name="row-radio-buttons-group"
            style={{
              //   border: "1px solid green",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <FormControlLabel
              value="Become a Participant"
              control={<Radio />}
              label={guestUserConstants.guestUser.become_a_participant}
            />

            <FormControlLabel
              value="Other queries"
              control={<Radio />}
              label={guestUserConstants.guestUser.other_queries}
            />
          </RadioGroup>
        </Row>
        <Row
          style={{
            marginLeft: "290px",
            // border: "1px solid red",
            width: "860px",
          }}
        >
          <TextField
            style={useStyles.fullWidth}
            name="queryDescription"
            // id="filled-basic"

            label={guestUserConstants.guestUser.describe_your_query}
            placeholder="Write"
            multiline
            required
            value={useDetails.queryDescription}
            maxRows={3}
            // rows={3}
            // minRows={3}
            // autoComplete={false}
            inputProps={{ maxLength: 1000 }}
            variant="filled"
            onChange={(e) => {
              e.target.value = e.target.value.replace(/\s{2,}/g, ' ')
              validateInputField(e.target.value, RegexConstants.DES_SET_REGEX)
                ? handleChange(e)
                : e.preventDefault()
            }
            }
            error={describeQueryErrorMessage ? true : false}
            helperText={describeQueryErrorMessage}
          />
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={3}></Col>
          <Col xs={12} sm={12} md={6} lg={6}>
            {useDetails.firstName &&
              useDetails.email &&
              mobileNumberMinimunLengthCheck(useDetails.contactNumber) &&
              useDetails.queryDescription &&
              !emailError &&
              !iscontactnumbererror &&
              !isdescriptionerror ? (
              <Button
                onClick={() => addNewGuestUserData()}
                variant="contained"
                className={styles.submitbtn}
                style={{ marginTop: "100px" }}

              // onClick={() => {
              //   setIsSuccess(true);
              // }}
              >
                {guestUserConstants.guestUser.submit}
              </Button>
            ) : (
              <Button
                style={{ marginTop: "100px" }}
                variant="contained"
                disabled
                className={styles.submitbtn}

                onClick={() => history.push("/home")}
              >
                {guestUserConstants.guestUser.submit}
              </Button>
            )}
            <Button
              style={{ marginTop: "0px", boxShadow: "none" }}
              variant="outlined"
              className="cancelbtn"

              onClick={() => history.push("/home")}
            >
              {guestUserConstants.guestUser.cancel}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default GuestUserContactForm;


