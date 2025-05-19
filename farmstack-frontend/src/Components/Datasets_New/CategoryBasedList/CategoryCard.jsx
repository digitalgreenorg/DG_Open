import React from "react";
// import { Card } from "@mui/material";
import { Card } from "antd";
const gridStyle: React.CSSProperties = {
  width: "25%",
  textAlign: "center",
};
const cardSx = {
  //   maxWidth: 200,
  //   height: 200,
  //   width: "200px",
  //   border: "1px solid #C0C7D1",
  //   borderRadius: "10px",
  //   display: "flex",

  //   cursor: "pointer",
  //   "&:hover": {
  //     boxShadow: "-40px 40px 80px rgba(145, 158, 171, 0.16)",
  //     cursor: "pointer",
  //     border: "1px solid #2CD37F",
  //   },
  //   justifyContent: "center",
  //   alignItems: "center",
  width: "25%",
  height: "100px",
  textAlign: "center",
};
const CategoryCard = (props) => {
  const {
    eachMainCategory,
    setCategorises,
    subCategories,
    setUpdate,
    handleCheckBox,
  } = props;
  return (
    <Card.Grid
      style={gridStyle}
      //   className="card"
      //   sx={cardSx}
      //   onClick={() =>
      //     history.push(handleCardClick(item?.id), { data: title, tab: value })
      //   }
      id={`dataset-card-view-id${0}`}
      data-testid="navigate_dataset_view"
      onClick={() => {
        // handleCheckBox("theme")
        setCategorises({ Themes: [eachMainCategory] });
        setUpdate((prev) => prev + 1);
      }}
    >
      {eachMainCategory}
      {/* <div className="published">
      <img src={require("../../Assets/Img/globe.svg")} alt="globe" />
      <span className="published_text">
        Published on:{" "}
        {item?.created_at
          ? dateTimeFormat(item?.created_at, false)
          : "Not Available"}
      </span>
    </div> */}
      {/* <div className="d_content_title">{item?.name}</div> */}
      {/* <div className="organisation">
        <img
          src={require("../../Assets/Img/organisation.svg")}
          alt="organisation"
        />
        <span className="organisation_text">{item?.organization?.name}</span>
      </div> */}
      {/* <div className="d_content_text">
        <div className="category">
          <img src={require("../../Assets/Img/category.svg")} alt="category" />
          <span className="category_text">
            {Object.keys(item?.category).length ? (
              Object.keys(item?.category)?.length > 1 ? (
                <>
                  {Object.keys(item?.category)?.[0]}

                  <span style={{ color: "#00A94F", marginLeft: "1px" }}>
                    +{Object.keys(item?.category).length - 1}
                  </span>
                </>
              ) : (
                Object.keys(item?.category)?.[0]
              )
            ) : (
              "Not Available"
            )}
          </span>
        </div>
      </div> */}
    </Card.Grid>
  );
};

export default CategoryCard;
