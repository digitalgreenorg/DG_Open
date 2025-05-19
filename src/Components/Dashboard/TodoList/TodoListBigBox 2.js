import React from "react";
import styles from "./todoListBigBox.module.css";
import Dummy from "../../../Assets/Img/dummy.png";
import labels from "../../../Constants/labels";
import { Tooltip } from "@mui/material";

const TodoListBigBox = ({ totalDetail }) => {
  return (
    <div className={styles.todoListEachBigBox}>
      <div className={styles.todoListBigBoxUpperPortion}>
       
        <span className={styles.totalDetailsTitle}>{totalDetail.title}</span>
        {/* </Tooltip> */}
        <img
          className={styles.todoListBigBoxUpperPortionImg}
          src={totalDetail.imgUrl}
        />
        {/* <img className={styles.todoListBigBoxUpperPortionImg} src={Dummy}/> */}
        {/* <img className={styles.todoListBigBoxUpperPortionImg} src= "."/> */}
      </div>
      {/* <div className="nodataavailable">SomeClass</div> */}
      <span className={styles.todoListBigBoxLowerValues}>
        
        {/* <Tooltip title={totalDetail.value}> */}
        <span className="text_overflow_ellipsis_overflow_hidden width270px" style={{ height: "54px", width:"90px"}}> {totalDetail.value} <span
          style={{
            fontSize: "18px",
            // border: "1px solid blue",
            height: "25px",
            margin:0,
            padding:0
          }}
        >
          {totalDetail.valueUnit ? totalDetail.valueUnit : null}
        </span></span>
        {/* </Tooltip> */}
        
      </span>
    </div>
  );
};

export default TodoListBigBox;
