import React from "react";
import { Box, Checkbox, Typography } from "@mui/material";

const CheckBoxWithText = ({
  text,
  checked,
  handleCheckBox,
  isDisabled,
  keyName,
  keyIndex,
  keyIndexPassed,
  categoryKeyName,
  fontSize,
  customStyle,
}) => {
  const handleClick = () => {
    handleCheckBox();
  };

  const handleKey = (keyName) => {
    if (keyName && categoryKeyName) {
      handleCheckBox(categoryKeyName, keyName);
    } else if (keyName && keyIndexPassed) {
      handleCheckBox(keyName, keyIndex);
    } else {
      handleCheckBox(keyName);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", marginTop: "4px" }}>
      <div>
        <Checkbox
          id={`check-box-${keyIndex}`}
          sx={{
            "&.Mui-checked": {
              color: "#00A94F !important",
            },
          }}
          checked={checked}
          disabled={isDisabled ? true : false}
          onClick={() => (keyName ? handleKey(keyName) : handleClick())}
        />
      </div>
      <Typography
        sx={{
          fontFamily: "Montserrat !important",
          fontWeight: "400",
          fontSize: fontSize ? fontSize : "16px",
          lineHeight: "22px",
          color: "#212B36",
          textAlign: "left",
        }}
        style={customStyle}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default CheckBoxWithText;
