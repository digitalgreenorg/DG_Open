import React from "react";
import { Chip } from "@mui/material";

function ChipsRenderer({ data }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        justifyContent: "start",
      }}
    >
      {data.map((item, index) => (
        <React.Fragment key={index}>
          {/* Map over the details array for each item */}
          {item.details.map((detail, detailIndex) => (
            <Chip
              key={detailIndex}
              label={detail}
              sx={{ backgroundColor: "#00a94f", color: "white" }}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

export default ChipsRenderer;
