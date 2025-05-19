import React from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import CheckBoxWithText from "./CheckBoxWithText";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const DbConfiguration = (props) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  return (
    <div>
      <Typography
        sx={{
          fontFamily: "Montserrat !important",
          fontWeight: "400",
          fontSize: "14px",
          lineHeight: "19.42px",
          color: "#3D4A52",
          textAlign: "left",
        }}
      >
        Connect to your {props.dbName} database and import tables to XLS files
        for your dataset. You can select the columns which you want to import.{" "}
        <span style={{ fontWeight: 600 }}>
          Please make sure that you are connecting to readonly {props.dbName}{" "}
          database.
        </span>
      </Typography>
      <Typography
        sx={{
          fontFamily: "Montserrat !important",
          fontWeight: "400",
          fontSize: "14px",
          lineHeight: "19.42px",
          color: "#3D4A52",
          textAlign: "left",
        }}
      >
        Please refer{" "}
        <span style={{ textDecoration: "underline", color: "#0038FF" }}>
          help
        </span>{" "}
        section to know how to connect to {props.dbName}.
      </Typography>
      <TextField
        fullWidth
        required
        id={`${props.dbName}-upload-dataset-db-name-id`}
        helperText={
          <Typography
            sx={{
              fontFamily: "Montserrat !important",
              fontWeight: "400",
              fontSize: "12px",
              lineHeight: "18px",
              color: "#FF0000",
              textAlign: "left",
            }}
          >
            {!props.validator &&
            (!props.dbaseName !== null ||
              !props.dbaseName !== undefined ||
              !props.dbaseName !== "")
              ? ""
              : "Please enter the databse name is a mandatory field."}
          </Typography>
        }
        sx={{
          marginTop: "30px",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#919EAB",
            },
            "&:hover fieldset": {
              borderColor: "#919EAB",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#919EAB",
            },
          },
        }}
        placeholder="Database name"
        label="Database name"
        value={props.dbaseName}
        onChange={(e) => props.setDbaseName(e.target.value.trimStart())}
      />
      <TextField
        id={`${props.dbName}-upload-dataset-user-name-id`}
        fullWidth
        required
        helperText={
          <Typography
            sx={{
              fontFamily: "Montserrat !important",
              fontWeight: "400",
              fontSize: "12px",
              lineHeight: "18px",
              color: "#FF0000",
              textAlign: "left",
            }}
          >
            {!props.validator &&
            (!props.userName !== null ||
              !props.userName !== undefined ||
              !props.userName !== "")
              ? ""
              : "Please enter the username is a mandatory field."}
          </Typography>
        }
        sx={{
          marginTop: "30px",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#919EAB",
            },
            "&:hover fieldset": {
              borderColor: "#919EAB",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#919EAB",
            },
          },
        }}
        placeholder="User name"
        label="User name"
        value={props.userName}
        onChange={(e) => props.setUserName(e.target.value.trimStart())}
      />
      <TextField
        id={`${props.dbName}-upload-dataset-password-id`}
        fullWidth
        required
        helperText={
          <Typography
            sx={{
              fontFamily: "Montserrat !important",
              fontWeight: "400",
              fontSize: "12px",
              lineHeight: "18px",
              color: "#FF0000",
              textAlign: "left",
            }}
          >
            {!props.validator &&
            (!props.password !== null ||
              !props.password !== undefined ||
              !props.password !== "")
              ? ""
              : "Username or Password combination seems to be incorrect."}
          </Typography>
        }
        sx={{
          marginTop: "30px",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#919EAB",
            },
            "&:hover fieldset": {
              borderColor: "#919EAB",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#919EAB",
            },
          },
        }}
        placeholder="Password"
        label="Password"
        value={props.password}
        type={showPassword ? "text" : "password"}
        onChange={(e) => props.setPassword(e.target.value.trimStart())}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        id={`${props.dbName}-upload-dataset-database-host-url-id`}
        fullWidth
        required
        helperText={
          <Typography
            sx={{
              fontFamily: "Montserrat !important",
              fontWeight: "400",
              fontSize: "12px",
              lineHeight: "18px",
              color: "#FF0000",
              textAlign: "left",
            }}
          >
            {!props.validator &&
            (!props.dbUrl !== null ||
              !props.dbUrl !== undefined ||
              !props.dbUrl !== "")
              ? ""
              : "We are unable to find the database host. Please check and enter a valid URL."}
          </Typography>
        }
        sx={{
          marginTop: "30px",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#919EAB",
            },
            "&:hover fieldset": {
              borderColor: "#919EAB",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#919EAB",
            },
          },
        }}
        placeholder="Database host URL"
        label="Database host URL"
        value={props.dbUrl}
        onChange={(e) => props.setDbUrl(e.target.value.trimStart())}
      />
      <TextField
        id={`${props.dbName}-upload-dataset-port-id`}
        fullWidth
        required
        helperText={
          <Typography
            sx={{
              fontFamily: "Montserrat !important",
              fontWeight: "400",
              fontSize: "12px",
              lineHeight: "18px",
              color: "#FF0000",
              textAlign: "left",
            }}
          >
            {!props.validator &&
            (!props.port !== null ||
              !props.port !== undefined ||
              !props.port !== "")
              ? ""
              : "There seems to be an issue with the port number. It is either incorrect of not open for connections."}
          </Typography>
        }
        sx={{
          marginTop: "30px",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#919EAB",
            },
            "&:hover fieldset": {
              borderColor: "#919EAB",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#919EAB",
            },
          },
        }}
        placeholder="Port"
        label="Port"
        value={props.port}
        onChange={(e) => {
          const input = e.target.value.replace(/\D/g, ""); // replace all non-numeric characters with an empty string
          e.target.value = input.slice(0, 5); // limit input to 5 characters
          props.setPort(input.slice(0, 5)); // set the port value to the input, limited to 5 characters
        }}
      />
      {/* <CheckBoxWithText text={"Save credentials"} handleCheckBox={props.handleCheckBox} /> */}
      <Box sx={{ marginTop: "31px", textAlign: "end" }}>
        <Button
          sx={{
            fontFamily: "Montserrat",
            fontWeight: 700,
            fontSize: "16px",
            width: "44px",
            height: "48px",
            border: "none",
            borderRadius: "8px",
            color: "#00A94F",
            textTransform: "none",
            "&:hover": {
              background: "none",
              border: "none",
            },
          }}
          variant="outlined"
          onClick={() => props.handleClearFields()}
          id={`${props.dbName}-upload-dataset-clear-btn`}
        >
          Clear
        </Button>
        <Button
          sx={{
            fontFamily: "Montserrat",
            fontWeight: 700,
            fontSize: "16px",
            width: "171px",
            height: "48px",
            border: "1px solid rgba(0, 171, 85, 0.48)",
            borderRadius: "8px",
            color: "#00A94F",
            textTransform: "none",
            marginLeft: "60px",
            "&:hover": {
              background: "none",
              border: "1px solid rgba(0, 171, 85, 0.48)",
            },
          }}
          variant="outlined"
          disabled={
            props.dbaseName &&
            props.userName &&
            props.password &&
            props.dbUrl &&
            props.port
              ? false
              : true
          }
          onClick={() => props.handleConnect()}
          id={`${props.dbName}-upload-dataset-connect-btn`}
        >
          Connect
        </Button>
      </Box>
    </div>
  );
};

export default DbConfiguration;
