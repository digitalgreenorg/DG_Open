import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import global from "../../Assets/CSS/global.module.css";
function DeleteConfirmationModal({ open, handleClose, handleConfirm }) {
  // Styling for the modal box
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #00a94f",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  // Button styling
  const buttonSx = {
    mt: 3,
    display: "flex",
    justifyContent: "flex-end",
    gap: 2,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          Confirm Deletion
        </Typography>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          Are you sure you want to delete this resource? This action cannot be
          undone.
        </Typography>
        <Box sx={buttonSx}>
          <Button
            variant="contained"
            onClick={handleConfirm}
            sx={{
              backgroundColor: "#00a94f",
              "&:hover": { backgroundColor: "#007a3d" },
              textTransform: "capitalize",
            }}
          >
            Confirm
          </Button>
          <Button
            variant="outlined"
            className={global.secondary_button}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default DeleteConfirmationModal;
