import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Radio,
  FormControlLabel,
  RadioGroup,
  Switch,
} from "@mui/material";

const ApiConfiguration = (props) => {
  const [focusedApi, setFocusedApi] = useState(false);
  const [focusedAuthToken, setFocusedAuthToken] = useState(false);
  const [focusedApiKeyName, setFocusedApiKeyName] = useState(false);
  const [focusedApiKeyValue, setFocusedApiKeyValue] = useState(false);
  const [focusedExportFileName, setFocusedExportFileName] = useState(false);

  // Helper function to check if the field is valid
  const isFieldValid = (fieldValue) => fieldValue && fieldValue.trim() !== "";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        // width: 300,
        padding: 5,
        boxShadow: 2,
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Typography
        sx={{
          fontFamily: "Montserrat !important",
          fontWeight: "600",
          fontSize: "16px",
          lineHeight: "24px",
          color: "#212B36",
          textAlign: "left",
        }}
      >
        Connection Name
      </Typography>

      <TextField
        id={`upload-dataset-api-url-id`}
        fullWidth
        required
        size="small"
        helperText={
          (!focusedApi && !props.api) || !isFieldValid(props.api)
            ? "Please enter the API (mandatory field)."
            : ""
        }
        error={!isFieldValid(props.api) && focusedApi}
        onFocus={() => setFocusedApi(true)}
        sx={{
          marginBottom: "20px",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#919EAB",
            },
            "&:hover fieldset": {
              borderColor: "#919EAB",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00A94F",
            },
          },
        }}
        placeholder="API"
        label="API"
        value={props.api}
        onChange={(e) => props.setApi(e.target.value.trimStart())}
        InputProps={{
          startAdornment: <InputAdornment position="start">GET</InputAdornment>,
        }}
      />

      <FormControl fullWidth sx={{ marginBottom: "20px" }}>
        <InputLabel>Auth Type</InputLabel>
        <Select
          size="small"
          label="Auth Type"
          value={props.authType}
          onChange={(e) => props.setAuthType(e.target.value)}
          required
          sx={{
            textAlign: "left",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#919EAB",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00A94F",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00A94F",
            },
          }}
        >
          {props.authTypes?.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {props.authType && props.authType !== "NO_AUTH" && (
        <Box>
          {props.authType === "BEARER" ? (
            <TextField
              size="small"
              id={`upload-dataset-api-auth-token-id`}
              fullWidth
              required
              helperText={
                (!focusedAuthToken && !props.authToken) ||
                !isFieldValid(props.authToken)
                  ? "Please enter the auth token (mandatory field)."
                  : ""
              }
              error={!isFieldValid(props.authToken) && focusedAuthToken}
              onFocus={() => setFocusedAuthToken(true)}
              sx={{ marginBottom: "20px", borderRadius: "8px" }}
              placeholder="Auth token"
              label="Auth token"
              value={props.authToken}
              onChange={(e) => props.setAuthToken(e.target.value.trimStart())}
            />
          ) : (
            <>
              <TextField
                size="small"
                id={`upload-dataset-api-key-id`}
                fullWidth
                required
                helperText={
                  (!focusedApiKeyName && !props.authApiKeyName) ||
                  !isFieldValid(props.authApiKeyName)
                    ? "Please enter the API Key Name (mandatory field)."
                    : ""
                }
                error={!isFieldValid(props.authApiKeyName) && focusedApiKeyName}
                onFocus={() => setFocusedApiKeyName(true)}
                sx={{ marginBottom: "20px", borderRadius: "8px" }}
                placeholder="Api Key Name"
                label="Api Key Name"
                value={props.authApiKeyName}
                onChange={(e) =>
                  props.setAuthApiKeyName(e.target.value.trimStart())
                }
              />
              <TextField
                id={`upload-dataset-api-key-value-id`}
                size="small"
                fullWidth
                required
                helperText={
                  (!focusedApiKeyValue && !props.authApiKeyValue) ||
                  !isFieldValid(props.authApiKeyValue)
                    ? "Please enter the API Key Value (mandatory field)."
                    : ""
                }
                error={
                  !isFieldValid(props.authApiKeyValue) && focusedApiKeyValue
                }
                onFocus={() => setFocusedApiKeyValue(true)}
                sx={{ marginBottom: "20px", borderRadius: "8px" }}
                placeholder="Api Key Value"
                label="Api Key Value"
                value={props.authApiKeyValue}
                onChange={(e) =>
                  props.setAuthApiKeyValue(e.target.value.trimStart())
                }
              />
            </>
          )}
        </Box>
      )}
      {!props.isContent ? <>
      <Typography
        sx={{ fontWeight: "600", fontSize: "14px", color: "#212B36", textAlign: "left" }}
      >
        Select Frequency
      </Typography>
      <RadioGroup
        row
        value={props.frequency}
        onChange={(e) => props.setFrequency(e.target.value)}
      >
        <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
        <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
      </RadioGroup>

      {/* Toggle for File Naming Preference */}
      <FormControlLabel
        control={
          <Switch
            checked={props.useSameFile}
            onChange={() => props.setUseSameFile(!props.useSameFile)}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: "#00A94F !important", // Thumb color when checked
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#00A94F !important", // Track color when checked
              },
            }}
          />
        }
        label={
          props.useSameFile
            ? "Use same file for updates"
            : "Create a new file each time"
        }
      />
      </> : null}

      <TextField
        id={`upload-dataset-api-name-of-import-file-id`}
        fullWidth
        required
        size="small"
        helperText={
          (!focusedExportFileName && !props.exportFileName) || !isFieldValid(props.exportFileName)
            ? "Please enter the export file name (mandatory field)."
            : ""
        }
        error={!isFieldValid(props.exportFileName) && focusedExportFileName}
        onFocus={() => setFocusedExportFileName(true)}
        sx={{
          marginBottom: "20px",
          borderRadius: "8px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#919EAB",
            },
            "&:hover fieldset": {
              borderColor: "#919EAB",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00A94F",
            },
          },
        }}
        placeholder="Name of import file"
        label="Name of import file"
        value={props.exportFileName}
        onChange={(e) => {
          props.setExportFileName(e.target.value.trimStart());
        }}
      />

      <Box sx={{ textAlign: "right" }}>
        <Button
          id={`upload-dataset-api-import-btn`}
          sx={{
            color: "white",
            fontFamily: "Montserrat",
            fontWeight: 700,
            fontSize: "14px",
            width: "fit-content",
            height: "40px",
            background: "#00A94F",
            borderRadius: "8px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#008b3d",
              boxShadow: "0px 4px 15px rgba(0, 171, 85, 0.4)",
              color: "#ffffff",
            },
            "&:disabled": {
              backgroundColor: "#d0d0d0",
              color: "#ffffff",
            },
          }}
          variant="outlined"
          disabled={
            !props.api ||
            (props.authType === "NO_AUTH"
              ? false
              : props.authType === "API_KEY"
              ? !(props.authApiKeyName && props.authApiKeyValue)
              : props.authType === "BEARER" && !props.authToken) ||
              !isFieldValid(props.exportFileName)
            }
          onClick={() => props.handleExport()}
          data-testid="restapi_import_btn"
        >
          Import
        </Button>
      </Box>
    </Box>
  );
};

export default ApiConfiguration;
