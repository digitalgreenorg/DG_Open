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
import Connectors from "../../Components/Connectors_New/Connectors";

global.URL.createObjectURL = jest.fn(() => "mocked-object-url");
global.URL.revokeObjectURL = jest.fn();

describe("Listing part of the connectors", () => {
  afterEach(() => {
    cleanup();
  });
  beforeEach(() => {
    // cleanup();
  });
  test("Component rendered successfully in mobile or tablet mode", () => {
    // Save the original window.innerWidth to restore later
    const originalInnerWidth = global.innerWidth;

    // Change window.innerWidth to simulate mobile view
    global.innerWidth = 600; // Set the desired width for mobile

    setUserId("0f76cb90-2394-499b-9b60-bf4cad3751a4");
    render(
      <Router>
        <Connectors />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("Component rendered successfully", () => {
    setUserId("0f76cb90-2394-499b-9b60-bf4cad3751a4");
    render(
      <Router>
        <Connectors />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("Check for the existance of labels and button and static cards admin", async () => {
    //user is datahub admin
    setUserId("0f76cb90-2394-499b-9b60-bf4cad3751a4");
    setRoleLocal("datahub_admin");
    render(
      <Router>
        <Connectors />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const listOfConnectorLabel = screen.getByText(/list of connectors/i);
    expect(listOfConnectorLabel).toBeInTheDocument();

    const listViewDivElement = await screen.findByTestId(
      /list_view_option_div/i
    );
    expect(listViewDivElement).toBeInTheDocument();
    fireEvent.click(listViewDivElement);

    const gridViewDivElement = await screen.findByTestId(
      /grid_view_option_div/i
    );
    expect(gridViewDivElement).toBeInTheDocument();
    fireEvent.click(gridViewDivElement);

    const loadButtonCheck = await screen.findByRole("button", {
      name: /load more/i,
    });
    expect(loadButtonCheck).toBeInTheDocument();
    fireEvent.click(loadButtonCheck);

    const addConnectorCardElement = screen.getByTestId(
      /add-connector-main-div/i
    );
    expect(addConnectorCardElement).toBeInTheDocument();
    fireEvent.click(addConnectorCardElement);
  });
  test("Check for the existance of labels and button and static cards costeward", async () => {
    //user is costeward
    setUserId("0f76cb90-2394-499b-9b60-bf4cad3751a4");
    setRoleLocal("datahub_co_steward");
    render(
      <Router>
        <Connectors />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const listOfConnectorLabel = screen.getByText(/list of connectors/i);
    expect(listOfConnectorLabel).toBeInTheDocument();

    const listViewDivElement = await screen.findByTestId(
      /list_view_option_div/i
    );
    expect(listViewDivElement).toBeInTheDocument();
    fireEvent.click(listViewDivElement);

    const gridViewDivElement = await screen.findByTestId(
      /grid_view_option_div/i
    );
    expect(gridViewDivElement).toBeInTheDocument();
    fireEvent.click(gridViewDivElement);

    const loadButtonCheck = await screen.findByRole("button", {
      name: /load more/i,
    });
    expect(loadButtonCheck).toBeInTheDocument();
    fireEvent.click(loadButtonCheck);

    const addConnectorCardElement = screen.getByTestId(
      /add-connector-main-div/i
    );
    expect(addConnectorCardElement).toBeInTheDocument();
    fireEvent.click(addConnectorCardElement);
  });
  test("Check for the existance of labels and button and static cards datahub_participant_root", async () => {
    //user is costeward
    setUserId("0f76cb90-2394-499b-9b60-bf4cad3751a4");
    setRoleLocal("datahub_participant_root");
    render(
      <Router>
        <Connectors />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const listOfConnectorLabel = screen.getByText(/list of connectors/i);
    expect(listOfConnectorLabel).toBeInTheDocument();

    const listViewDivElement = await screen.findByTestId(
      /list_view_option_div/i
    );
    expect(listViewDivElement).toBeInTheDocument();
    fireEvent.click(listViewDivElement);

    const gridViewDivElement = await screen.findByTestId(
      /grid_view_option_div/i
    );
    expect(gridViewDivElement).toBeInTheDocument();
    fireEvent.click(gridViewDivElement);

    const loadButtonCheck = await screen.findByRole("button", {
      name: /load more/i,
    });
    expect(loadButtonCheck).toBeInTheDocument();
    fireEvent.click(loadButtonCheck);

    const addConnectorCardElement = screen.getByTestId(
      /add-connector-main-div/i
    );
    expect(addConnectorCardElement).toBeInTheDocument();
    fireEvent.click(addConnectorCardElement);
  });
  test("Check for the existance of labels and button and static cards admin sending to edit mode", async () => {
    //user is datahub admin
    setUserId("0f76cb90-2394-499b-9b60-bf4cad3751a4");
    setRoleLocal("datahub_admin");
    render(
      <Router>
        <Connectors />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const listOfConnectorLabel = screen.getByText(/list of connectors/i);
    expect(listOfConnectorLabel).toBeInTheDocument();

    const listViewDivElement = await screen.findByTestId(
      /list_view_option_div/i
    );
    expect(listViewDivElement).toBeInTheDocument();
    fireEvent.click(listViewDivElement);

    const gridViewDivElement = await screen.findByTestId(
      /grid_view_option_div/i
    );
    expect(gridViewDivElement).toBeInTheDocument();
    fireEvent.click(gridViewDivElement);

    const editConnectorCardElementInitial = await screen.findAllByTestId(
      /connector-card/i
    );
    expect(editConnectorCardElementInitial).toHaveLength(5);
    const loadButtonCheck = await screen.findByRole("button", {
      name: /load more/i,
    });
    expect(loadButtonCheck).toBeInTheDocument();
    fireEvent.click(loadButtonCheck);

    // const editConnectorCardElementFinal = await screen.findAllByTestId(
    //   /connector-card/i
    // );
    // expect(editConnectorCardElementFinal).toHaveLength(10);

    fireEvent.click(editConnectorCardElementInitial[0]);
  });
  test("Check for the existance of labels and button and static cards datahub_participant_root sending to edit mode", async () => {
    //user is datahub_participant_root
    setUserId("0f76cb90-2394-499b-9b60-bf4cad3751a4");
    setRoleLocal("datahub_participant_root");
    render(
      <Router>
        <Connectors />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const listOfConnectorLabel = screen.getByText(/list of connectors/i);
    expect(listOfConnectorLabel).toBeInTheDocument();

    const listViewDivElement = await screen.findByTestId(
      /list_view_option_div/i
    );
    expect(listViewDivElement).toBeInTheDocument();
    fireEvent.click(listViewDivElement);

    const gridViewDivElement = await screen.findByTestId(
      /grid_view_option_div/i
    );
    expect(gridViewDivElement).toBeInTheDocument();
    fireEvent.click(gridViewDivElement);

    const editConnectorCardElementInitial = await screen.findAllByTestId(
      /connector-card/i
    );
    expect(editConnectorCardElementInitial).toHaveLength(5);
    const loadButtonCheck = await screen.findByRole("button", {
      name: /load more/i,
    });
    expect(loadButtonCheck).toBeInTheDocument();
    fireEvent.click(loadButtonCheck);

    // const editConnectorCardElementFinal = await screen.findAllByTestId(
    //   /connector-card/i
    // );
    // expect(editConnectorCardElementFinal).toHaveLength(10);

    fireEvent.click(editConnectorCardElementInitial[0]);
  });
  test("Check for the existance of labels and button and static cards datahub_co_steward sending to edit mode", async () => {
    //user is datahub_co_steward
    setUserId("0f76cb90-2394-499b-9b60-bf4cad3751a4");
    setRoleLocal("datahub_co_steward");
    render(
      <Router>
        <Connectors />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const listOfConnectorLabel = screen.getByText(/list of connectors/i);
    expect(listOfConnectorLabel).toBeInTheDocument();

    const listViewDivElement = await screen.findByTestId(
      /list_view_option_div/i
    );
    expect(listViewDivElement).toBeInTheDocument();
    fireEvent.click(listViewDivElement);

    const gridViewDivElement = await screen.findByTestId(
      /grid_view_option_div/i
    );
    expect(gridViewDivElement).toBeInTheDocument();
    fireEvent.click(gridViewDivElement);

    const editConnectorCardElementInitial = await screen.findAllByTestId(
      /connector-card/i
    );
    expect(editConnectorCardElementInitial).toHaveLength(5);
    const loadButtonCheck = await screen.findByRole("button", {
      name: /load more/i,
    });
    expect(loadButtonCheck).toBeInTheDocument();
    fireEvent.click(loadButtonCheck);

    // const editConnectorCardElementFinal = await screen.findAllByTestId(
    //   /connector-card/i
    // );
    // expect(editConnectorCardElementFinal).toHaveLength(10);

    fireEvent.click(editConnectorCardElementInitial[0]);
  });
  test("Component failed in get req", () => {
    server.use(
      rest.get(
        UrlConstant.base_url + UrlConstant.list_of_connectors,
        (req, res, ctx) => {
          console.log("inside fail");
          return res(
            ctx.status(401),
            ctx.json({
              error: "error",
            })
          );
        }
      )
    );
    setUserId("0f76cb90-2394-499b-9b60-bf4cad3751a4");
    render(
      <Router>
        <Connectors />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
  test("When no connectors are listed in the ui and clicking on the add new connector button", async () => {
    server.use(
      rest.get(
        UrlConstant.base_url + UrlConstant.list_of_connectors,
        (req, res, ctx) => {
          console.log("inside fail");
          return res(
            ctx.status(200),
            ctx.json({
              count: 0,
              next: null,
              previous: null,
              results: [],
            })
          );
        }
      )
    );
    setUserId("0f76cb90-2394-499b-9b60-bf4cad3751a4");
    render(
      <Router>
        <Connectors />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const add_new_connector = await screen.findByRole("button", {
      name: /Add New Connector/i,
    });
    expect(add_new_connector).toBeInTheDocument();
    fireEvent.click(add_new_connector);
  });
});
