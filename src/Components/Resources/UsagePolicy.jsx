import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CheckBoxWithText from "../Datasets_New/TabComponents/CheckBoxWithText";

const UsagePolicy = () => {
  const [selectedValue, setSelectedValue] = useState("public");
  const [selectedChecked, setSelectedChecked] = useState("");

  const handleClick = (event, type) => {
    if (type === "public") {
      setSelectedValue("public");
      setSelectedChecked("");
    } else if (type === "registered") {
      setSelectedValue("registered");
      setSelectedChecked("registered");
    }
  };

  const handleCheckBox = (type) => {
    if (type === "registered") {
      setSelectedChecked("registered");
    } else if (type === "private") {
      setSelectedChecked("private");
    }
  };

  return (
    <Box>
      <Typography
        className="mt-50"
        sx={{
          fontFamily: "Montserrat !important",
          fontWeight: "600",
          fontSize: "20px",
          lineHeight: "24px",
          color: "#000000",
          textAlign: "left",
        }}
      >
        Define who can access your contents by selecting appropriate usage
        policy.
      </Typography>
      <Box className="mt-20 text-left ml-10">
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
          >
            <FormControlLabel
              value={"publicChecked"}
              control={
                <Radio
                  id="usege-policy-pulic-dataset-checkbox"
                  onClick={(e) => handleClick(e, "public")}
                  checked={selectedValue === "public"}
                  value="public"
                  sx={{
                    color: "#00A94F !important",
                    "&.Mui-checked": {
                      color: "#00A94F !important",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontFamily: "Open Sans !important",
                    fontWeight: "400",
                    fontSize: "16px",
                    lineHeight: "22px",
                    color: "#212B36",
                    textAlign: "left",
                  }}
                >
                  Anyone can download my contents as it is freely available to
                  public.
                </Typography>
              }
            />
          </RadioGroup>
        </FormControl>
        <Box className="d-flex" sx={{ marginLeft: "52px" }}>
          <img
            style={{ marginTop: "5px" }}
            src={require("../../Assets/Img/info.svg")}
          />
          <Typography
            className="mt-10"
            sx={{
              fontFamily: "Montserrat !important",
              fontWeight: "400",
              fontSize: "12px",
              lineHeight: "14.63px",
              color: "#000000",
              marginLeft: "9px",
            }}
          >
            User does not have to be registered user in the network to download
            this contents. You are allowing the user to download it without any
            restrictions.
          </Typography>
        </Box>
      </Box>
      <Divider className="mt-20" />
      <Box className="mt-20 text-left ml-10">
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
          >
            <FormControlLabel
              value={"isRegisteredCheched"}
              control={
                <Radio
                  id="usege-policy-register-user-dataset-checkbox"
                  onClick={(e) => handleClick(e, "registered")}
                  value="registered"
                  checked={selectedValue === "registered"}
                  sx={{
                    color: "#00A94F !important",
                    "&.Mui-checked": {
                      color: "#00A94F !important",
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontFamily: "Open Sans !important",
                    fontWeight: "400",
                    fontSize: "16px",
                    lineHeight: "22px",
                    color: "#212B36",
                    textAlign: "left",
                  }}
                >
                  Only Registered user can download my contents as we need
                  authenticate users to access data provided by us.
                </Typography>
              }
            />
          </RadioGroup>
        </FormControl>
        <Box className="d-flex" sx={{ marginLeft: "52px" }}>
          <img
            style={{ marginTop: "5px" }}
            src={require("../../Assets/Img/info.svg")}
          />
          <Typography
            className="mt-10"
            sx={{
              fontFamily: "Montserrat !important",
              fontWeight: "400",
              fontSize: "12px",
              lineHeight: "14.63px",
              color: "#000000",
              marginLeft: "9px",
            }}
          >
            You can apply certain restrictions to the user so that contents you
            are providing is accessed by valid users.
          </Typography>
        </Box>
        <Box sx={{ marginLeft: "52px" }}>
          <CheckBoxWithText
            text={"Contents can be accessed by the registered user."}
            keyName={"registered"}
            checked={
              selectedValue === "registered" && selectedChecked === "registered"
            }
            handleCheckBox={handleCheckBox}
            isDisabled={selectedValue === "registered" ? false : true}
            isCustomFont={true}
            keyIndex={0}
          />
        </Box>
        <Box sx={{ marginLeft: "107px" }}>
          <CheckBoxWithText
            text={"Contents can be accessed by approval."}
            keyName={"private"}
            checked={
              selectedValue === "registered" && selectedChecked === "private"
            }
            handleCheckBox={handleCheckBox}
            isDisabled={selectedValue === "registered" ? false : true}
            isCustomFont={true}
            keyIndex={1}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default UsagePolicy;
