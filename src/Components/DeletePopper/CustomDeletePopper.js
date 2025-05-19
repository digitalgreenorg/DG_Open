import React from "react";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import LocalStyle from "./CustomDeletePopper.module.css";
import { Button, Typography } from "@mui/material";

const CustomDeletePopper = (props) => {
  const {
    anchorEl,
    handleDelete,
    id,
    open,
    closePopper,
    DeleteItem,
    deletePopperId,
    cancelPopperId,
  } = props;
  return (
    <Popper id={id} open={open} anchorEl={anchorEl} transition>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Box
            className={LocalStyle.popperContainer}
            sx={{ border: 1, p: 1, bgcolor: "background.paper" }}
          >
            <div className={`${LocalStyle.popperTitleContainer}`}>
              <img src={require("../../Assets/Img/delete_icon.svg")} />
              <Typography
                className={`${GlobalStyle.bold700} ${GlobalStyle.size18} ${GlobalStyle.highlighted_text}`}
                variant="h4"
              >
                {" "}
                Delete {DeleteItem}?
              </Typography>
            </div>
            <Typography
              variant="subtitle1"
              className={`${GlobalStyle.bold400} ${GlobalStyle.size16} ${GlobalStyle.light_text} ${LocalStyle.popperMessage}`}
            >
              Are you sure want to delete?
            </Typography>
            <div className={LocalStyle.popperButtonContainer}>
              <Button
                variant="outlined"
                className={`${GlobalStyle.outlined_button} ${LocalStyle.cancelButtonOnDelete}`}
                onClick={(e) => closePopper(e)}
                id={cancelPopperId}
                data-testid="closepopper"
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                className={`${GlobalStyle.primary_button} ${LocalStyle.deleteButton}`}
                onClick={(e) => handleDelete(e)}
                id={deletePopperId}
                data-testid="deletepopper"
              >
                Delete
              </Button>
            </div>
          </Box>
        </Fade>
      )}
    </Popper>
  );
};

export default CustomDeletePopper;
