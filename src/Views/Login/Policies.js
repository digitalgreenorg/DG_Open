import React from "react";
import SignInHeader from "../../Components/signup/SignInHeader";
import Leftintro from "../../Components/intros/Leftintro";
import PoliciesRightside from "../../Components/signup/PoliciesRightside";
import Footerimg from "../../Components/signup/Footerimg";

export default function Policies() {
  return (
    <div>
      <SignInHeader></SignInHeader>
      <h1 className="headertext">Let’s build a datahub together</h1>
      <Leftintro />
      {/* <Footerimg /> */}
      <PoliciesRightside />
    </div>
  );
}
