import React from "react";
import { server } from "../../mocks/server";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { rest } from "msw";
import {
  isLoggedInUserParticipant,
  setRoleLocal,
  setUserId,
  setUserMapId,
} from "../../Utils/Common";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import { BrowserRouter as Router } from "react-router-dom";
import UrlConstant from "../../Constants/UrlConstants";
import AddConnector from "../../Views/Connector_New/AddConnector";
import userEvent from "@testing-library/user-event/";
import { TruckFlatbed } from "react-bootstrap-icons";

global.URL.createObjectURL = jest.fn(() => "mocked-object-url");
global.URL.revokeObjectURL = jest.fn();

describe("Listing part of the connectors", () => {
  afterEach(() => {
    cleanup();
  });
  beforeEach(() => {
    cleanup();
  });

  function findAndGiveNameAndDesc() {
    const connectorName = screen.getByPlaceholderText(/Connector name/i);
    expect(connectorName).toBeInTheDocument();

    fireEvent.change(connectorName, {
      target: { value: "unique connector name" },
    });
    expect(connectorName.value).toBe("unique connector name");

    const connectorDesc = screen.getByPlaceholderText(
      /Connector description not more than 512 character/i
    );
    expect(connectorDesc).toBeInTheDocument();
    fireEvent.change(connectorDesc, {
      target: { value: "unique connector desc" },
    });
    expect(connectorDesc.value).toBe("unique connector desc");
  }

  async function fillingFormDetail() {
    //asserting the option to be available in the organisation list select option
    const orgListSelectInput = await screen.findByPlaceholderText(
      /select organisation/i
    );
    expect(orgListSelectInput).toBeInTheDocument();

    fireEvent.change(orgListSelectInput, {
      target: { value: "5c6d28fb-8603-417c-95db-ecf2e85f4f07" },
    });

    //asserting the option to be available in the dataset list select option
    const datasetListElement = await screen.findByPlaceholderText(
      /select dataset/i
    );
    expect(datasetListElement).toBeInTheDocument();

    fireEvent.change(datasetListElement, {
      target: { value: "c50f2cc1-9286-4ea6-a390-885c59ed94d7" },
    });

    //asserting the option to be available in the file list select option
    const fileListElement = await screen.findByPlaceholderText(/select file/i);
    expect(fileListElement).toBeInTheDocument();

    fireEvent.change(fileListElement, {
      target: { value: "Connector test/file/demo1234.csv" },
    });

    const addButton = await screen.findByRole("button", {
      name: /add/i,
    });

    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeEnabled();

    fireEvent.click(addButton);
  }

  //DATAHUB ADMIN SIDE test cases
  test("Component rendered successfully and checking for the labels", async () => {
    jest.setTimeout(10000);
    //adding a new connector isEditModeOn={false} connectorIdForView={false}
    setUserId("0f76cb90-2394-499b-9b60-bf4cad3751a4");
    userEvent.setup();
    render(
      <Router>
        <AddConnector isEditModeOn={false} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const statusOfConnector = screen.getByTestId(
      /label-for-state-of-connector/i
    );
    //asserting that its in add mode
    expect(statusOfConnector).toHaveTextContent("New connector");

    findAndGiveNameAndDesc();
    await fillingFormDetail();

    const addButton = await screen.findByRole("button", {
      name: /add/i,
    });

    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();

    const orgListSelectInput = await screen.findByPlaceholderText(
      /select organisation/i
    );
    expect(orgListSelectInput).toBeInTheDocument();

    fireEvent.change(orgListSelectInput, {
      target: { value: "" },
    });
    fireEvent.change(orgListSelectInput, {
      target: { value: "5c6d28fb-8603-417c-95db-ecf2e85f4f07" },
    });

    //asserting the option to be available in the dataset list select option
    const datasetListElement = await screen.findByPlaceholderText(
      /select dataset/i
    );
    expect(datasetListElement).toBeInTheDocument();

    fireEvent.change(datasetListElement, {
      target: { value: "c50f2cc1-9286-4ea6-a390-885c59ed94d7" },
    });

    //asserting the option to be available in the file list select option
    const fileListElement = await screen.findByPlaceholderText(/select file/i);
    expect(fileListElement).toBeInTheDocument();
    fireEvent.change(fileListElement, {
      target: { value: "" },
    });
    fireEvent.change(fileListElement, {
      target: { value: "Connector test/file/demo1234.csv" },
    });

    const addButton1 = await screen.findByRole("button", {
      name: /add/i,
    });

    expect(addButton1).toBeInTheDocument();
    expect(addButton1).toBeEnabled();

    fireEvent.click(addButton);

    //asserting that two cards are there in the dom

    const cardMainDiv = await screen.findAllByTestId(/connector_card/i);
    expect(cardMainDiv).toHaveLength(2);

    // const selectAllButtonInFirstCard = await screen.findAllByRole("checkbox", {
    //   name: "name",
    // });
    // expect(selectAllButtonInFirstCard[0]).toBeInTheDocument();
    // fireEvent.click(selectAllButtonInFirstCard);
    // fireEvent.click(selectAllButtonInFirstCard);

    //selecting the columns in the first card
    const firstColumnOfFirstCard = await screen.findAllByRole(
      "checkbox",
      { name: "name" }
      // /select-columns0-files/i
    );
    expect(firstColumnOfFirstCard[0]).toBeInTheDocument();
    expect(firstColumnOfFirstCard[1]).toBeInTheDocument();

    fireEvent.click(firstColumnOfFirstCard[0]);
    fireEvent.click(firstColumnOfFirstCard[0]);
    fireEvent.click(firstColumnOfFirstCard[0]);
    fireEvent.click(firstColumnOfFirstCard[1]);
    fireEvent.click(firstColumnOfFirstCard[1]);
    fireEvent.click(firstColumnOfFirstCard[1]);
    // console.log(firstColumnOfFirstCard);
    const joinConnector = await screen.findAllByTestId(/join-connector/i);
    expect(joinConnector).toHaveLength(1);
    fireEvent.click(joinConnector[0]);
    const join_in_open_state = await screen.findAllByTestId(
      /join_in_open_state/i
    );
    expect(join_in_open_state).toHaveLength(1);

    //join is open and left and right

    //left joing by option select
    const divForLeftColumn = screen.getByPlaceholderText("Join column (left)");
    // console.log(divForLeftColumn, "divForLeftColumn");

    expect(divForLeftColumn).toBeInTheDocument();

    fireEvent.change(divForLeftColumn, {
      target: { value: "name" },
    });
    screen.debug(divForLeftColumn);

    expect(divForLeftColumn).toHaveValue("name");

    //right joing by option select
    const divForRightColumn = screen.getByPlaceholderText(
      "Join column (right)"
    );
    // console.log(divForLeftColumn, "divForLeftColumn");

    expect(divForRightColumn).toBeInTheDocument();

    fireEvent.change(divForRightColumn, {
      target: { value: "name" },
    });
    screen.debug(divForRightColumn);

    expect(divForRightColumn).toHaveValue("name");

    //type of the join selection - innerjoin
    const innerJoinType = await screen.findByTestId(/innerjoin/i);
    fireEvent.click(innerJoinType);
    screen.debug(innerJoinType);

    //click on the apply button
    const applyButton = await screen.findByRole("button", { name: /apply/i });
    screen.debug(applyButton);
    expect(applyButton).toBeEnabled();
    fireEvent.click(applyButton);

    //Saving the connector
    const connectorSaveButton = await screen.findByRole("button", {
      name: /save connector/i,
    });
    fireEvent.click(connectorSaveButton);
  });
  test("Component rendered successfully and checking for the labels when costeward logged in", async () => {
    jest.setTimeout(10000);
    //adding a new connector isEditModeOn={false} connectorIdForView={false}
    setUserId("0f76cb90-2394-499b-9b60-bf4cad3751a4");
    setRoleLocal("datahub_co_steward");
    userEvent.setup();
    render(
      <Router>
        <AddConnector isEditModeOn={false} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const statusOfConnector = screen.getByTestId(
      /label-for-state-of-connector/i
    );
    //asserting that its in add mode
    expect(statusOfConnector).toHaveTextContent("New connector");

    findAndGiveNameAndDesc();
    await fillingFormDetail();

    const addButton = await screen.findByRole("button", {
      name: /add/i,
    });

    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();

    const orgListSelectInput = await screen.findByPlaceholderText(
      /select organisation/i
    );
    expect(orgListSelectInput).toBeInTheDocument();

    fireEvent.change(orgListSelectInput, {
      target: { value: "" },
    });
    fireEvent.change(orgListSelectInput, {
      target: { value: "5c6d28fb-8603-417c-95db-ecf2e85f4f07" },
    });

    //asserting the option to be available in the dataset list select option
    const datasetListElement = await screen.findByPlaceholderText(
      /select dataset/i
    );
    expect(datasetListElement).toBeInTheDocument();

    fireEvent.change(datasetListElement, {
      target: { value: "c50f2cc1-9286-4ea6-a390-885c59ed94d7" },
    });

    //asserting the option to be available in the file list select option
    const fileListElement = await screen.findByPlaceholderText(/select file/i);
    expect(fileListElement).toBeInTheDocument();
    fireEvent.change(fileListElement, {
      target: { value: "" },
    });
    fireEvent.change(fileListElement, {
      target: { value: "Connector test/file/demo1234.csv" },
    });

    const addButton1 = await screen.findByRole("button", {
      name: /add/i,
    });

    expect(addButton1).toBeInTheDocument();
    expect(addButton1).toBeEnabled();

    fireEvent.click(addButton);

    //asserting that two cards are there in the dom

    const cardMainDiv = await screen.findAllByTestId(/connector_card/i);
    expect(cardMainDiv).toHaveLength(2);

    // const selectAllButtonInFirstCard = await screen.findAllByRole("checkbox", {
    //   name: "name",
    // });
    // expect(selectAllButtonInFirstCard[0]).toBeInTheDocument();
    // fireEvent.click(selectAllButtonInFirstCard);
    // fireEvent.click(selectAllButtonInFirstCard);

    //selecting the columns in the first card
    const firstColumnOfFirstCard = await screen.findAllByRole(
      "checkbox",
      { name: "name" }
      // /select-columns0-files/i
    );
    expect(firstColumnOfFirstCard[0]).toBeInTheDocument();
    expect(firstColumnOfFirstCard[1]).toBeInTheDocument();

    fireEvent.click(firstColumnOfFirstCard[0]);
    fireEvent.click(firstColumnOfFirstCard[0]);
    fireEvent.click(firstColumnOfFirstCard[0]);
    fireEvent.click(firstColumnOfFirstCard[1]);
    fireEvent.click(firstColumnOfFirstCard[1]);
    fireEvent.click(firstColumnOfFirstCard[1]);
    // console.log(firstColumnOfFirstCard);
    const joinConnector = await screen.findAllByTestId(/join-connector/i);
    expect(joinConnector).toHaveLength(1);
    fireEvent.click(joinConnector[0]);
    const join_in_open_state = await screen.findAllByTestId(
      /join_in_open_state/i
    );
    expect(join_in_open_state).toHaveLength(1);

    //join is open and left and right

    //left joing by option select
    const divForLeftColumn = screen.getByPlaceholderText("Join column (left)");
    // console.log(divForLeftColumn, "divForLeftColumn");

    expect(divForLeftColumn).toBeInTheDocument();

    fireEvent.change(divForLeftColumn, {
      target: { value: "name" },
    });
    screen.debug(divForLeftColumn);

    expect(divForLeftColumn).toHaveValue("name");

    //right joing by option select
    const divForRightColumn = screen.getByPlaceholderText(
      "Join column (right)"
    );
    // console.log(divForLeftColumn, "divForLeftColumn");

    expect(divForRightColumn).toBeInTheDocument();

    fireEvent.change(divForRightColumn, {
      target: { value: "name" },
    });
    screen.debug(divForRightColumn);

    expect(divForRightColumn).toHaveValue("name");

    //type of the join selection - innerjoin
    const innerJoinType = await screen.findByTestId(/innerjoin/i);
    fireEvent.click(innerJoinType);
    screen.debug(innerJoinType);

    //click on the apply button
    const applyButton = await screen.findByRole("button", { name: /apply/i });
    screen.debug(applyButton);
    expect(applyButton).toBeEnabled();
    fireEvent.click(applyButton);

    //Saving the connector
    const connectorSaveButton = await screen.findByRole("button", {
      name: /save connector/i,
    });
    fireEvent.click(connectorSaveButton);
  });
  test("opening a connector in edit mode", () => {
    render(
      <Router>
        <AddConnector
          isEditModeOn={true}
          connectorIdForView={"19d3c6b4-fe49-4f86-8ff9-c3a34860afc3"}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("Downloading the connector data in edit mode", async () => {
    render(
      <Router>
        <AddConnector
          isEditModeOn={true}
          connectorIdForView={"19d3c6b4-fe49-4f86-8ff9-c3a34860afc3"}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const downloadButton = await screen.findByTestId(
      /download_connector_data/i
    );
    expect(downloadButton).toBeInTheDocument();
    fireEvent.click(downloadButton);

    const downloadButtonForRefractedConnectorData = await screen.findByTestId(
      /download_connector_data_refracted/i
    );
    expect(downloadButtonForRefractedConnectorData).toBeInTheDocument();
    fireEvent.click(downloadButtonForRefractedConnectorData);
  });
  test("cancelling and downloading the normal connector data without refraction in edit mode", async () => {
    render(
      <Router>
        <AddConnector
          isEditModeOn={true}
          connectorIdForView={"19d3c6b4-fe49-4f86-8ff9-c3a34860afc3"}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const downloadButton = await screen.findByTestId(
      /download_connector_data/i
    );
    expect(downloadButton).toBeInTheDocument();
    fireEvent.click(downloadButton);

    const connector_data_cancel = await screen.findByTestId(
      /connector_data_cancel/i
    );
    expect(connector_data_cancel).toBeInTheDocument();
    fireEvent.click(connector_data_cancel);

    const downloadButton1 = await screen.findByTestId(
      /download_connector_data/i
    );
    expect(downloadButton1).toBeInTheDocument();
    fireEvent.click(downloadButton1);

    const download_connector_data_normal = await screen.findByTestId(
      /download_connector_data_normal/i
    );
    expect(download_connector_data_normal).toBeInTheDocument();
    fireEvent.click(download_connector_data_normal);
  });

  test("opening a connector in edit mode and cancelling it", async () => {
    render(
      <Router>
        <AddConnector
          isEditModeOn={true}
          connectorIdForView={"19d3c6b4-fe49-4f86-8ff9-c3a34860afc3"}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const cancelButton = await screen.findByTestId(/cancel_button_connector/i);
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
  });

  test("get call error for no auth", async () => {
    server.use(
      rest.get(
        UrlConstant.base_url + UrlConstant.get_org_name_list,
        (req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({
              error: "error",
            })
          );
        }
      )
    );

    render(
      <Router>
        <AddConnector isEditModeOn={false} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("Failing get connector data and checking for the component behaviour and handling the same", async () => {
    server.use(
      rest.get(
        UrlConstant.base_url +
          UrlConstant.integration_connectors +
          ":connectorId",
        (req, res, ctx) => {
          console.log("inside failing_");
          return res(
            ctx.status(401),
            ctx.json({
              error: "error",
            })
          );
        }
      )
    );

    render(
      <Router>
        <AddConnector
          isEditModeOn={true}
          connectorIdForView={"19d3c6b4-fe49-4f86-8ff9-c3a34860afc3"}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("Invalid name connector data and checking for the component behaviour and handling the same", async () => {
    server.use(
      rest.get(
        UrlConstant.base_url +
          UrlConstant.integration_connectors +
          ":connectorId",
        (req, res, ctx) => {
          console.log("inside failing_");
          return res(
            ctx.status(400),
            ctx.json({
              name: "Invalid name",
            })
          );
        }
      )
    );

    render(
      <Router>
        <AddConnector
          isEditModeOn={true}
          connectorIdForView={"19d3c6b4-fe49-4f86-8ff9-c3a34860afc3"}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("Invalid name connector data and checking for the component behaviour and handling the same", async () => {
    server.use(
      rest.get(
        UrlConstant.base_url +
          UrlConstant.integration_connectors +
          ":connectorId",
        (req, res, ctx) => {
          console.log("inside failing_");
          return res(
            ctx.status(400),
            ctx.json({
              description: "Invalid description",
            })
          );
        }
      )
    );

    render(
      <Router>
        <AddConnector
          isEditModeOn={true}
          connectorIdForView={"19d3c6b4-fe49-4f86-8ff9-c3a34860afc3"}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("Some other error connector data and checking for the component behaviour and handling the same", async () => {
    server.use(
      rest.get(
        UrlConstant.base_url +
          UrlConstant.integration_connectors +
          ":connectorId",
        (req, res, ctx) => {
          console.log("inside failing_");
          return res(
            ctx.status(400),
            ctx.json({
              other: "Something went wrong",
            })
          );
        }
      )
    );

    render(
      <Router>
        <AddConnector
          isEditModeOn={true}
          connectorIdForView={"19d3c6b4-fe49-4f86-8ff9-c3a34860afc3"}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("Failing when user tries to integrate in the first place", async () => {
    server.use(
      rest.post(
        UrlConstant.base_url + UrlConstant.joining_the_table,
        (req, res, ctx) => {
          console.log("qwe");
          return res(ctx.status(403), ctx.json({ error: "some error" }));
        }
      )
    );

    jest.setTimeout(10000);
    //adding a new connector isEditModeOn={false} connectorIdForView={false}
    // setUserId("0f76cb90-2394-499b-9b60-bf4cad3751a4");
    userEvent.setup();
    render(
      <Router>
        <AddConnector isEditModeOn={false} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const statusOfConnector = screen.getByTestId(
      /label-for-state-of-connector/i
    );
    //asserting that its in add mode
    expect(statusOfConnector).toHaveTextContent("New connector");

    findAndGiveNameAndDesc();
    await fillingFormDetail();

    const addButton = await screen.findByRole("button", {
      name: /add/i,
    });

    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();

    const orgListSelectInput = await screen.findByPlaceholderText(
      /select organisation/i
    );
    expect(orgListSelectInput).toBeInTheDocument();

    fireEvent.change(orgListSelectInput, {
      target: { value: "" },
    });
    fireEvent.change(orgListSelectInput, {
      target: { value: "5c6d28fb-8603-417c-95db-ecf2e85f4f07" },
    });

    //asserting the option to be available in the dataset list select option
    const datasetListElement = await screen.findByPlaceholderText(
      /select dataset/i
    );
    expect(datasetListElement).toBeInTheDocument();

    fireEvent.change(datasetListElement, {
      target: { value: "c50f2cc1-9286-4ea6-a390-885c59ed94d7" },
    });

    //asserting the option to be available in the file list select option
    const fileListElement = await screen.findByPlaceholderText(/select file/i);
    expect(fileListElement).toBeInTheDocument();
    fireEvent.change(fileListElement, {
      target: { value: "" },
    });
    fireEvent.change(fileListElement, {
      target: { value: "Connector test/file/demo1234.csv" },
    });

    const addButton1 = await screen.findByRole("button", {
      name: /add/i,
    });

    expect(addButton1).toBeInTheDocument();
    expect(addButton1).toBeEnabled();

    fireEvent.click(addButton);

    //asserting that two cards are there in the dom

    const cardMainDiv = await screen.findAllByTestId(/connector_card/i);
    expect(cardMainDiv).toHaveLength(2);

    // const selectAllButtonInFirstCard = await screen.findAllByRole("checkbox", {
    //   name: "name",
    // });
    // expect(selectAllButtonInFirstCard[0]).toBeInTheDocument();
    // fireEvent.click(selectAllButtonInFirstCard);
    // fireEvent.click(selectAllButtonInFirstCard);

    //selecting the columns in the first card
    const firstColumnOfFirstCard = await screen.findAllByRole(
      "checkbox",
      { name: "name" }
      // /select-columns0-files/i
    );
    expect(firstColumnOfFirstCard[0]).toBeInTheDocument();
    expect(firstColumnOfFirstCard[1]).toBeInTheDocument();

    fireEvent.click(firstColumnOfFirstCard[0]);
    fireEvent.click(firstColumnOfFirstCard[0]);
    fireEvent.click(firstColumnOfFirstCard[0]);
    fireEvent.click(firstColumnOfFirstCard[1]);
    fireEvent.click(firstColumnOfFirstCard[1]);
    fireEvent.click(firstColumnOfFirstCard[1]);
    // console.log(firstColumnOfFirstCard);
    const joinConnector = await screen.findAllByTestId(/join-connector/i);
    expect(joinConnector).toHaveLength(1);
    fireEvent.click(joinConnector[0]);
    const join_in_open_state = await screen.findAllByTestId(
      /join_in_open_state/i
    );
    expect(join_in_open_state).toHaveLength(1);

    //join is open and left and right

    //left joing by option select
    const divForLeftColumn = screen.getByPlaceholderText("Join column (left)");
    // console.log(divForLeftColumn, "divForLeftColumn");

    expect(divForLeftColumn).toBeInTheDocument();

    fireEvent.change(divForLeftColumn, {
      target: { value: "name" },
    });
    screen.debug(divForLeftColumn);

    expect(divForLeftColumn).toHaveValue("name");

    //right joing by option select
    const divForRightColumn = screen.getByPlaceholderText(
      "Join column (right)"
    );
    // console.log(divForLeftColumn, "divForLeftColumn");

    expect(divForRightColumn).toBeInTheDocument();

    fireEvent.change(divForRightColumn, {
      target: { value: "name" },
    });
    screen.debug(divForRightColumn);

    expect(divForRightColumn).toHaveValue("name");

    //type of the join selection - innerjoin
    const innerJoinType = await screen.findByTestId(/innerjoin/i);
    fireEvent.click(innerJoinType);
    screen.debug(innerJoinType);

    //click on the apply button
    const applyButton = await screen.findByRole("button", { name: /apply/i });
    screen.debug(applyButton);
    expect(applyButton).toBeEnabled();
    fireEvent.click(applyButton);
  });
});
