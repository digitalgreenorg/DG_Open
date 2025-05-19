import React, { useContext, useEffect, useState } from "react";
import { Box, useMediaQuery, useTheme, Divider, Button } from "@mui/material";
import {
  getTokenLocal,
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
  toTitleCase,
} from "../../Utils/Common";
import labels from "../../Constants/labels";
import { FarmStackContext } from "../../Components/Contexts/FarmStackContext";
import UrlConstant from "../../Constants/UrlConstants";
import style from "./feedbacks.module.css";
import axios from "axios";
import DataTable from "../../Components/Table/DataTable";
import { useHistory } from "react-router-dom";

const Feedbacks = () => {
  const { callLoader, callToast } = useContext(FarmStackContext);
  const history = useHistory();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [viewColumns, setViewColumns] = useState([]);
  const [page, setPage] = useState(1);

  const columnMappings = {
    phone_number: "Phone number of FLEW",
    message_date: "Date of advisory retrieval",
    original_message: "Question asked by FLEW",
    message_response: "Bot answer",
    message_feedback_tags: "Tags given by FLEW on answer",
    message_rating: "Star rating on answer",
  };

  const getFeedbacks = () => {
    let accessToken = getTokenLocal() ?? false;
    let url = UrlConstant.feedback_bot_url;
    callLoader(true);
    axios
      .get(url)
      .then((response) => {
        callLoader(false);
        if (response?.data?.length) {
          // Get column names from the first item in the response data
          let tempColumns = Object.keys(response?.data?.[0]);

          // Define the elements to remove
          let elementsToRemove = [
            "first_name",
            "last_name",
            "phone",
            "message_date",
          ];

          // Filter out the elements to remove
          let tempUpdatedColumns = tempColumns.filter(
            (item) => !elementsToRemove.includes(item)
          );
          const dynamicViewColumns = tempUpdatedColumns
            .map((item) => {
              if (columnMappings[item]) {
                return columnMappings[item];
              }
              return item.replace(/_/g, " ");
            })
            .filter(
              (item) =>
                item !== "message id" &&
                item !== "message feedback" &&
                item !== "message feedback audios" &&
                item !== "message feedback date" &&
                item !== "message feedback description" &&
                item !== "message feedback images" &&
                item !== "message translated response" &&
                item !== "resource feedback" &&
                item !== "resource feedback audios" &&
                item !== "resource feedback date" &&
                item !== "resource feedback description" &&
                item !== "resource feedback images" &&
                item !== "resource feedback tags" &&
                item !== "resource rating" &&
                item !== "resource string" &&
                item !== "translated message"
            );
          setViewColumns(dynamicViewColumns);

          const dynamicColumns = tempUpdatedColumns.filter(
            (item) =>
              item !== "message_id" &&
              item !== "message_feedback" &&
              item !== "message_feedback_audios" &&
              item !== "message_feedback_date" &&
              item !== "message_feedback_description" &&
              item !== "message_feedback_images" &&
              item !== "message_translated_response" &&
              item !== "resource_feedback" &&
              item !== "resource_feedback_audios" &&
              item !== "resource_feedback_date" &&
              item !== "resource_feedback_description" &&
              item !== "resource_feedback_images" &&
              item !== "resource_feedback_tags" &&
              item !== "resource_rating" &&
              item !== "resource_string" &&
              item !== "translated_message"
          );
          setColumns(dynamicColumns);
          setRows(response?.data);
        }
      })
      .catch((err) => {
        callLoader(false);
      });
  };

  const exportData = async () => {
    try {
      callLoader(true);
      let baseUrl = UrlConstant.feedback_download_url;
      let accessToken = "";
      let fileName = "feedback.xlsx";

      const response = await fetch(baseUrl, {
        // headers: {
        //   Authorization: `Token ${accessToken}`,
        // },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName; // specify the desired file name
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      callLoader(false);
    } catch (error) {
      console.error("Error downloading file:", error);
      callLoader(false);
      callToast(
        "error",
        "something went wrong while downloading the file!",
        true
      );
    }
  };

  const viewData = (id) => {
    if (isLoggedInUserAdmin() || isLoggedInUserCoSteward()) {
      history.push(`/datahub/feedbacks/view/${id}`);
    } else if (isLoggedInUserParticipant()) {
      history.push(`/participant/feedbacks/view/${id}`);
    }
  };

  useEffect(() => {
    getFeedbacks();
  }, []);
  return (
    <Box>
      <Box
        className={
          mobile ? "title_sm" : tablet ? "title_md mt-50" : "title mt-50"
        }
      >
        {toTitleCase(labels.renaming_modules.feedback)} Explorer
      </Box>
      <Box className={style.description}>
        Empowering field-level workers with insightful data for better community
        support and impact.
      </Box>
      <Divider />
      <Box style={{ margin: "40px 40px" }}>
        <Box className="mt-30">
          <DataTable
            tableTitle={"Feedback table"}
            page={page}
            setPage={setPage}
            url={UrlConstant.feedback_bot_url}
            rows={rows}
            setRows={setRows}
            columns={columns}
            viewColumns={viewColumns}
            showSearch={false}
            viewData={viewData}
            action={
              <Button
                sx={{
                  fontFamily: "Montserrat",
                  fontWeight: 700,
                  fontSize: "16px",
                  width: "171px",
                  height: "48px",
                  border: "none",
                  borderRadius: "8px",
                  color: "#ffffff",
                  textTransform: "none",
                  background: "#00AB55",
                  "&:hover": {
                    background: "#00AB55",
                    border: "none",
                    color: "#fffff",
                  },
                }}
                onClick={() => exportData()}
              >
                Export Data
              </Button>
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Feedbacks;
