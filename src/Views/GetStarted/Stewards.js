import { Box } from "@mui/material";
import React from "react";

const Stewards = () => {
  return (
    <Box className="text-left">
      <h1>Stewards: The Guardians of Data</h1>
      <p>
        Stewards form the backbone of Farmstack, expertly managing the platform
        while performing crucial tasks such as:
      </p>
      <ul>
        <li className="p-2">
          Hosting and managing cutting-edge Farmstack software
        </li>
        <li className="p-2">Orchestrating a seamless data exchange network</li>
        <li className="p-2">
          Defining robust data exchange and usage policies
        </li>
        <li className="p-2">Ensuring easy data discovery on the platform</li>
        <li className="p-2">
          Establishing industry-leading data standards and categories
        </li>
        <li className="p-2">
          Expertly managing the data provider and consumer organisations, known
          as participants
        </li>
        <li className="p-2">
          Supervising datasets with diligence and precision
        </li>
      </ul>
      <p>
        Stewards can contribute to the valuable data pool by joining the network
        as data providers and consumers. With the flexibility to include
        co-stewards and sub-stewards, Farmstack allows organisations to create
        tailored networks that suit their unique needs.
      </p>
    </Box>
  );
};

export default Stewards;
