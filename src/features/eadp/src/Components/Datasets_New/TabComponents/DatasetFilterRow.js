import React from "react";
import {
  Button,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  TextField,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Row, Col } from "react-bootstrap";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function DatasetFilerRow(props) {
  const {
    fieldSets,
    setFieldSets,
    showDeleteButton,
    setShowDeleteButton,
    allColumns,
  } = props;
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));

  const containerStyle = {
    width: mobile || tablet ? "100%" : "955px",
  };

  const handleAddMore = () => {
    const newId = fieldSets.length;
    setFieldSets([...fieldSets, { id: newId }]);
    setShowDeleteButton([...showDeleteButton, true]);
  };
  const handleDelete = (index) => {
    const updatedDeleteButtons = [...showDeleteButton];
    updatedDeleteButtons.splice(index, 1);
    setShowDeleteButton(updatedDeleteButtons);

    const updatedFieldSets = [...fieldSets];
    updatedFieldSets.splice(index, 1);
    setFieldSets(updatedFieldSets);
  };
  const handleClearField = (index) => {
    const updatedFieldSets = [...fieldSets];
    updatedFieldSets[index] = {
      column_name: null,
      operation: null,
      value: null,
    };
    setFieldSets(updatedFieldSets);
  };

  const handleColumnChange = (index, value) => {
    const updatedFieldSets = [...fieldSets];
    updatedFieldSets[index].column_name = value;
    setFieldSets(updatedFieldSets);
  };

  const handleConditionChange = (index, value) => {
    const updatedFieldSets = [...fieldSets];
    updatedFieldSets[index].operation = value;
    setFieldSets(updatedFieldSets);
  };

  const handleValueChange = (index, value) => {
    const updatedFieldSets = [...fieldSets];
    updatedFieldSets[index].value = value;
    setFieldSets(updatedFieldSets);
  };

  return (
    <>
      <Row style={containerStyle}>
        <Col>
          <Row style={{ marginBottom: "20px" }}>
            <Col>
              <Typography
                sx={{
                  fontFamily: "Montserrat !important",
                  fontWeight: "600",
                  fontSize: "20px",
                  lineHeight: "24px",
                  color: "#000000",
                  textAlign: "left",
                  marginTop: "30px",
                  marginBottom: "10px",
                }}
              >
                Filtered Column
              </Typography>
            </Col>
            <Col
              style={{
                textAlign: "end",
                marginTop: "20px",
                marginRight: "20px",
              }}
            >
              <Button
                sx={{
                  fontFamily: "Montserrat",
                  fontWeight: 700,
                  fontSize: "16px",
                  width: "44px",
                  height: "48px",
                  border: "none",
                  borderRadius: "8px",
                  color: "#00A94F",
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    background: "none",
                    border: "none",
                  },
                }}
                variant="outlined"
                onClick={handleAddMore}
              >
                + Add more
              </Button>
            </Col>
          </Row>
          {fieldSets?.map((fieldSet, index) => (
            <>
              <Divider style={{ marginBottom: "20px" }} />
              <Row key={fieldSet.id} style={{ marginBottom: "20px" }}>
                <Col>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="demo-multiple-name-label">
                      Select Column
                    </InputLabel>
                    {
                      <Select
                        style={{
                          width: mobile || tablet ? "400px" : "",
                          marginBottom: mobile || tablet ? "15px" : "",
                        }}
                        labelId={`column-label-${index}`}
                        label="Select Column"
                        id={`column-label-${index}`}
                        fullWidth
                        required
                        value={fieldSet?.column_name || ""}
                        onChange={(e) =>
                          handleColumnChange(index, e.target.value)
                        }
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {allColumns?.map((selectedCol, index) => {
                          return selectedCol?.checked ? (
                            <MenuItem
                              key={selectedCol?.value}
                              value={selectedCol?.value}
                            >
                              {selectedCol?.value}
                            </MenuItem>
                          ) : (
                            ""
                          );
                        })}
                      </Select>
                    }
                  </FormControl>
                </Col>
                <Col>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id={`operation-label-${index}`}>
                      Select Condition
                    </InputLabel>
                    {
                      <Select
                        style={{
                          width: mobile || tablet ? "400px" : "",
                          marginBottom: mobile || tablet ? "15px" : "",
                        }}
                        labelId={`operation-label-${index}`}
                        id={`operation-label-${index}`}
                        label="Select Condition"
                        fullWidth
                        required
                        value={fieldSet?.operation || ""}
                        onChange={(e) =>
                          handleConditionChange(index, e.target.value)
                        }
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={"="}>equal to </MenuItem>
                        <MenuItem value={"!="}>Not equal to</MenuItem>
                        <MenuItem value={">="}>Greater Than Equal To</MenuItem>
                        <MenuItem value={"<="}>Less Than Equal To</MenuItem>
                      </Select>
                    }
                  </FormControl>
                </Col>
                <Col>
                  <TextField
                    style={{
                      width: mobile || tablet ? "400px" : "",
                      marginBottom: mobile || tablet ? "15px" : "",
                    }}
                    id="add-participant-mail-id"
                    label="value"
                    type="text"
                    fullWidth
                    required
                    value={fieldSet?.value || ""}
                    onChange={(e) =>
                      handleValueChange(index, e.target.value.trimStart())
                    }
                  />
                </Col>
                <Col>
                  {showDeleteButton[index] ? (
                    <IconButton
                      style={{
                        width: mobile || tablet ? "400px" : "",
                        marginBottom: mobile || tablet ? "15px" : "",
                      }}
                      id={`delete-${index}-icon-filtered-data`}
                      onClick={() => handleDelete(index)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      style={{
                        width: mobile || tablet ? "400px" : "",
                        marginBottom: mobile || tablet ? "15px" : "",
                      }}
                      id={`delete-${index}-icon-filtered-data`}
                      onClick={() => handleClearField(index)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  )}
                </Col>
              </Row>
            </>
          ))}
        </Col>
      </Row>
    </>
  );
}
