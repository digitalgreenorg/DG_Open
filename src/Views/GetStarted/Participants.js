import { Box } from "@mui/material";
import React from "react";

const Participants = () => {
  return (
    <Box className="text-left">
      <h1>Participants: The Data Pioneers</h1>
      <p>
        As data providers, consumers, or both, participants drive data exchange
        within the Farmstack ecosystem. They fulfill a wide range of
        responsibilities, including:
      </p>
      <ul>
        <li className="p-2">
          Showcasing their data for easy discoverability by other participants
        </li>
        <li className="p-2">
          Uploading datasets in diverse formats, including XLS, CSV, PDF, and
          image files
        </li>
        <li className="p-2">
          Seamlessly importing datasets from databases like MySQL, PostgreSQL,
          SQLite, or REST APIs.
        </li>
        <li className="p-2">
          Standardizing and categorizing data to maintain the highest quality
        </li>
        <li className="p-2">
          Publishing data with confidence after applying secure usage policies
        </li>
      </ul>

      <h2>Participant Management</h2>
      <p>
        Farmstack Participant Management offers admins a comprehensive suite of
        tools to manage and engage with participants, fostering a thriving
        ecosystem of data-driven innovation and collaboration in the
        agricultural sector.
      </p>
      <ul>
        <li className="p-2">
          Streamlined participant onboarding: Admins can easily add or invite
          new participants through email, ensuring a seamless onboarding
          experience. Users can also request or register as participants, with
          admin approvals ensuring the right stakeholders join the platform.
        </li>
        <li className="p-2">
          Efficient Participant Management: Admins can effortlessly update or
          delete participant profiles, maintaining an organized and efficient
          FarmStack ecosystem.
        </li>
        <li className="p-2">
          Empower Co-Stewards: Admins have the ability to promote participants
          as co-stewards, encouraging collaboration and joint stewardship of the
          data exchange platform.
        </li>
      </ul>
    </Box>
  );
};

export default Participants;
