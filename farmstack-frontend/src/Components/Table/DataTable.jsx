import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputBase,
  IconButton,
  Typography,
  Chip,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { getTokenLocal, isArray, isHttpOrHttpsLink } from "../../Utils/Common";
import axios from "axios";
import StarIcon from "@mui/icons-material/Star";
import sortIcon from "../../Assets/Img/sort_icon.svg";
import { useHistory } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import CommentIcon from "@mui/icons-material/Comment";
import style from "./datatable.module.css";
import useInfiniteScroll from "../../hooks/useInfinite";

const DataTable = (props) => {
  // const [isFetching, setIsFetching] = useInfiniteScroll(moreData);

  const sortData = (column) => {};

  // function moreData() {
  //   let url = `${props.url}?page=${props.page}&sort=latest`;
  //   axios.get(url).then((res) => {
  //     props.setRows([...props.rows, ...res.data]);
  //     props.setPage(props.page + 1);
  //     setIsFetching(false);
  //   });
  // }

  function chips(chipName) {
    return (
      <Chip
        sx={{
          height: "auto",
          "& .MuiChip-label": {
            display: "block",
            whiteSpace: "normal",
          },
        }}
        label={
          chipName ? (
            isHttpOrHttpsLink(chipName) ? (
              <a href={chipName} target="_blank" rel="noopener noreferrer">
                {chipName}
              </a>
            ) : (
              chipName
            )
          ) : (
            "NA"
          )
        }
        color="success"
        className="mb-2"
        variant="outlined"
      />
    );
  }

  function mapElements(variable) {
    let elements = [];
    let tempArr = variable.forEach((ele) => {
      elements.push(chips(ele));
    });
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "baseline",
        }}
      >
        {elements}
      </div>
    );
  }

  return (
    <Box>
      <Paper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            padding: "15px 20px 20px 20px",
          }}
        >
          <Typography className={style.title} variant="h6">
            {props.tableTitle}
          </Typography>
          {props.showSearch && (
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                width: 400,
              }}
            >
              <IconButton sx={{ p: "10px" }} aria-label="menu">
                <CommentIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search feedback"
                inputProps={{ "aria-label": "search feedback" }}
              />
              <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
          )}
          {props.action && props.action}
        </Box>
        <TableContainer
          sx={{
            borderRadius: "10px",
            maxHeight: 440,
            "& .MuiTableCell-root": {
              borderLeft: "1px solid rgba(224, 224, 224, 1)",
            },
            borderTop: "1px solid rgba(224, 224, 224, 1)",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {props.viewColumns.map((column, index) => (
                  <TableCell
                    key={index}
                    align="left"
                    style={{
                      left: 0,
                      zIndex: 1,
                      background: "#FFFFFF",
                      color: "#3D4A52",
                      fontSize: "16px",
                      fontWeight: 600,
                      lineHeight: "18px",
                      textTransform: "capitalize",
                    }}
                  >
                    <Box
                      className="d-flex"
                      sx={{ width: "max-content" }}
                      //   onClick={() => sortData(column)}
                    >
                      <span>{column}</span>
                      {/* <img
                        src={sortIcon}
                        alt="sort"
                        style={{
                          height: "18px",
                          width: "auto",
                          cursor: "pointer",
                        }}
                      /> */}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.rows?.length ? (
                props.rows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#DEFFF1",
                      },
                    }}
                    onClick={() => props.viewData(row.message_id)}
                  >
                    {props.columns.map((column, index) => (
                      <TableCell
                        key={index}
                        align="left"
                        sx={{
                          zIndex: 1,
                          left: 0,
                          color: "#3D4A52",
                          fontSize: "16px",
                          fontWeight: 400,
                          lineHeight: "18px",
                          cursor: "pointer",
                          // maxWidth: "300px",
                          // whiteSpace: "nowrap",
                          // overflow: "hidden",
                          // textOverflow: "ellipsis",
                        }}
                      >
                        {row[column] ? (
                          isArray(row[column]) ? (
                            mapElements(row[column])
                          ) : isHttpOrHttpsLink(row[column]) ? (
                            <a
                              href={row[column]}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {row[column]}
                            </a>
                          ) : column === "message_rating" ||
                            column === "resource_rating" ? (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {row[column] ?? "NA"}
                              <StarIcon style={{ height: "18px" }} />
                            </div>
                          ) : (
                            row[column]
                          )
                        ) : (
                          "NA"
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontFamily: "Montserrat, sans-serif",
                      fontSize: "32px",
                      fontWeight: "400",
                      lineHeight: 3,
                    }}
                    colSpan={12}
                  >
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DataTable;
