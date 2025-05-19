import { Box } from "@mui/material";
import React from "react";

const Dataset = () => {
  return (
    <Box className="text-left">
      <h1>Dataset Management</h1>
      <p>
        Farmstack Dataset Management provides users with a comprehensive suite
        of tools to create, upload, and publish datasets effectively. Improve
        data discoverability and usability through intuitive categorization,
        standardisation, and flexible usage policy implementation.
      </p>
      <ul>
        <li className="p-2">Effortless Dataset Creation</li>
        <p>
          Users can quickly create datasets by providing metadata, ensuring
          accurate and organised information that enhances discoverability.
        </p>
        <li className="p-2">Versatile data uploads</li>
        <p>
          Supporting a wide array of formats, users can upload multiple files
          for a dataset, including XLS, CSV, JPG, PNG, TIFF, and PDF.
        </p>
        <li className="p-2">Seamless data import and integration</li>
        <p>
          Easily import and publish data from various sources like MySQL,
          PostgreSQL, MongoDB, SQLite, and REST APIs, consolidating valuable
          information into one powerful platform.
        </p>
        <li className="p-2">
          Intelligent Dataset Categorization and Standardisation
        </li>
        <p>
          Efficiently categorise datasets based on factors like value chain and
          geography while standardising data for improved consistency and
          usability across the platform.
        </p>
        <li className="p-2">Tailored Usage Policies</li>
      </ul>
    </Box>
  );
};

export default Dataset;
