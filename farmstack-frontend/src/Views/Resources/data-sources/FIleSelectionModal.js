import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Checkbox,
  Divider,
  Card,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const FileSelectionModal = ({
  showModal,
  setShowModal,
  files,
  handleFileSelection,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Handle master checkbox change (select/deselect all)
  const handleMasterCheckboxChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedFiles(files); // Select all files by adding the entire objects
    } else {
      setSelectedFiles([]); // Deselect all files
    }
  };

  // Handle individual file checkbox change
  const handleCheckboxChange = (file) => {
    setSelectedFiles(
      (prevSelected) =>
        prevSelected.includes(file)
          ? prevSelected.filter((item) => item !== file) // Deselect file
          : [...prevSelected, file] // Select file
    );
  };

  // Handle file submission
  const handleSubmit = () => {
    // Pass the selected files (full objects) to the parent component via the callback
    handleFileSelection(selectedFiles);
    setShowModal(false); // Close the modal after submission
    // setSelectedFiles([])
  };
  useEffect(() => {
    setSelectedFiles([]);
  }, [showModal]);

  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: "8px",
          boxShadow: 24,
          p: 4,
          maxHeight: "450px",
        }}
      >
        <>
          <Box className="d-flex justify-content-between align-items-baseline">
            <Typography sx={{ fontWeight: "600" }}>
              <Checkbox
                checked={selectAll}
                onChange={handleMasterCheckboxChange}
                color="primary"
                sx={{ padding: "0px 4px", marginBottom: "3px" }}
              />
              {`Selected Files (${selectedFiles.length})`}
            </Typography>
            <Box
              onClick={() => setShowModal(false)}
              className="text-right cursor-pointer"
            >
              <Button
                sx={{
                  fontFamily: "Montserrat",
                  fontWeight: 600,
                  fontSize: "14px",
                  height: "25px",
                  border: "1px solid rgba(0, 171, 85, 0.48)",
                  borderRadius: "8px",
                  color: "#00A94F",
                  textTransform: "none",
                  marginRight: "10px",
                  "&:hover": {
                    background: "none",
                    border: "1px solid rgba(0, 171, 85, 0.48)",
                  },
                }}
                variant="outlined"
                disabled={!selectedFiles.length}
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <CloseIcon />
            </Box>
          </Box>
          <Divider className="mt-10" />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridGap: "30px",
              maxHeight: "350px",
              overflow: "scroll",
              marginTop: "20px",
            }}
          >
            {files?.length ? (
              files.map((file, index) => (
                <Card
                  key={index}
                  sx={{ background: "#e6f7f0", borderRadius: "8px" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Tooltip title={file?.file_name}>
                      <Typography
                        sx={{
                          maxWidth: "120px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          padding: "6px",
                        }}
                      >
                        {file?.file_name || file?.url}
                      </Typography>
                    </Tooltip>
                    <Checkbox
                      checked={selectedFiles.includes(file)}
                      onChange={() => handleCheckboxChange(file)} // Pass full object to checkbox change handler
                    />
                  </Box>
                </Card>
              ))
            ) : (
              <Typography>No files available to select.</Typography>
            )}
          </Box>
        </>
      </Box>
    </Modal>
  );
};

export default FileSelectionModal;
