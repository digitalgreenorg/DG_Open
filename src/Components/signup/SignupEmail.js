import React, { useState, useRef } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import './SignupEmail.css'
import Footerimg from '../../Components/signup/Footerimg'
import Footer from '../Footer/Footer'
// import validator from "validator";

export default function SignupEmail(props) {
  //   const [email, setEmail] = useState("");

  // const [button, setButton] = useState(false);
  // const email = useRef();
  // const [iserror, setError] = useState(false);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log(email.current.value);
  //   const valid = validator.isEmail(email.current.value);
  //   console.log(valid);
  //   if (!valid) {
  //     setError(true);
  //   } else {
  //     setError(false);
  //   }
  // };

  // const handleEmail = (e) => {
  //   e.preventDefault();
  //   console.log(e.target.value);
  //   if (e.target.value.length > 0) {
  //     setButton(true);
  //   } else {
  //     setButton(false);
  //   }
  // };

  return (
    <div>
      <Footerimg />
      <form noValidate autoComplete="off" onSubmit={props.handleSubmit} >
        <TextField
          required
          id="loginwithemail"
          label="Email"
          variant="filled"
          className="signupemail"
          onChange={props.handleEmail}
          onKeyDown={(e) => {if(e.key == ' ') {e.preventDefault()}}}
          inputRef={props.email}
          error={props.iserror || props.isuserSuspenderror}
          helperText={(props.iserror || props.isuserSuspenderror) ? props.errormessage : ""}
        />
        <div>
          {props.button ? (
            <Button variant="contained" className="Signupbtn" type="submit" id="sendotp">
              <span className="signupbtnname">Send OTP to Email</span>
            </Button>
          ) : (
            <Button variant="outlined" disabled className="disablebtn">
              Send OTP
            </Button>
          )}
        </div>
      </form>
      <div style={{position:"absolute", top:"770px"}}>

      <Footer />
      </div>
    </div>
  )
}
