import React, { useState } from "react";
import { Alert, Box } from "@mui/material";
import styles from "../../Components/Datasets/IntegrationDatasets/dataset_integration.module.css";
import CardDetail from "./CardDetail";
import { toTitleCase } from "../../Utils/Common";
import Join from "../../Components/Datasets/IntegrationDatasets/Join/Join";
import JoinedBy from "./JoinedBy";

const IntegrationConnector = ({
  completeData,
  setCompleteData,
  orgList,
  setIsAllConditionForSaveMet,
  setTotalCounter,
  temporaryDeletedCards,
  setTemporaryDeletedCards,
  generateData,
  joinType,
  setJoinType,
  connectorData,

  finalDataNeedToBeGenerated,
}) => {
  const [value, setValue] = useState("Join by");
  const [show, setShow] = useState(false);
  const [indexShow, setIndex] = useState(-1);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const id = "delete-popper";

  const handleMoreDataShow = (index, condition, e, whatToShow) => {
    e.stopPropagation();
    if (condition) {
      setIndex(index);
      setShow(true);
      // if(whatToShow=="table_result"){
      //     setShowTable
      // }
    } else {
      setIndex(-1);
      setShow(false);
    }
  };

  // console.log(completeData);
  return (
    <Box>
      {completeData?.length > 0 &&
        completeData.map((each, index) => {
          return (
            <span
              style={{
                position: "relative",
              }}
              key={index}
            >
              <CardDetail
                setIsAllConditionForSaveMet={setIsAllConditionForSaveMet}
                temporaryDeletedCards={temporaryDeletedCards}
                setTemporaryDeletedCards={setTemporaryDeletedCards}
                generateData={generateData}
                setTotalCounter={setTotalCounter}
                orgList={orgList}
                completeData={completeData}
                setCompleteData={setCompleteData}
                data={each}
                index={index}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                open={open}
                setOpen={setOpen}
                id={id}
              />
              {index < completeData.length - 1 && (
                <span
                  class={styles.vl}
                  style={{
                    borderLeft:
                      index == indexShow && "1.5px solid #00A94F !important",
                  }}
                ></span>
              )}
              {index < completeData.length - 1 && (
                <span
                  id="settingIconForHover"
                  onClick={(e) => handleMoreDataShow(index, true, e)}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: show && index == indexShow ? "" : "center",
                    cursor: !show ? "pointer" : "",
                    height: `${
                      show && index == indexShow
                        ? value == "Join by"
                          ? each?.noOfjoin > 1
                            ? "718px"
                            : "640px"
                          : "510px"
                        : "50px"
                    }`,
                    overflow: "hidden",
                    width: `${
                      show && index == indexShow && value == "Join by"
                        ? "100%"
                        : show && index == indexShow
                        ? "100%"
                        : "50px"
                    }`,
                    margin: "auto",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "50px 50px",
                    backgroundPosition: "center",
                  }}
                  className={
                    index == indexShow ? styles.hoveredOne : styles.alwaysHave
                  }
                >
                  {
                    <div
                      style={{
                        width: indexShow === index ? "100%" : "",
                        margin: indexShow === index ? "50px 98px" : "0px",
                        position: indexShow === index ? "" : "absolute",
                      }}
                      data-testid="join-connector"
                    >
                      <Join
                        value={value}
                        setValue={setValue}
                        result={each["result"] ? each["result"] : []}
                        handleMoreDataShow={handleMoreDataShow}
                        indexShow={indexShow}
                        index={index}
                        each={each}
                        next={completeData[index + 1]}
                        joinType={joinType}
                        setJoinType={setJoinType}
                        connectorData={connectorData}
                        completeData={completeData}
                        setCompleteData={setCompleteData}
                        finalDataNeedToBeGenerated={finalDataNeedToBeGenerated}
                        generateData={generateData}
                      />
                      {indexShow != index && (
                        <img
                          id="link-icon"
                          src={require("../../Assets/Img/link_icon.svg")}
                          alt=""
                        />
                      )}
                    </div>
                  }
                </span>
              )}
              {index !== indexShow && index < completeData.length - 1 && (
                <span
                  style={{
                    position: "absolute",
                    left: "61px",
                    bottom: "23px",
                    width: "514px",
                    height: "112px",
                  }}
                >
                  <div style={{}}>
                    {/* <div
                                            style={{
                                                textAlign: "left",
                                                marginBottom: "20px",
                                                fontWeight: "600",
                                            }}
                                        >
                                            Joined by{" "}
                                            <BorderColorIcon
                                                className={styles.edit_btn}
                                                onClick={(e) => handleMoreDataShow(index, true, e)}
                                                cursor="pointer"
                                                fontSize="large"
                                            />{" "}
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "left",
                                                alignItems: "center",
                                                gap: "35px",
                                                textAlign: "left",
                                            }}
                                        >
                                            <span className={styles.detail_joins}>
                                                <div> Left column </div>
                                                <div>
                                                    {each?.left_on?.length > 0
                                                        ? toTitleCase(each?.left_on[0])
                                                        : "Not selected"}
                                                </div>
                                            </span>
                                            <span className={styles.detail_joins}>
                                                <div>Right column </div>
                                                <div>
                                                    {" "}
                                                    {each?.right_on?.length > 0
                                                        ? toTitleCase(each?.right_on[0])
                                                        : "Not selected"}
                                                </div>
                                            </span>
                                            <span className={styles.detail_joins}>
                                                <div> Join type </div>
                                                <div>
                                                    {" "}
                                                    {each?.type ? each?.type : "Not selected"}
                                                </div>
                                            </span>
                                        </div> */}
                    <JoinedBy
                      left={
                        each?.left_on?.length > 0
                          ? toTitleCase(each?.left_on[0])
                          : "Not selected"
                      }
                      right={
                        each?.right_on?.length > 0
                          ? toTitleCase(each?.right_on[0])
                          : "Not selected"
                      }
                      type={each?.type ? each?.type : "Not selected"}
                    />
                  </div>
                  {/* <span className={styles.result_btn_shortcut_outer}> */}
                  {/* <Button
                                        onClick={(e) => {
                                            setValue("Integrated data");
                                            handleMoreDataShow(index, true, e, "table_result");
                                        }}
                                        className={styles.result_btn_shortcut}
                                        disabled={each["result"]?.length > 0 ? false : true}
                                    >
                                        {console.log("each result", each["result"])}
                                        <img
                                            style={{
                                                cursor: "pointer",
                                                opacity: each["result"]?.length <= 0 ? 0.4 : 1,
                                            }}
                                            src={analytics}
                                            height="50px"
                                            width={"50px"}
                                            alt=""
                                        />
                                    </Button> */}
                  {/* </span> */}
                </span>
              )}
              {index !== indexShow &&
                index < completeData.length - 1 &&
                each.left_on?.length <= 0 && (
                  <span
                    style={{
                      position: "absolute",
                      right: "40px",
                      bottom: "0px",
                      width: "514px",
                      height: "112px",
                      borderRadius: "10px",
                      padding: "10px 20px",
                    }}
                  >
                    <Alert
                      severity="info"
                      sx={{
                        ".MuiSvgIcon-root": {
                          color: "#0288d1 !important",
                        },
                      }}
                    >
                      Please select join details to save the connector
                    </Alert>
                  </span>
                )}
              {index < completeData.length - 1 && (
                <span
                  class={styles.vl}
                  style={{
                    borderLeft:
                      index == indexShow && "1.5px solid #00A94F !important",
                    position: "relative",
                    bottom: "-6px",
                  }}
                ></span>
              )}
            </span>
          );
        })}
    </Box>
  );
};

export default IntegrationConnector;
