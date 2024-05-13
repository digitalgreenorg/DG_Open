import vistaarFavicon from "common/assets/favicon.ico";
import kadpFavicon from "common/assets/kalro.ico";
import eadpFavicon from "common/assets/eth_favicon.ico";

export const getMetaData = (instance) => {
  let title = "";
  let description = "";
  let faviconImage = "";

  if (instance === "VISTAAR") {
    title = "Vistaar Agricultural Data Sharing Platform";
    description = `Explore Vistaar's premier Agricultural Data Sharing Platform, powered by FarmStack. Collaborate, analyze, and innovate in agriculture.
        Join the future of Indian agriculture with our Data Sharing Platform, supported by FarmStack. Access, share, and transform agri data today.
        FarmStack's Vistaar Agricultural Data Sharing Platform - the hub for sharing, discovering, and leveraging agricultural insights and knowledge.
        Discover the power of data collaboration in Indian agriculture. Join FarmStack's Data Sharing Platform to drive growth and sustainability.
        Get involved in India's agriculture revolution. FarmStack's Data Sharing Platform connects stakeholders for data-driven farming success.`;
    faviconImage = vistaarFavicon;
  }
  if (instance === "KADP") {
    title = "Kenya Agricultural Data Sharing Platform";
    description = `Explore Kenya's premier Agricultural Data Sharing Platform, powered by FarmStack. Collaborate, analyze, and innovate in agriculture.
        Join the future of Kenyan agriculture with our Data Sharing Platform, supported by FarmStack. Access, share, and transform agri data today.
        FarmStack's Kenya Agricultural Data Sharing Platform - the hub for sharing, discovering, and leveraging agricultural insights and knowledge.
        Discover the power of data collaboration in Kenyan agriculture. Join FarmStack's Data Sharing Platform to drive growth and sustainability.
        Get involved in Kenya's agriculture revolution. FarmStack's Data Sharing Platform connects stakeholders for data-driven farming success.`;
    faviconImage = kadpFavicon;
  }

  if (instance === "EADP") {
    title = "ATI's Data Sharing Tool (FarmStack)";
    description = `Explore ATI's Data Sharing Tool (FarmStack), powered by FarmStack. Collaborate, analyze, and innovate in agriculture.
    Join the future of Ethiopian agriculture with our Data Sharing Platform, supported by FarmStack. Access, share, and transform agri data today.
    FarmStack's ATI's Data sharing Tool (FarmStack) - the hub for sharing, discovering, and leveraging agricultural insights and knowledge.
    Discover the power of data collaboration in Ethiopian agriculture. Join FarmStack's Data Sharing Platform to drive growth and sustainability.
    Get involved in Ethiopia's agriculture revolution. FarmStack's Data Sharing Platform connects stakeholders for data-driven farming success`;
    faviconImage = eadpFavicon;
  }

  return { title, description, faviconImage };
};
