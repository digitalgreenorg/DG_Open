import React from "react";
import Resources from "../Resources";

const GuestUserResources = () => {
  return <Resources user="guest" breadcrumbFromRoute={"Home"} />;
};

export default GuestUserResources;
