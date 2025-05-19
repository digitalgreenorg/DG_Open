import React, { useState, useContext } from "react";
import Axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";
import HTTPService from "../../../Services/HTTPService";
import { getTokenLocal } from "../../../Utils/Common";
import styles from "./S3Form.module.css";
import { FarmStackContext } from "../../../Components/Contexts/FarmStackContext";
import UrlConstant from "../../../Constants/UrlConstants";

const S3Form = ({ onFetchComplete, setShowCloudModal }) => {
  const { callLoader, callToast } = useContext(FarmStackContext);
  const [formData, setFormData] = useState({
    aws_access_key_id: "",
    aws_secret_access_key: "",
    region: "",
    bucket_name: "",
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
      source_type: "s3",
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
        console.error("Error fetching S3 files:", error);
        callToast(
          error?.response?.data ||
            "Something went wrong while fecting S3 bucket",
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
          S3 Bucket details
        </Typography>
        <TextField
          label="AWS Access Key ID"
          name="aws_access_key_id"
          value={formData.aws_access_key_id}
          onChange={handleChange}
          required
          variant="outlined"
          fullWidth
          className={styles.input}
          size="small"
        />
        <TextField
          label="AWS Secret Access Key"
          name="aws_secret_access_key"
          value={formData.aws_secret_access_key}
          onChange={handleChange}
          required
          variant="outlined"
          fullWidth
          className={styles.input}
          size="small"
        />
        <TextField
          label="Region"
          name="region"
          value={formData.region}
          onChange={handleChange}
          required
          variant="outlined"
          fullWidth
          className={styles.input}
          size="small"
        />
        <TextField
          label="Bucket Name"
          name="bucket_name"
          value={formData.bucket_name}
          onChange={handleChange}
          required
          variant="outlined"
          fullWidth
          className={styles.input}
          size="small"
        />
        <Button
          disabled={
            !formData.aws_access_key_id ||
            !formData.aws_secret_access_key ||
            !formData.bucket_name ||
            !formData.region
          }
          type="submit"
          variant="contained"
          color="primary"
          className={styles.button}
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

export default S3Form;
