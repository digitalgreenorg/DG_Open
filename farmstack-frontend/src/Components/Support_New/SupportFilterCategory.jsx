import { Card } from "@mui/material";
import React from "react";
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  FormLabel,
} from "@material-ui/core";
import { Box, Button } from "@mui/material";

export default function SupportFilterCategory({
  categoryFilter,
  handleFilterByCategory,
  setShowFilter,
  setCategoryFilter,
  getListOfTickets,
}) {
  const handleCheckboxChange = (e, checked) => {
    if (checked) {
      handleFilterByCategory(e, false);
    } else {
      setCategoryFilter("");
      getListOfTickets();
    }
  };
  return (
    <>
      <Card
        sx={{
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          padding: "15px",
          width: "650px",
          marginTop: "10px",
          marginLeft: "400px",
          borderRadius: "12px",
        }}
      >
        <FormControl fullWidth sx={{ width: "330px" }} className="mt-30">
          <FormLabel
            style={{
              color: "black",
              textAlign: "left",
              fontFamily: "Montserrat",
              fontWeight: 700,
              fontSize: "16px",
            }}
          >
            Select Category
          </FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                checked={categoryFilter === "certificate"}
                value="certificate"
                id="certificate"
                onChange={(e) => handleCheckboxChange(e, e.target.checked)}
              />
            }
            label="Certificate"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={categoryFilter === "connectors"}
                value="connectors"
                id="connectors"
                onChange={(e) => handleCheckboxChange(e, e.target.checked)}
              />
            }
            label="Connectors"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={categoryFilter === "datasets"}
                value="datasets"
                id="datasets"
                onChange={(e) => handleCheckboxChange(e, e.target.checked)}
              />
            }
            label="Datasets"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={categoryFilter === "user_accounts"}
                value="user_accounts"
                id="user_accounts"
                onChange={(e) => handleCheckboxChange(e, e.target.checked)}
              />
            }
            label="User_accounts"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={categoryFilter === "usage_policy"}
                value="usage_policy"
                id="usage_policy"
                onChange={(e) => handleCheckboxChange(e, e.target.checked)}
              />
            }
            label="Usage_policy"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={categoryFilter === "others"}
                value="others"
                id="others"
                onChange={(e) => handleCheckboxChange(e, e.target.checked)}
              />
            }
            label="Others"
          />
        </FormControl>
        <Box className={`mt-20 mb-20 ${"text-right mr-20"}`}>
          <Button
            sx={{
              fontFamily: "Montserrat",
              fontWeight: 700,
              fontSize: "14px",
              width: "86px",
              height: "36px",
              textTransform: "none",
              marginRight: "30px",
            }}
            style={{
              color: "#00A94F",
              border: "1px solid rgba(0, 171, 85, 0.48)",
              borderRadius: "8px",
            }}
            variant="outlined"
            onClick={() => {
              setShowFilter(false);
              setCategoryFilter("");
              getListOfTickets();
            }}
            id="category-close-filter-id"
          >
            Close
          </Button>
        </Box>
      </Card>
    </>
  );
}
