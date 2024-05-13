import { Box } from "@mui/material";
import React from "react";

const Standardisation = () => {
  return (
    <Box className="text-left">
      <h1>Data Standardisation Templates</h1>
      <p>
        Farmstack Data Standardisation Templates empower admins to create,
        update, and delete templates that help participants map non-standardized
        column names to standardised ones. This feature ensures consistency
        across datasets and improves the overall usability of the data.
      </p>
      <ul>
        <li className="p-2">
          <strong>Create Data Standardisation Templates</strong>
          <p>
            Admins can quickly create templates for data standardisation,
            ensuring that all datasets within the Farmstack ecosystem adhere to
            a consistent format.
          </p>
        </li>
        <li className="p-2">
          <strong>Update Existing Templates</strong>
          <p>
            Admins can easily update existing data standardisation templates,
            allowing for continuous improvement and adaptation to the evolving
            needs of the agricultural community.
          </p>
        </li>
        <li className="p-2">
          <strong>Delete Data Standardisation Templates</strong>
          <p>
            Admins can delete data standardisation templates when necessary,
            ensuring that only relevant and functional templates are available
            for participants.
          </p>
        </li>
      </ul>
    </Box>
  );
};

export default Standardisation;
