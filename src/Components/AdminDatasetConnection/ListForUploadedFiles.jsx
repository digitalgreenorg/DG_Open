import * as React from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Divider, IconButton, Avatar, ListItemAvatar } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

export default function ListForUploadedFiles({ data }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: 400,
        maxWidth: 360,
        bgcolor: "background.paper",
        overflowY: "scroll",
      }}
    >
      {data?.data?.map((item, index) => {
        console.log(item, "item");
        return (
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <DescriptionOutlinedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={item} secondary="Jan 9, 2014" />
            <IconButton edge="end" aria-label="delete">
              <DeleteOutlinedIcon
                // onClick={() => handleDeleteExportedFile(item, index)}
                color="warning"
              />
            </IconButton>
            <Divider />
          </ListItem>
        );
      })}
    </Box>
  );
}
