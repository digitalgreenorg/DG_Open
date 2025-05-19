import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import CheckBoxWithText from "./CheckBoxWithText";
import UrlConstant from "../../../Constants/UrlConstants";
import HTTPService from "../../../Services/HTTPService";
import { getTokenLocal } from "../../../Utils/Common";
import { FarmStackContext } from "../../Contexts/FarmStackContext";
import GlobalStyle from "../../../Assets/CSS/global.module.css";

const UsagePolicy = (props) => {
  const { callLoader, callToast } = useContext(FarmStackContext);
  const [selectedValue, setSelectedValue] = useState("public");
  const [selectedChecked, setSelectedChecked] = useState("");
  const [file, setFile] = useState("");
  const [files, setFiles] = useState("");
  const [filesAccessibility, setFilesAccessibility] = useState(
    props.allFilesAccessibility ? props.allFilesAccessibility : []
  );

  const handleClick = (event, type) => {
    if (type === "public") {
      setSelectedValue("public");
      setSelectedChecked("");
    } else if (type === "registered") {
      setSelectedValue("registered");
      setSelectedChecked("registered");
    }
  };

  const getAllFileNames = () => {
    let url =
      UrlConstant.base_url + UrlConstant.list_of_files + props.datasetId;
    let accessToken = getTokenLocal() ?? false;
    callLoader(true);
    HTTPService("GET", url, false, false, accessToken)
      .then((response) => {
        callLoader(false);
        let arr = [];
        let tempArr = response?.data?.forEach((r) => {
          let obj = {
            id: r.id,
            file: r.file,
            label: r.file?.slice(r.file?.lastIndexOf("/") + 1),
          };
          arr.push(obj);
        });
        setFiles(arr);
      })
      .catch((e) => {
        callLoader(false);
        console.log(e);
      });
  };

  const handleCheckBox = (type) => {
    if (type === "registered") {
      setSelectedChecked("registered");
    } else if (type === "private") {
      setSelectedChecked("private");
    }
  };

  const submitPolicy = () => {
    let payload = {
      accessibility:
        selectedValue === "public" ? selectedValue : selectedChecked,
    };
    let accessToken = getTokenLocal() ?? false;
    let url = UrlConstant.base_url + UrlConstant.usage_policy + file + "/";
    callLoader(true);
    HTTPService("PATCH", url, payload, false, accessToken)
      .then((response) => {
        callLoader(false);
        setFilesAccessibility((prev) => {
          return prev.map((fileObj) => {
            if (fileObj.id == file) {
              return {
                id: file,
                accessibility: selectedChecked,
                file: fileObj.file,
              };
            } else {
              return fileObj;
            }
          });
        });
        callToast("Usage policy updated successfully!", "success", true);
      })
      .catch((e) => {
        callLoader(false);
        callToast(
          "Something went wrong while updating useage policy!",
          "error",
          true
        );
        console.log(e);
      });
  };

  useEffect(() => {
    getAllFileNames();
  }, []);

  useEffect(() => {
    if (props.isEditModeOn) {
      let fileAccessibility = filesAccessibility?.filter(
        (acc) => acc.id === file
      );
      let accesibilityStatus = fileAccessibility?.[0]?.accessibility;
      if (accesibilityStatus === "public") {
        setSelectedValue("public");
        setSelectedChecked("");
      } else if (accesibilityStatus === "registered") {
        setSelectedValue("registered");
        setSelectedChecked("registered");
      } else if (accesibilityStatus === "private") {
        setSelectedValue("registered");
        setSelectedChecked("private");
      }
    } else {
      let found = filesAccessibility.some((el) => el.id === file);
      if (found) {
        let fileAccessibility = filesAccessibility?.filter(
          (acc) => acc.id === file
        );
        let accesibilityStatus = fileAccessibility?.[0]?.accessibility;
        if (accesibilityStatus === "public") {
          setSelectedValue("public");
          setSelectedChecked("");
        } else if (accesibilityStatus === "registered") {
          setSelectedValue("registered");
          setSelectedChecked("registered");
        } else if (accesibilityStatus === "private") {
          setSelectedValue("registered");
          setSelectedChecked("private");
        }
      } else {
        setSelectedValue("public");
        setSelectedChecked("");
      }
    }
  }, [file, filesAccessibility]);

  return (
    <div className="mt-20">
      <Typography
        sx={{
          fontFamily: "Montserrat !important",
          fontWeight: "600",
          fontSize: "32px",
          lineHeight: "40px",
          color: "#000000",
          textAlign: "left",
        }}
      >
        Usage policy
      </Typography>
      <Typography
        className={`${GlobalStyle.textDescription} text-left ${GlobalStyle.bold400} ${GlobalStyle.highlighted_text}`}
      >
        {" "}
        Define access limitations and permissions for your dataset.{" "}
      </Typography>
      <Box className="text-left mt-30">
        <FormControl fullWidth sx={{ width: "368px" }}>
          <InputLabel>File name</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="usege-policy-select-file"
            value={file}
            onChange={(e) => setFile(e.target.value)}
            sx={{
              textAlign: "left",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "#919EAB",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#919EAB",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#919EAB",
              },
            }}
            label="File name"
            placeholder="File name"
          >
            {files &&
              files?.length &&
              files?.map((item, index) => {
                return (
                  <MenuItem
                    key={item?.id}
                    value={item?.id}
                    id={`usage_policy-file-name-${index}`}
                  >
                    {item?.label}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </Box>
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
        Define who can access your datasets by selecting appropriate usage
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
                  checked={file && selectedValue === "public"}
                  disabled={file ? false : true}
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
                  Anyone can download my dataset as it is freely available to
                  public.
                </Typography>
              }
            />
          </RadioGroup>
        </FormControl>
        <Box className="d-flex" sx={{ marginLeft: "52px" }}>
          <img
            style={{ marginTop: "5px" }}
            src={require("../../../Assets/Img/info.svg")}
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
            this dataset. You are allowing the user to download it without any
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
                  checked={file && selectedValue === "registered"}
                  disabled={file ? false : true}
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
                  Only Registered user can download my dataset as we need
                  authenticate users to access data provided by us.
                </Typography>
              }
            />
          </RadioGroup>
        </FormControl>
        <Box className="d-flex" sx={{ marginLeft: "52px" }}>
          <img
            style={{ marginTop: "5px" }}
            src={require("../../../Assets/Img/info.svg")}
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
            You can apply certain restrictions to the user so that dataset you
            are providing is accessed by valid users.
          </Typography>
        </Box>
        <Box sx={{ marginLeft: "52px" }}>
          <CheckBoxWithText
            text={"Dataset can be accessed by the registered user."}
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
            text={"Dataset can be accessed by approval."}
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
        <Box className="text-right mt-30">
          <Button
            sx={{
              fontFamily: "Montserrat",
              fontWeight: 700,
              fontSize: "16px",
              width: "171px",
              height: "48px",
              background: "#00A94F",
              borderRadius: "8px",
              textTransform: "none",
              marginLeft: "50px",
              color: "white",
              "&:hover": {
                backgroundColor: "#00A94F",
                color: "#fffff",
              },
            }}
            variant="contained"
            disabled={file ? false : true}
            onClick={() => submitPolicy()}
            id={`usege-policy-apply-btn`}
            data-testid="usage_policy_apply_btn"
          >
            Apply
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default UsagePolicy;
