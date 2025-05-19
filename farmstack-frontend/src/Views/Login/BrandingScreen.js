import React from "react";
import SignInHeader from "../../Components/signup/SignInHeader";
import Leftintro from "../../Components/intros/Leftintro";
import BrandingRightside from "../../Components/signup/BrandingRightside";
import Footerimg from "../../Components/signup/Footerimg";

export default function BrandingScreen() {
  return (
    <div>
      <SignInHeader></SignInHeader>
      <h1 className="headertext">Let’s build a datahub together</h1>
      <Leftintro />
      <BrandingRightside />
      {/* <Footerimg /> */}
    </div>
  );
}
