const CONFIG = {
  logo: {
    is_primary_logo_required: true, // logo which is uploaded by organisation in the setting or onboarding
    is_secondary_logo_required: false, // the harcoded org logo secondary_logo_link
    secondary_logo_link: require("../Assets/Img/Static Logo/primary_logo.png"), // if secondary logo is required then the path of the logo should be provided here
    is_technical_partner_required: true, // technical partners logo if required
  },
  roles: {
    is_costeward_required: true,
  },
  style: {
    font_family: "Montserrat",
    primary_color: "",
    secondary_color: "",
  },
  platform: {
    powered_by: "FarmStack",
    name: `ATI's Data Sharing Tool (FarmStack)`,
    //description can be used for the seo content directly
    description: `Explore ATI's Data Sharing Tool (FarmStack), powered by FarmStack. Collaborate, analyze, and innovate in agriculture.
    Join the future of Ethiopian agriculture with our Data Sharing Platform, supported by FarmStack. Access, share, and transform agri data today.
    FarmStack's ATI's Data sharing Tool (FarmStack) - the hub for sharing, discovering, and leveraging agricultural insights and knowledge.
    Discover the power of data collaboration in Ethiopian agriculture. Join FarmStack's Data Sharing Platform to drive growth and sustainability.
    Get involved in Ethiopia's agriculture revolution. FarmStack's Data Sharing Platform connects stakeholders for data-driven farming success`,
  },
};

export default CONFIG;
