import React, { useState, useContext } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import Axios from "axios";
import { getTokenLocal } from "../../../Utils/Common";
import styles from "./S3Form.module.css"; 
import { FarmStackContext } from "../../../Components/Contexts/FarmStackContext";
import UrlConstant from "../../../Constants/UrlConstants";

const DropboxForm = ({ onFetchComplete, setShowCloudModal }) => {
  const { callLoader, callToast } = useContext(FarmStackContext);
  const [formData, setFormData] = useState({
    access_token: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = "POST";
    const accesstoken = getTokenLocal();
    const url = UrlConstant.base_url + UrlConstant.content_file;
    const payload = {
      source_type: "dropbox",
      details: formData,
    };
    callLoader(true);
    Axios({
      method: method,
      url: url,
      data: payload,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accesstoken,
      },
    })
      .then((response) => {
        callLoader(false);
        const files = response.data.files;
        onFetchComplete(files);
        setShowCloudModal(true);
      })
      .catch((error) => {
        callLoader(false);
        console.log(e);
        callToast(
          error?.response?.data || "Something went wrong while fecting dropbox",
          "error",
          true
        );
      });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
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
          Dropbox details
        </Typography>
        <TextField
          label="Dropbox Access Token"
          name="access_token"
          value={formData.access_token}
          onChange={handleChange}
          required
          variant="outlined"
          fullWidth
          className={styles.input} // Apply your custom styles if needed
          size="small"
        />
        <Button
          disabled={!formData.access_token}
          type="submit"
          variant="contained"
          color="primary"
          className={styles.button} // Apply your custom styles if needed
          sx={{
            fontFamily: "Montserrat",
            fontWeight: 700,
            fontSize: "14px",
            width: "fit-content",
            height: "40px",
            background: "#00A94F",
            borderRadius: "8px",
            textTransform: "none",
            // marginLeft: "25px",
            transition: "all 0.3s ease",
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
        >
          Fetch
        </Button>
      </Box>
    </form>
  );
};

export default DropboxForm;
