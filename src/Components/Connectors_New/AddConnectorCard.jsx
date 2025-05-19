import React from "react";
import { Card } from "@mui/material";
import style from "./Connector.module.css";
const cardSx = {
  maxWidth: 368,
  height: 190,
  border: "1px solid #2CD37F",
  borderRadius: "10px",
  "&:hover": {
    // boxShadow: "-40px 40px 80px rgba(145, 158, 171, 0.16)",
    cursor: "pointer",
  },
};
const AddConnectorCard = ({ history, addConnector }) => {
  return (
    <Card
      className="card cursor-pointer"
      sx={cardSx}
      onClick={() => history.push(addConnector())}
      id="add-connector"
      data-testid="add-connector-main-div"
    >
      <div className={style.addNewCard}>Add New Use case</div>
      <div>
        <img
          id="add-connector-button"
          src={require("../../Assets/Img/add_new.svg")}
          alt="add"
        />
      </div>
      <div className={style.addNewCardText}>
        Add details about your use case.
      </div>
    </Card>
  );
};

export default AddConnectorCard;
