import React from "react";
import SignInHeader from "../../Components/signup/SignInHeader";
import Leftintro from "../../Components/intros/Leftintro";
import OrgRightside from "../../Components/signup/OrgRightside";

export default function OrganisationScreen() {
  return (
    <div>
      <SignInHeader></SignInHeader>
      <h1 className="headertext">Let’s build a datahub together</h1>
      <Leftintro />
      {/* <Footerimg /> */}
      <OrgRightside />
    </div>
  );
}
