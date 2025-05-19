import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import HTTPService from "../../../Services/HTTPService";
import UrlConstant from "../../../Constants/UrlConstants";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{
              background: "none",
              borderRadius: 0,
              ":hover": {
                background: "none",
              },
            }}
          >
            {open ? (
              <>
                {" "}
                <KeyboardArrowUpIcon />{" "}
                <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                  Chunks
                </span>
              </>
            ) : (
              <>
                {" "}
                <KeyboardArrowDownIcon />
                <span style={{ fontSize: "13px", fontWeight: "bold" }}>
                  Chunks
                </span>
              </>
            )}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.query}
        </TableCell>
        {/* <TableCell align="left">
          <div
            style={{
              display: "flex",
              height: "100px",
              minHeight: "100px",
              maxHeight: "100px",
              overflow: "auto",
            }}
          >
            {row.condensed_question}
          </div>
        </TableCell> */}
        <TableCell align="left">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100px",
              minHeight: "100px",
              maxHeight: "100px",
              overflowX: "hidden",
              overflowY: "auto",
              maxWidth: "350px",
              wordWrap: "break-word",
            }}
          >
            {row.query_response}
          </div>
        </TableCell>
        <TableCell className="feedback_system" align="left">
          {row.feedback === "Liked" ? (
            <ThumbUpIcon className="thumbs_up" />
          ) : row.feedback === "Disliked" ? (
            <ThumbDownIcon color="error" className="thumbs_down" />
          ) : (
            "Not Available"
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Retrieved Chunks
              </Typography>
              {row.retrieved_chunks?.length > 0 ? (
                <Table size="small" aria-label="retrieved data">
                  <TableHead>
                    <TableRow>
                      <TableCell>Chunk Content</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.retrieved_chunks.map((chunk, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {chunk}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                "There are no chunks"
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
export default function RetrievalTable({ id }) {
  const [data, setData] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [nextUrl, setNextUrl] = useState(null);
  const [count, setCount] = useState(0);

  async function getMessages() {
    let url = UrlConstant.base_url + UrlConstant.resource_messages + id;
    await HTTPService("GET", url, "", false, true)
      .then((response) => {
        setShowLoader(false);
        setData(response?.data?.results);
        setCount(response?.data?.count);
        setNextUrl(response?.data?.next);
      })
      .catch(async (e) => {
        setShowLoader(false);
        console.error("Error fetching messages:", e);
      });
  }

  async function fetchNextMessages() {
    if (nextUrl) {
      setShowLoader(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await HTTPService("GET", nextUrl, "", false, true)
        .then((response) => {
          setData([...data, ...response?.data?.results]);
          setNextUrl(response?.data?.next);
          setShowLoader(false);
        })
        .catch((error) => {
          console.error("Error fetching next messages:", error);
          setShowLoader(false);
        });
    }
  }

  useEffect(() => {
    if (id) {
      getMessages();
    }
  }, [id]);

  return (
    <Box
      id="scrollableDiv"
      sx={{
        height: "400px",
        overflow: "auto",
        transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        borderRadius: "4px",
        boxShadow:
          "rgba(0, 0, 0, 0.2) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px",
      }}
    >
      <InfiniteScroll
        dataLength={data?.length}
        next={fetchNextMessages}
        hasMore={nextUrl}
        loader={<div className="loader" key="loader"></div>}
        scrollableTarget="scrollableDiv"
      >
        <TableContainer component={Paper}>
          <Table
            stickyHeader
            className="retrieval_table"
            aria-label="collapsible table"
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "10%" }} />
                <TableCell
                  style={{ width: "20%", maxHeight: "100px", overflow: "auto" }}
                >
                  {"Query"}
                </TableCell>
                {/* <TableCell
                  align="left"
                  style={{ width: "20%", maxHeight: "100px", overflow: "auto" }}
                >
                  {"Condensed Query"}
                </TableCell> */}
                <TableCell
                  align="left"
                  style={{ width: "30%", maxHeight: "100px", overflow: "auto" }}
                >
                  {"Query Response"}
                </TableCell>
                <TableCell
                  align="left"
                  style={{ width: "20%", maxHeight: "100px", overflow: "auto" }}
                >
                  {"Feedback"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => (
                <Row key={row.name} row={row} />
              ))}
              {showLoader ? (
                <TableRow>
                  <TableCell colSpan={12}>
                    <Box
                      className="loader"
                      sx={{ width: "100%", textAlign: "center" }}
                    >
                      <CircularProgress color="success" />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </InfiniteScroll>
    </Box>
  );
}
