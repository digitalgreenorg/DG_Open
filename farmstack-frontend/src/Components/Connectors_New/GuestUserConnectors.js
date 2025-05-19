import React from "react";
import Connectors from "./Connectors";

const GuestUserConnectors = () => {
  return (
    <div style={{ marginTop: "25px" }}>
      <Connectors user="guest" breadcrumbFromRoute={"Home"} />
    </div>
  );
};

export default GuestUserConnectors;
