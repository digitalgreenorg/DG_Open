import React from "react";
import styles from "./slider.module.css";
import "../../../Assets/CSS/common.css";
import { Tooltip } from "@mui/material";
import { Zoom } from "@material-ui/core";
import { dateTimeFormat, toTitleCase } from "../../../Utils/Common";
import { useHistory } from "react-router-dom";

const SliderCard = ({ supportRequestData, ticketDetails }) => {
  // /participant/support/6e378443-4d58-4e99-b59f-c7ff2a558a9a/

  const viewDetailsMaintain = (id) => [history.push("support/")];

  console.log(supportRequestData, ticketDetails);
  const history = useHistory();
  return (
    <div className={styles.supportRequestDetailMain}>
      <div className={styles.supportRequestDetailTopThreeBlocks}>
        <div className={styles.supportRequestDetailTopThreeBlockEach}>
          <span className={styles.supportRequestDetailTopThreeBlockEachText}>
            Open request
          </span>
          {/* <Tooltip TransitionComponent={Zoom}  title={ticketDetails.open_requests}> */}
          <span
            className={
              styles.supportRequestDetailTopThreeBlockEachValueText +
              " " +
              "d-inline-block text-truncate width150px"
            }
          >
            {ticketDetails.open_requests}
          </span>
          {/* </Tooltip> */}
        </div>
        <div className={styles.supportRequestDetailTopThreeBlockEach}>
          <span className={styles.supportRequestDetailTopThreeBlockEachText}>
            Close request
          </span>
          {/* <Tooltip TransitionComponent={Zoom}  title={ticketDetails.closed_requests}> */}

          <span
            className={
              styles.supportRequestDetailTopThreeBlockEachValueText +
              " " +
              "d-inline-block text-truncate width150px"
            }
          >
            {ticketDetails.closed_requests}
          </span>
          {/* </Tooltip> */}
        </div>
        <div className={styles.supportRequestDetailTopThreeBlockEach}>
          <span className={styles.supportRequestDetailTopThreeBlockEachText}>
            Hold request
          </span>
          {/* <Tooltip TransitionComponent={Zoom}  title={ticketDetails.hold_requests}> */}

          <span
            className={
              styles.supportRequestDetailTopThreeBlockEachValueText +
              " " +
              "d-inline-block text-truncate width150px"
            }
          >
            {ticketDetails.hold_requests}
          </span>
          {/* </Tooltip> */}
        </div>
      </div>
      <div>
        <span className={styles.secondHeading}>New request:</span>
        <div className={styles.supportRequestDetailBottomSixBlocksMain}>
          <div className={styles.supportRequestDetailBottomSixBlocksEach}>
            <span
              className={
                styles.supportRequestDetailBottomSixBlocksEachBlockTitleText
              }
            >
              Request title
            </span>
            <Tooltip
              TransitionComponent={Zoom}
              title={supportRequestData.subject}
            >
              <span
                className={
                  styles.supportRequestDetailBottomSixBlocksEachBlockValue +
                  " " +
                  "d-inline-block text-truncate width150px"
                }
              >
                {toTitleCase(supportRequestData.subject)}
              </span>
            </Tooltip>
          </div>
          <div className={styles.supportRequestDetailBottomSixBlocksEach}>
            <span
              className={
                styles.supportRequestDetailBottomSixBlocksEachBlockTitleText
              }
            >
              Category
            </span>
            <span
              className={
                styles.supportRequestDetailBottomSixBlocksEachBlockValue +
                " " +
                "d-inline-block text-truncate width150px"
              }
            >
              {toTitleCase(supportRequestData.category)}
            </span>
          </div>
          <div className={styles.supportRequestDetailBottomSixBlocksEach}>
            <span
              className={
                styles.supportRequestDetailBottomSixBlocksEachBlockTitleText
              }
            >
              Date & Time
            </span>
            <Tooltip
              TransitionComponent={Zoom}
              title={supportRequestData.updated_at}
            >
              <span
                className={
                  styles.supportRequestDetailBottomSixBlocksEachBlockValue +
                  " " +
                  "d-inline-block text-truncate width150px"
                }
              >
                {dateTimeFormat(supportRequestData.updated_at, true)}
              </span>
            </Tooltip>
          </div>
          <div className={styles.supportRequestDetailBottomSixBlocksEach}>
            <span
              className={
                styles.supportRequestDetailBottomSixBlocksEachBlockTitleText
              }
            >
              Name of the participant
            </span>
            <Tooltip
              TransitionComponent={Zoom}
              title={supportRequestData.organization.name}
            >
              <span
                className={
                  styles.supportRequestDetailBottomSixBlocksEachBlockValue +
                  " " +
                  "d-inline-block text-truncate width200px"
                }
              >
                {toTitleCase(supportRequestData.organization.name)}
              </span>
            </Tooltip>
          </div>
          <div className={styles.supportRequestDetailBottomSixBlocksEach}>
            {" "}
            <span
              className={
                styles.supportRequestDetailBottomSixBlocksEachBlockTitleText
              }
            >
              Name of the participant user
            </span>
            <Tooltip
              TransitionComponent={Zoom}
              title={supportRequestData.user.first_name}
            >
              <span
                className={
                  styles.supportRequestDetailBottomSixBlocksEachBlockValue +
                  " " +
                  "d-inline-block text-truncate width200px text-transform-capital"
                }
              >
                {supportRequestData.user.first_name +
                  " " +
                  supportRequestData.user.last_name}
              </span>
            </Tooltip>
          </div>
          <div>
            {" "}
            <button
              onClick={() => viewDetailsMaintain(supportRequestData.id)}
              className={styles.viewDetailsButton}
            >
              View Details
            </button>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderCard;
