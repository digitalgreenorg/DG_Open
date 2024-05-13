import { Box } from "@mui/material";
import React from "react";

const Category = () => {
  return (
    <Box className="text-left">
      <h1>Category and Subcategory Management</h1>
      <p>
        Optimise dataset discoverability and organisation with Farmstack
        Category and Subcategory Management. This powerful feature allows admins
        to create, update, and delete categories and subcategories, making
        finding and utilising relevant datasets easier.
      </p>
      <ul>
        <li className="p-2">
          <strong>Configure Categories and Subcategories</strong>
          <p>
            Admins can effortlessly create and configure categories and their
            respective subcategories, ensuring that datasets are accurately
            classified and easily discoverable within the Farmstack ecosystem.
          </p>
        </li>
        <li className="p-2">
          <strong>Update categories and subcategories.</strong>
          <p>
            Admins have the flexibility to update existing categories and
            subcategories, ensuring that the classification system remains
            current and adapts to the ever-evolving needs of the agricultural
            sector.
          </p>
        </li>
        <li className="p-2">
          <strong>Delete categories and subcategories.</strong>
          <p>
            Admins can easily delete specific categories and subcategories as
            needed, maintaining a streamlined and efficient classification
            system for all participants.
          </p>
        </li>
      </ul>
    </Box>
  );
};

export default Category;
