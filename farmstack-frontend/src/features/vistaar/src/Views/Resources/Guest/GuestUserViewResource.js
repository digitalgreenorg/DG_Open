import React from "react";
import ViewResource from "../ViewResource";

const GuestUserViewResource = () => {
  return <ViewResource userType="guest" breadcrumbFromRoute={"Home"} />;
};

export default GuestUserViewResource;
