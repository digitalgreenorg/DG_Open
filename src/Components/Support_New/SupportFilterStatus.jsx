import { Card } from "@mui/material";
import React from "react";
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  FormLabel,
} from "@material-ui/core";
import { Box, Button } from "@mui/material";

export default function SupportFilterStatus({
  statusFilter,
  handleFilterByStatus,
  setShowFilter,
  setStatusFilter,
  getListOfTickets,
}) {
  const handleCheckboxChange = (e, checked) => {
    if (checked) {
      handleFilterByStatus(e, false);
    } else {
      setStatusFilter("");
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
            Select Status
          </FormLabel>
          <FormControlLabel
            control={
              <Checkbox
                checked={statusFilter === "open"}
                value="open"
                id="open"
                onChange={(e) => handleCheckboxChange(e, e.target.checked)}
              />
            }
            label="Open"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={statusFilter === "closed"}
                value="closed"
                id="closed"
                data-testid="closed"
                onChange={(e) => handleCheckboxChange(e, e.target.checked)}
              />
            }
            label="Closed"
          />
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
                setStatusFilter("");
                getListOfTickets();
              }}
              id="status-close-filter-id"
            >
              Close
            </Button>
          </Box>
        </FormControl>
      </Card>
    </>
  );
}
