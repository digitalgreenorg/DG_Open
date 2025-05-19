import React from "react";
import GuestUserParticipants from "./GuestUserParticipants";

function GuestUserCoStewardNew() {
  return (
    <>
      <GuestUserParticipants
        title="Costewards - Community builders"
        description="Uniting Participants for a Better Tomorrow who enable  Powerful Networks for Agricultural Innovation."
        isCosteward={true}
        breadcrumbFromRoute={"Home"}
      />
    </>
  );
}

export default GuestUserCoStewardNew;
