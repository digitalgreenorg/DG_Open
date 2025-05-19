import React from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Avatar,
} from "@mui/material";
import { dateTimeFormat, toTitleCase } from "../../Utils/Common";
import labels from "../../Constants/labels";
import {
  FaBuilding,
  FaDatabase,
  FaCalendarAlt,
  FaRegFileAlt,
} from "react-icons/fa";
import UrlConstant from "../../Constants/UrlConstants";

const ResourceList = ({ resources, history, value, handleCardClick }) => {
  const cellStyle = {
    maxWidth: 180, // Set maximum width for truncation
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    borderBottom: "none",
  };

  return (
    <TableContainer elevation={2} sx={{ mt: 2, mx: 2 }}>
      <Table aria-label="simple table" sx={{ borderCollapse: "collapse" }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f0f0f0", height: 20 }}>
            <TableCell sx={{ ...cellStyle, fontWeight: 400 }}>
              {toTitleCase(labels.renaming_modules.resource)} name
            </TableCell>
            <TableCell sx={{ ...cellStyle, fontWeight: 400 }}>
              Organisation
            </TableCell>
            <TableCell sx={{ fontWeight: 400, borderBottom: "none" }}>
              No. of assets
            </TableCell>
            <TableCell sx={{ fontWeight: 400, borderBottom: "none" }}>
              Published on
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {resources?.map((item) => (
            <TableRow
              key={item?.id}
              hover
              onClick={() =>
                history.push(handleCardClick(item?.id), { tab: value })
              }
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f5f5f5" },
                height: 40,
                borderBottom: "0.5px solid",
              }}
              id={`${item?.title?.split(" ").join("-")}-dataset-list-view-card`}
            >
              <TableCell sx={{ ...cellStyle, fontWeight: 400 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FaRegFileAlt style={{ marginRight: 8, color: "gray" }} />
                  <div
                    style={{
                      maxWidth: 250, // Set maximum width for truncation
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      borderBottom: "none",
                    }}
                  >
                    {item?.title}
                  </div>
                </Box>
              </TableCell>
              <TableCell sx={{ ...cellStyle, fontWeight: 400 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {/* <FaBuilding style={{ marginRight: 8, color: "gray" }} /> */}
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      marginRight: 1,
                      bgcolor: "secondary.main",
                    }}
                    src={UrlConstant.base_url + item?.organization?.logo || ""}
                    alt={item?.organization?.name}
                    imgProps={{
                      onError: (e) => {
                        e.target.onerror = null;
                        e.target.src = "path_to_default_image_if_needed";
                      },
                    }}
                  >
                    {!item?.organization?.logo
                      ? item?.organization?.name[0]
                      : ""}
                  </Avatar>
                  {item?.organization?.name}
                </Box>
              </TableCell>

              <TableCell sx={{ fontWeight: 400, borderBottom: "none" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FaDatabase style={{ marginRight: 8, color: "gray" }} />
                  {item?.content_files_count.reduce(
                    (accumulator, currentValue) =>
                      accumulator + currentValue.count,
                    0
                  )}
                </Box>
              </TableCell>
              <TableCell
                sx={{ fontWeight: 400, borderBottom: "none" }}
                align="center"
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FaCalendarAlt style={{ marginRight: 8, color: "gray" }} />
                  {item?.created_at
                    ? dateTimeFormat(item?.created_at, false)
                    : "NA"}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResourceList;
