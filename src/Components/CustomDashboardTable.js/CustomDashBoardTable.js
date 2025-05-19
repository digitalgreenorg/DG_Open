import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import localStyle from "./customDashBoardTable.module.css";
import { useHistory } from "react-router-dom";
import EmptyFile from "../Datasets_New/TabComponents/EmptyFile";
import { Button } from "@mui/material";
import GlobalStyle from "../../Assets/CSS/global.module.css";
import {
  isLoggedInUserAdmin,
  isLoggedInUserCoSteward,
  isLoggedInUserParticipant,
} from "../../Utils/Common";

function CustomDashBoardTable(props) {
  const { data, title, recentDatasetTable, subTitle } = props;
  const history = useHistory();

  return (
    <Box className={localStyle.container}>
      <TableContainer component={Paper}>
        {!data?.length ? (
          <>
            <div className={`${localStyle.title}`}>
              <p>{title}</p>
            </div>
            <div className={localStyle.noDatasetText}>
              <EmptyFile
                text={recentDatasetTable ? "No datasets" : "No connectors"}
              />
              <Button
                id="add-participant-submit-button"
                data-testid="add-participant-submit-button-test"
                onClick={() =>
                  // recentDatasetTable
                  //   ? history.push("/datahub/new_datasets/add")
                  //   : history.push("/datahub/connectors/add")
                  recentDatasetTable &&
                  (isLoggedInUserAdmin() || isLoggedInUserCoSteward())
                    ? history.push("/datahub/new_datasets/add")
                    : isLoggedInUserAdmin() || isLoggedInUserCoSteward()
                    ? history.push("/datahub/connectors/add")
                    : recentDatasetTable && isLoggedInUserParticipant()
                    ? history.push("/participant/new_datasets/add")
                    : isLoggedInUserParticipant()
                    ? history.push("/participant/connectors/add")
                    : ""
                }
                className={`${GlobalStyle.primary_button} ${localStyle.primary}`}
              >
                {recentDatasetTable ? "Add New Dataset" : "Add connector"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className={`${localStyle.title}`}>
              <div>
                {title}
                <div className={localStyle.subTitle}>
                  <p>{subTitle}</p>
                </div>
              </div>
              <div
                data-testid="view-all-dashboard-table-test"
                onClick={() =>
                  recentDatasetTable &&
                  (isLoggedInUserAdmin() || isLoggedInUserCoSteward())
                    ? history.push("/datahub/new_datasets")
                    : isLoggedInUserAdmin() || isLoggedInUserCoSteward()
                    ? history.push("/datahub/connectors")
                    : recentDatasetTable && isLoggedInUserParticipant()
                    ? history.push("/participant/new_datasets")
                    : isLoggedInUserParticipant()
                    ? history.push("/participant/connectors")
                    : ""
                }
                style={{
                  color: "#00A94F",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
                align="right"
              >
                View all
              </div>
            </div>
            <Table sx={{ minWidth: 400 }} aria-label="simple table">
              <TableHead>
                <TableRow className={localStyle.tableHead}>
                  <TableCell>Name</TableCell>
                  {recentDatasetTable ? (
                    <>
                      <TableCell>Category</TableCell>
                      <TableCell>Geography</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell align="right">Total datasets</TableCell>
                    </>
                  )}
                  {/* <TableCell align="right"></TableCell> */}

                  <TableCell
                    // onClick={() =>
                    //   recentDatasetTable
                    //     ? history.push("/datahub/new_datasets")
                    //     : history.push("/datahub/connectors")
                    // }
                    // sx={{ color: "#00A94F", cursor: "pointer" }}
                    align="right"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data?.map((item, index) => {
                  let category = item?.category
                    ? Object.keys(item.category)
                    : [];
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        cursor: "pointer",
                        width: "100px",
                      }}
                      onClick={() =>
                        recentDatasetTable &&
                        (isLoggedInUserAdmin() || isLoggedInUserCoSteward())
                          ? history.push(
                              `/datahub/new_datasets/view/${item?.id}`
                            )
                          : isLoggedInUserAdmin() || isLoggedInUserCoSteward()
                          ? history.push(`/datahub/connectors/edit/${item?.id}`)
                          : recentDatasetTable && isLoggedInUserParticipant()
                          ? history.push(
                              `/participant/new_datasets/view/${item?.id}`
                            )
                          : isLoggedInUserParticipant()
                          ? history.push(
                              `/participant/connectors/edit/${item?.id}`
                            )
                          : ""
                      }
                    >
                      <TableCell
                        style={{
                          fontWeight: "600",
                          maxWidth: "150px",
                        }}
                        component="th"
                        scope="row"
                        className={localStyle.ellipsis}
                      >
                        {item?.name ?? "Not available"}
                      </TableCell>
                      {recentDatasetTable ? (
                        <>
                          <TableCell>
                            {category.length > 1
                              ? category[0] + "+" + category.length - 1
                              : category.length == 1
                              ? category[0]
                              : "Not available"}
                          </TableCell>
                          <TableCell
                            style={{
                              maxWidth: "100px",
                            }}
                            component="th"
                            scope="row"
                            className={localStyle.ellipsis}
                          >
                            {item?.geography?.country?.name ?? "Not available"}
                          </TableCell>
                          <TableCell
                            sx={{ color: "#00A94F", cursor: "pointer" }}
                            align="right"
                          >
                            View
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell align="right">
                            {item?.dataset_count
                              ? item?.dataset_count + " Datasets"
                              : "Not available"}
                          </TableCell>
                          <TableCell
                            onClick={() =>
                              history.push(
                                `/datahub/connectors/edit/${item?.id}`
                              )
                            }
                            sx={{ color: "#00A94F", cursor: "pointer" }}
                            align="right"
                          >
                            View
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </>
        )}
      </TableContainer>
    </Box>
  );
}

export default CustomDashBoardTable;
