import React from "react";
import DataSets from "../../Components/Datasets_New/DataSets";

const GuestUserDatatsets = () => {
  return (
    <div>
      <DataSets user="guest" breadcrumbFromRoute={"Home"} />
    </div>
  );
};

export default GuestUserDatatsets;
