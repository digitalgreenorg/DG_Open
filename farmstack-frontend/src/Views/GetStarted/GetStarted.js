import React from "react";
import style from "./getStarted.module.css";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "../../Components/SideBar/Sidebar";
import ControlledAccordion from "../../Components/Accordion/Accordion";
import Overview from "./Overview";
import IntroducingFarmstack from "./IntroducingFarmstack";
import Stewards from "./Stewards";
import Participants from "./Participants";
import Dataset from "./Dataset";
import Connectors from "./Connectors";
import Category from "./Category";
import Standardisation from "./Standardisation";
import Faq from "./Faq";

const customDetailsStyle = {
  fontFamily: "'Montserrat' !important",
  fontWeight: "400 !important",
  fontSize: "13px !important",
  lineHeight: "20px !important",
  color: "#212B36 !important",
  textAlign: "left",
  marginBottom: "24px !important",
};
const GetStarted = () => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const containerStyle = {
    marginLeft: mobile || tablet ? "30px" : "",
    marginRight: mobile || tablet ? "30px" : "",
  };
  const sideMenus = [
    {
      menu: "Overview",
      menuItems: ["Problem Statement", "Solution"],
    },
    {
      menu: "Introducing Farmstack",
      menuItems: ["Revolutionising Data Exchange in Agriculture"],
    },
    {
      menu: "Stewards: The Guardians of Data",
      menuItems: [],
    },
    {
      menu: "Participants: The Data Pioneers",
      menuItems: ["Participant Management"],
    },
    {
      menu: "Dataset Management",
      menuItems: [],
    },
    {
      menu: "Data Integration Connectors: Unleashing the Power of Collective Data",
      menuItems: [],
    },
    {
      menu: "Category and Subcategory Management",
      menuItems: [],
    },
    {
      menu: "Data Standardisation Templates",
      menuItems: [],
    },
    {
      menu: "Frequently asked questions",
      menuItems: [],
    },
  ];

  const getData = () => {
    let arr = [];
    arr.push(
      {
        panel: 1,
        title: "Overview",
        details: [<Overview />],
      },
      {
        panel: 2,
        title: "Introducing Farmstack",
        details: [<IntroducingFarmstack />],
      },
      {
        panel: 3,
        title: "Stewards: The Guardians of Data",
        details: [<Stewards />],
      },
      {
        panel: 4,
        title: "Participants: The Data Pioneers",
        details: [<Participants />],
      },
      {
        panel: 5,
        title: "Dataset Management",
        details: [<Dataset />],
      },
      {
        panel: 6,
        title:
          "Data Integration Connectors: Unleashing the Power of Collective Data",
        details: [<Connectors />],
      },
      {
        panel: 7,
        title: "Category and Subcategory Management",
        details: [<Category />],
      },
      {
        panel: 8,
        title: "Data Standardisation Templates",
        details: [<Standardisation />],
      },
      {
        panel: 9,
        title: "Frequently asked questions",
        details: [<Faq />],
      }
    );
    return arr;
  };

  const accordionData = getData();

  return (
    <Box sx={containerStyle}>
      {mobile || tablet ? (
        <ControlledAccordion
          data={accordionData}
          customBorder={true}
          customPadding={true}
          isTables={true}
          isCustomDetailStyle={true}
          customDetailsStyle={customDetailsStyle}
          addHeaderBackground={true}
          headerBackground={"#eafbf3"}
        />
      ) : (
        <Sidebar sideMenus={sideMenus} />
      )}
    </Box>
  );
};

export default GetStarted;
