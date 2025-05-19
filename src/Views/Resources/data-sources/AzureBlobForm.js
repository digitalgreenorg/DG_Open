import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import styles from './S3Form.module.css';

const AzureBlobForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    account_url: '',
    account_key: '',
    container_name: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit('azure_blob', formData);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        // width: 300,
        padding: 5,
        boxShadow: 2,
        borderRadius: 2,
        backgroundColor: 'background.paper'
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
Azure details
      </Typography>
      <TextField
        label="Account URL"
        name="account_url"
        value={formData.account_url}
        onChange={handleChange}
        required
        variant="outlined"
        fullWidth
        size='small'
      />
      <TextField
        label="Account Key"
        name="account_key"
        value={formData.account_key}
        onChange={handleChange}
        required
        variant="outlined"
        fullWidth
        size='small'

      />
      <TextField
        label="Container Name"
        name="container_name"
        value={formData.container_name}
        onChange={handleChange}
        required
        variant="outlined"
        fullWidth
        size='small'

      />
      <Button type="submit" variant="contained" color="primary"
      
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
  );
};

export default AzureBlobForm;
