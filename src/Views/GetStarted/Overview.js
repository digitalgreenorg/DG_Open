import { Box } from "@mui/material";
import React from "react";

const Overview = () => {
  return (
    <Box className="text-left">
      <h1>Overview</h1>
      <ul>
        <li className="p-2">
          The agricultural sector is a diverse ecosystem involving numerous
          organisations.
        </li>
        <li className="p-2">
          These organisations collaborate with farmers to implement a wide array
          of projects.
        </li>
        <li className="p-2">
          Key players include government and non-government entities, NGOs,
          not-for-profit organisations, researchers, and for-profit companies.
        </li>
        <li className="p-2">
          During project implementation, valuable data is collected that could
          improve agricultural practices and outcomes for farmers.
        </li>
      </ul>

      <h2>Problem Statement</h2>
      <p>
        The agricultural sector faces several challenges that prevent the
        effective use of collected data:
      </p>
      <ul>
        <li className="p-2">
          Working in silos: Organisations often operate independently, leading
          to limited communication and collaboration.
        </li>
        <li className="p-2">
          Lack of trust: Trust issues between organisations hinder the sharing
          and exchanging of crucial data.
        </li>
        <li className="p-2">
          Fragmented data: Data is often scattered across various sources and
          organisations, making it difficult to access and analyse.
        </li>
        <li className="p-2">
          Inconsistent data standards: The absence of unified data standards and
          formats further complicates data sharing and analysis.
        </li>
        <li className="p-2">
          Poor categorisation: Data is often poorly categorised or organised,
          reducing usability and value.
        </li>
        <li className="p-2">
          Data underutilisation: Due to the above challenges, much of the
          collected data becomes outdated or underutilised, preventing farmers'
          development of better use cases.
        </li>
      </ul>

      <h2>Solution</h2>
      <p>
        Farmstack, an open-source data exchange platform, has been developed to
        tackle these issues and unlock the full potential of the collected data:
      </p>
      <ul>
        <li className="p-2">
          Seamless data sharing: Farmstack enables organisations in the
          agricultural sector to share and exchange data easily.
        </li>
        <li className="p-2">
          Overcoming silos: The platform helps break down organisational
          barriers, fostering improved collaboration.
        </li>
        <li className="p-2">
          Building trust: Farmstack encourages trust-building among
          organisations, promoting a more open and collaborative environment.
        </li>
        <li className="p-2">
          Data consolidation: Farmstack combines fragmented data from various
          sources, making it more accessible and valuable.
        </li>
        <li className="p-2">
          Standardisation: The platform promotes the adoption of unified data
          standards and formats, facilitating better data sharing and analysis.
        </li>
        <li className="p-2">
          Improved categorisation: Farmstack aids in better organisation and
          categorisation of data, enhancing its usability and value.
        </li>
        <li className="p-2">
          Impactful use cases: By harnessing the potential of collective data,
          Farmstack facilitates the development of more effective use cases for
          farmers, ultimately leading to improved agricultural practices and
          outcomes.
        </li>
      </ul>
    </Box>
  );
};

export default Overview;
