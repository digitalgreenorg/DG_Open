import React, { useState, useRef } from "react";
import { Box, Card, Tab, Tabs, Typography, Divider } from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ overflowY: "auto", width: "100%" }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const Sidebar = ({ sideMenus }) => {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  function renderTabs() {
    return sideMenus.map((menu, index) => (
      <Tab
        key={index}
        sx={{
          "&.MuiTab-root": {
            color: activeTab === index ? "#000000DE" : "rgba(0, 0, 0, 0.87)",
            backgroundColor: activeTab === index ? "#eafbf3" : "",
            fontWeight: activeTab === index ? 600 : 400,
            alignItems: "flex-start",
            textAlign: "left",
            justifyContent: "left",
            textTransform: "none",
            fontSize: "16px",
          },
        }}
        component={React.forwardRef((props, ref) => (
          <>
            <Typography {...props} ref={ref}>
              {menu.menu}
            </Typography>
            <Divider />
          </>
        ))}
        id={`simple-tab-${index}`}
        aria-controls={`simple-tabpanel-${index}`}
      />
    ));
  }
  return (
    <Box>
      <Card
        sx={{
          margin: "30px",
          boxShadow: "rgba(17, 17, 26, 0.1) 0px 0px 16px",
          display: "flex",
          maxHeight: 490,
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={activeTab}
          onChange={handleTabChange}
          visibleScrollbar={true}
          scrollButtons={false}
          sx={{
            maxWidth: "300px",
            minWidth: "300px",
            maxHeight: "460px",
            paddingTop: "10px",
            ".MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          {renderTabs()}
        </Tabs>
        <TabPanel value={activeTab} index={0}>
          <Box className="text-left">
            <h1>Overview</h1>
            <ul>
              <li className="p-2">
                The agricultural sector is a diverse ecosystem involving
                numerous organisations.
              </li>
              <li className="p-2">
                These organisations collaborate with farmers to implement a wide
                array of projects.
              </li>
              <li className="p-2">
                Key players include government and non-government entities,
                NGOs, not-for-profit organisations, researchers, and for-profit
                companies.
              </li>
              <li className="p-2">
                During project implementation, valuable data is collected that
                could improve agricultural practices and outcomes for farmers.
              </li>
            </ul>

            <h2>Problem Statement</h2>
            <p>
              The agricultural sector faces several challenges that prevent the
              effective use of collected data:
            </p>
            <ul>
              <li className="p-2">
                Working in silos: Organisations often operate independently,
                leading to limited communication and collaboration.
              </li>
              <li className="p-2">
                Lack of trust: Trust issues between organisations hinder the
                sharing and exchanging of crucial data.
              </li>
              <li className="p-2">
                Fragmented data: Data is often scattered across various sources
                and organisations, making it difficult to access and analyse.
              </li>
              <li className="p-2">
                Inconsistent data standards: The absence of unified data
                standards and formats further complicates data sharing and
                analysis.
              </li>
              <li className="p-2">
                Poor categorisation: Data is often poorly categorised or
                organised, reducing usability and value.
              </li>
              <li className="p-2">
                Data underutilisation: Due to the above challenges, much of the
                collected data becomes outdated or underutilised, preventing
                farmers' development of better use cases.
              </li>
            </ul>

            <h2>Solution</h2>
            <p>
              Farmstack, an open-source data exchange platform, has been
              developed to tackle these issues and unlock the full potential of
              the collected data:
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
                organisations, promoting a more open and collaborative
                environment.
              </li>
              <li className="p-2">
                Data consolidation: Farmstack combines fragmented data from
                various sources, making it more accessible and valuable.
              </li>
              <li className="p-2">
                Standardisation: The platform promotes the adoption of unified
                data standards and formats, facilitating better data sharing and
                analysis.
              </li>
              <li className="p-2">
                Improved categorisation: Farmstack aids in better organisation
                and categorisation of data, enhancing its usability and value.
              </li>
              <li className="p-2">
                Impactful use cases: By harnessing the potential of collective
                data, Farmstack facilitates the development of more effective
                use cases for farmers, ultimately leading to improved
                agricultural practices and outcomes.
              </li>
            </ul>
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <Box className="text-left">
            <h1>Introducing Farmstack</h1>
            <h2 className="pt-2">
              Revolutionising Data Exchange in Agriculture
            </h2>
            <p>
              Discover the power of Farmstack, a groundbreaking data exchange
              platform that streamlines collaboration between key players in the
              agricultural sector. Designed with two essential roles - Stewards
              and Participants - Farmstack empowers organisations to break down
              silos, establish trust, and unleash the full potential of their
              collective data.
            </p>
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <Box className="text-left">
            <h1>Stewards: The Guardians of Data</h1>
            <p>
              Stewards form the backbone of Farmstack, expertly managing the
              platform while performing crucial tasks such as:
            </p>
            <ul>
              <li className="p-2">
                Hosting and managing cutting-edge Farmstack software
              </li>
              <li className="p-2">
                Orchestrating a seamless data exchange network
              </li>
              <li className="p-2">
                Defining robust data exchange and usage policies
              </li>
              <li className="p-2">
                Ensuring easy data discovery on the platform
              </li>
              <li className="p-2">
                Establishing industry-leading data standards and categories
              </li>
              <li className="p-2">
                Expertly managing the data provider and consumer organisations,
                known as participants
              </li>
              <li className="p-2">
                Supervising datasets with diligence and precision
              </li>
            </ul>
            <p>
              Stewards can contribute to the valuable data pool by joining the
              network as data providers and consumers. With the flexibility to
              include co-stewards and sub-stewards, Farmstack allows
              organisations to create tailored networks that suit their unique
              needs.
            </p>
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <Box className="text-left">
            <h1>Participants: The Data Pioneers</h1>
            <p>
              As data providers, consumers, or both, participants drive data
              exchange within the Farmstack ecosystem. They fulfill a wide range
              of responsibilities, including:
            </p>
            <ul>
              <li className="p-2">
                Showcasing their data for easy discoverability by other
                participants
              </li>
              <li className="p-2">
                Uploading datasets in diverse formats, including XLS, CSV, PDF,
                and image files
              </li>
              <li className="p-2">
                Seamlessly importing datasets from databases like MySQL,
                PostgreSQL, SQLite, or REST APIs.
              </li>
              <li className="p-2">
                Standardizing and categorizing data to maintain the highest
                quality
              </li>
              <li className="p-2">
                Publishing data with confidence after applying secure usage
                policies
              </li>
            </ul>

            <h2>Participant Management</h2>
            <p>
              Farmstack Participant Management offers admins a comprehensive
              suite of tools to manage and engage with participants, fostering a
              thriving ecosystem of data-driven innovation and collaboration in
              the agricultural sector.
            </p>
            <ul>
              <li className="p-2">
                Streamlined participant onboarding: Admins can easily add or
                invite new participants through email, ensuring a seamless
                onboarding experience. Users can also request or register as
                participants, with admin approvals ensuring the right
                stakeholders join the platform.
              </li>
              <li className="p-2">
                Efficient Participant Management: Admins can effortlessly update
                or delete participant profiles, maintaining an organized and
                efficient FarmStack ecosystem.
              </li>
              <li className="p-2">
                Empower Co-Stewards: Admins have the ability to promote
                participants as co-stewards, encouraging collaboration and joint
                stewardship of the data exchange platform.
              </li>
            </ul>
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={4}>
          <Box className="text-left">
            <h1>Dataset Management</h1>
            <p>
              Farmstack Dataset Management provides users with a comprehensive
              suite of tools to create, upload, and publish datasets
              effectively. Improve data discoverability and usability through
              intuitive categorization, standardisation, and flexible usage
              policy implementation.
            </p>
            <ul>
              <li className="p-2">Effortless Dataset Creation</li>
              <p>
                Users can quickly create datasets by providing metadata,
                ensuring accurate and organised information that enhances
                discoverability.
              </p>
              <li className="p-2">Versatile data uploads</li>
              <p>
                Supporting a wide array of formats, users can upload multiple
                files for a dataset, including XLS, CSV, JPG, PNG, TIFF, and
                PDF.
              </p>
              <li className="p-2">Seamless data import and integration</li>
              <p>
                Easily import and publish data from various sources like MySQL,
                PostgreSQL, MongoDB, SQLite, and REST APIs, consolidating
                valuable information into one powerful platform.
              </p>
              <li className="p-2">
                Intelligent Dataset Categorization and Standardisation
              </li>
              <p>
                Efficiently categorise datasets based on factors like value
                chain and geography while standardising data for improved
                consistency and usability across the platform.
              </p>
              <li className="p-2">Tailored Usage Policies</li>
            </ul>
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={5}>
          <Box className="text-left">
            <h1>
              Data Integration Connectors: Unleashing the Power of Collective
              Data
            </h1>
            <p>
              By creating data integration connectors, participants can unlock a
              wealth of insights and solutions. These robust connectors enable
              the seamless combination of datasets from multiple organisations,
              paving the way for more valuable and comprehensive data.
            </p>
            <p>By leveraging data integration connectors, participants can:</p>
            <ul>
              <li className="p-2">
                Select and merge datasets from various organisations to create
                enriched data sources.
              </li>
              <li className="p-2">
                Uncover hidden insights and patterns that may not be apparent
                when analysing individual datasets.
              </li>
              <li className="p-2">
                Facilitate collaboration and knowledge sharing between
                organisations.
              </li>
              <li className="p-2">
                Drive the development of more effective and innovative use cases
                that benefit farmers worldwide.
              </li>
            </ul>
            <p>
              Farmstack is more than just a data exchange platform - it's a
              revolution in agricultural data management. By uniting stewards
              and participants and harnessing the power of data integration
              connectors, Farmstack paves the way for improved agricultural
              practices, enhanced collaboration, and the creation of impactful
              use cases. Embrace the future of agriculture with Farmstack.
            </p>
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={6}>
          <Box className="text-left">
            <h1>Category and Subcategory Management</h1>
            <p>
              Optimise dataset discoverability and organisation with Farmstack
              Category and Subcategory Management. This powerful feature allows
              admins to create, update, and delete categories and subcategories,
              making finding and utilising relevant datasets easier.
            </p>
            <ul>
              <li className="p-2">
                <strong>Configure Categories and Subcategories</strong>
                <p>
                  Admins can effortlessly create and configure categories and
                  their respective subcategories, ensuring that datasets are
                  accurately classified and easily discoverable within the
                  Farmstack ecosystem.
                </p>
              </li>
              <li className="p-2">
                <strong>Update categories and subcategories.</strong>
                <p>
                  Admins have the flexibility to update existing categories and
                  subcategories, ensuring that the classification system remains
                  current and adapts to the ever-evolving needs of the
                  agricultural sector.
                </p>
              </li>
              <li className="p-2">
                <strong>Delete categories and subcategories.</strong>
                <p>
                  Admins can easily delete specific categories and subcategories
                  as needed, maintaining a streamlined and efficient
                  classification system for all participants.
                </p>
              </li>
            </ul>
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={7}>
          <Box className="text-left">
            <h1>Data Standardisation Templates</h1>
            <p>
              Farmstack Data Standardisation Templates empower admins to create,
              update, and delete templates that help participants map
              non-standardized column names to standardised ones. This feature
              ensures consistency across datasets and improves the overall
              usability of the data.
            </p>
            <ul>
              <li className="p-2">
                <strong>Create Data Standardisation Templates</strong>
                <p>
                  Admins can quickly create templates for data standardisation,
                  ensuring that all datasets within the Farmstack ecosystem
                  adhere to a consistent format.
                </p>
              </li>
              <li className="p-2">
                <strong>Update Existing Templates</strong>
                <p>
                  Admins can easily update existing data standardisation
                  templates, allowing for continuous improvement and adaptation
                  to the evolving needs of the agricultural community.
                </p>
              </li>
              <li className="p-2">
                <strong>Delete Data Standardisation Templates</strong>
                <p>
                  Admins can delete data standardisation templates when
                  necessary, ensuring that only relevant and functional
                  templates are available for participants.
                </p>
              </li>
            </ul>
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={8}>
          <Box className="text-left">
            <h1>Frequently asked questions</h1>
            <ol>
              <li className="p-2">
                <strong>What is FarmStack?</strong>
                <p>
                  Farmstack is a data exchange platform designed for the
                  agriculture sector, enabling organisations such as government
                  bodies, NGOs, research institutions, and others to collaborate
                  and share valuable data, driving innovation and unlocking the
                  full potential of agricultural data.
                </p>
              </li>
              <li className="p-2">
                <strong>Who can use Farmstack?</strong>
                <p>
                  Farmstack is designed for various organisations in the
                  agriculture sector, including government agencies,
                  non-government organisations, research institutions,
                  for-profit entities, and not-for-profit organisations.
                </p>
              </li>
              <li className="p-2">
                <strong>
                  How does Farmstack ensure data security and compliance?
                </strong>
                <p>
                  Farmstack allows users to apply customised usage policies to
                  datasets, controlling access and download permissions for
                  enhanced data security and compliance. Moreover, Farmstack is
                  built on open-source software, ensuring transparency and
                  adherence to industry-standard security practices.
                </p>
              </li>
              <li className="p-2">
                <strong>What types of data can I upload to Farmstack?</strong>
                <p>
                  Farmstack supports various data formats, including XLS, CSV,
                  JPG, PNG, TIFF, and PDF. Users can also import and publish
                  data from various sources like MySQL, PostgreSQL, MongoDB,
                  SQLite, and REST APIs.
                </p>
              </li>
              <li className="p-2">
                <strong>
                  How does Farmstack help standardise and categorise data?
                </strong>
                <p>
                  Farmstack enables users to efficiently categorise datasets
                  based on factors like value chain and geography, while
                  standardising data for improved consistency and usability
                  across the platform. Administrators can create data
                  standardisation templates and manage categories and
                  subcategories for better data organisation.
                </p>
              </li>
              <li className="p-2">
                <strong>
                  Can I join and export datasets from different organisations?
                </strong>
                <p>
                  Farmstack Dataset Integration allows participants to select,
                  join, and export datasets from multiple organisations,
                  fostering data-driven insights and cutting-edge solutions.
                </p>
              </li>
              <li className="p-2">
                <strong>
                  How can Farmstack help automate my data management processes?
                </strong>
                <p>
                  Farmstack Data Pipeline revolutionises data management by
                  automating connections, transformations, and data syncing for
                  a more efficient and seamless experience. Users can easily
                  connect to a range of data sources, apply complex
                  transformations, and set up automated delta fetches and
                  time-based fetches.
                </p>
              </li>
              <li className="p-2">
                <strong>
                  How do I become a participant or a steward on Farmstack?
                </strong>
                <p>
                  To become a participant or steward on Farmstack, you can
                  register directly on the platform or contact the hosting
                  organisation for an invitation. As a steward, you will be
                  responsible for managing the data exchange platform, while
                  participants can act as data providers, data consumers, or
                  both.
                </p>
              </li>
              <li className="p-2">
                <strong>
                  What is the Farmstack's Data for Good philosophy?
                </strong>
                <p>
                  Farmstack's Data for Good philosophy emphasises the importance
                  of leveraging agricultural data to drive positive change and
                  create a more sustainable, efficient, and prosperous future
                  for farmers and the agriculture sector as a whole.
                </p>
              </li>
              <li className="p-2">
                <strong>
                  How can I get in touch for support or more information?
                </strong>
                <p>
                  If you have any questions, need support, or would like more
                  information about Farmstack, please visit our website's
                  Contact Us page. Our team is always here to help!
                </p>
              </li>
              <li className="p-2">
                <strong>What are the key features of Farmstack?</strong>
                <p>
                  Farmstack offers extensive features, including dataset
                  discovery, steward application setup, category and subcategory
                  management, data standardisation templates, participant and
                  team management, dataset management, dataset integration, and
                  data pipeline automation.
                </p>
              </li>
              <li className="p-2">
                <strong>
                  Can I use Farmstack to share confidential or sensitive data?
                </strong>
                <p>
                  Yes, Farmstack enables users to apply customised usage
                  policies to their datasets, allowing you to control access and
                  download permissions for sensitive or confidential data.
                </p>
              </li>
              <li className="p-2">
                <strong>
                  How does Farmstack facilitate collaboration among
                  organisations?
                </strong>
                <p>
                  Farmstack allows organisations to share and access valuable
                  agricultural data from various sources. By providing a
                  centralised platform to discover, integrate, and manage
                  datasets, Farmstack encourages collaboration and data-driven
                  innovation.
                </p>
              </li>
              <li className="p-2">
                <strong>What is a digital public good (DPG)?</strong>
                <p>
                  A digital public good is an openly licensed digital solution
                  that adheres to privacy and security standards and is designed
                  to help achieve the United Nations Sustainable Development
                  Goals. Farmstack has been recognised as a digital public good
                  by the Digital Public Goods Alliance.
                </p>
              </li>
              <li className="p-2">
                <strong>
                  Who are the main partners and supporters of Farmstack?
                </strong>
                <p>
                  Farmstack is a digital green project supported by prominent
                  organisations including the Bill and Melinda Gates Foundation,
                  Walmart Labs, and UK Aid.
                </p>
              </li>
              <li className="p-2">
                <strong>
                  Can I customise Farmstack to match my organisation's branding?
                </strong>
                <p>
                  Farmstack allows administrators to upload custom images and
                  branding elements to align the platform with their
                  organisation's identity.
                </p>
              </li>
              <li className="p-2">
                <strong>
                  How do I request a new feature or report an issue with
                  Farmstack?
                </strong>
                <p>
                  To request a new feature or report an issue, please visit the
                  Contact Us page on our website. We appreciate your feedback
                  and strive to continually improve Farmstack.
                </p>
              </li>
              <li className="p-2">
                <strong>
                  Is there any cost associated with using Farmstack?
                </strong>
                <p>
                  Farmstack is open-source software that organisations can
                  install and use at no cost. However, organisations may incur
                  expenses related to hosting, maintenance, and customization of
                  the platform, depending on their specific requirements.
                </p>
              </li>
              <li className="p-2">
                <strong>
                  How can I stay updated on the latest news and developments
                  related to Farmstack?
                </strong>
                <p>
                  To stay informed about Farmstack updates, new features, and
                  developments, please subscribe to our newsletter, follow us on
                  social media, or visit the News section on our website.
                </p>
              </li>
              <li className="p-2">
                <strong>
                  Can Farmstack be used for other sectors besides agriculture?
                </strong>
                <p>
                  While Farmstack is specifically designed for the agriculture
                  sector, its open-source nature and flexible architecture make
                  it adaptable to various other sectors requiring data exchange
                  and collaboration. If you are interested in using Farmstack
                  for a different sector, please contact us to discuss your
                  specific requirements.
                </p>
              </li>
            </ol>
          </Box>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default Sidebar;
