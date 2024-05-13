import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import styles from "./InsuranceInformation.module.css"; // Import your module CSS file

const InsuranceInformation = (props) => {
  const { insuredCorps, insuredMachineries } = props;

  return (
    <>
      <Typography
        className={styles.title}
        variant="h4"
        sx={{ textAlign: "left" }}
      >
        Insurance Information
      </Typography>
      <div className={styles.container}>
        <Paper
          elevation={3}
          className={`${styles.counties} ${styles.demographyCard}`}
        >
          <Typography variant="h6">Insured Crops</Typography>
          <Typography variant="body1" className={`${styles.valueClass}`}>
            {insuredCorps}
          </Typography>
        </Paper>
        <Divider orientation="vertical" />

        <Paper
          elevation={3}
          className={`${styles.female} ${styles.demographyCard}`}
        >
          <Typography variant="h6">Insured machineries</Typography>
          <Typography variant="body1" className={`${styles.valueClass} `}>
            {insuredMachineries}
          </Typography>
        </Paper>
      </div>
    </>
  );
};

export default InsuranceInformation;
