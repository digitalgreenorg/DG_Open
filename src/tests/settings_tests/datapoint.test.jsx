import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import { setRoleLocal, setUserId } from "../../Utils/Common";
import StandardizationInOnbord from "../../Components/Standardization/StandardizationInOnbording";
import { server } from "../../mocks/server";
import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";

describe("Datapoint Setting", () => {
  beforeEach(() => {
    cleanup();
  });
  afterEach(() => {
    cleanup();
  });
  test("renders Datapoint without crashing", () => {
    setUserId("sometoken");
    render(<StandardizationInOnbord />, {
      wrapper: FarmStackProvider,
    });
  });
  test("input existenece", async () => {
    setUserId("sometoken");

    render(<StandardizationInOnbord inSettings={true} />, {
      wrapper: FarmStackProvider,
    });
    const text = screen.getByText(
      "Create and update datapoints to standardise datasets."
    );
    expect(text).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", {
        name: "Datapoint name",
      })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Datapoint description")).toBeInTheDocument();
    expect(screen.getByText(/Add/i)).toBeInTheDocument();
  });
  test("triggers onKeyDown event", () => {
    const handleKeyDown = jest.fn();
    setUserId("sometoken");
    render(<StandardizationInOnbord inSettings={true} />, {
      wrapper: FarmStackProvider,
    });
    fireEvent.keyDown(
      screen.getByRole("textbox", {
        name: "Datapoint name",
      }),
      { key: "Enter", keyCode: 13 }
    );
    fireEvent.keyDown(screen.getByLabelText("Datapoint description"), {
      key: "Enter",
      keyCode: 13,
    });
  });
  test("renders list of datapoints", async () => {
    setUserId("sometoken");
    render(<StandardizationInOnbord inSettings={true} />, {
      wrapper: FarmStackProvider,
    });
    const datapoints = await screen.findAllByTestId("accordion");
    expect(datapoints).toHaveLength(2);
  });
  test("Add datapoint", async () => {
    setUserId("sometoken");
    render(<StandardizationInOnbord inSettings={true} />, {
      wrapper: FarmStackProvider,
    });
    const dataPointName = screen.getByRole("textbox", {
      name: "Datapoint name",
    });
    const dataPointDescription = screen.getByLabelText("Datapoint description");

    const addButton = screen.getByText(/Add/i);

    fireEvent.change(dataPointName, {
      target: { value: "sample datapoint" },
    });
    fireEvent.change(dataPointDescription, {
      target: { value: "sample datapoint description" },
    });
    fireEvent.click(addButton);

    const submitButton = screen.getByRole("button", {
      name: /Submit/i,
    });
    fireEvent.click(submitButton);
  });
  test("Add datapoint failure if datapoint exists", async () => {
    server.use(
      rest.put(
        UrlConstant.base_url + UrlConstant.standardization_update_data,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({}));
        }
      )
    );
    setUserId("sometoken");
    render(
      <Router>
        <StandardizationInOnbord inSettings={true} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const dataPointName = screen.getByRole("textbox", {
      name: "Datapoint name",
    });
    const dataPointDescription = screen.getByLabelText("Datapoint description");

    const addButton = screen.getByText(/Add/i);

    const datapoints = await screen.findAllByTestId("accordion");
    expect(datapoints).toHaveLength(2);

    fireEvent.change(dataPointName, {
      target: { value: "sofshdj" },
    });
    fireEvent.change(dataPointDescription, {
      target: { value: "ddf" },
    });
    fireEvent.click(addButton);
    const submitButton = screen.getByRole("button", {
      name: /Submit/i,
    });
    fireEvent.click(submitButton);
  });
  test("Delete datapoint", async () => {
    setUserId("sometoken");
    render(<StandardizationInOnbord inSettings={true} />, {
      wrapper: FarmStackProvider,
    });
    const datapoints = await screen.findAllByTestId("accordion");
    expect(datapoints).toHaveLength(2);

    const deleteButtons = await screen.findAllByTestId("deletebutton");
    fireEvent.click(deleteButtons[0]);

    // fireEvent.click(deleteConfirmationButton);
  });
  test("Cancel datapoint addition", () => {
    setUserId("sometoken");
    render(
      <Router>
        <StandardizationInOnbord inSettings={true} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const dataPointName = screen.getByRole("textbox", {
      name: "Datapoint name",
    });
    const dataPointDescription = screen.getByLabelText("Datapoint description");

    const addButton = screen.getByText(/Add/i);

    fireEvent.change(dataPointName, {
      target: { value: "sample datapoint" },
    });
    fireEvent.change(dataPointDescription, {
      target: { value: "sample datapoint description" },
    });
    fireEvent.click(addButton);

    const submitButton = screen.getByText("Cancel");
    fireEvent.click(submitButton);
  });
  test("Delete datapoint attributes", async () => {
    setUserId("sometoken");
    render(<StandardizationInOnbord inSettings={true} />, {
      wrapper: FarmStackProvider,
    });
    const datapoints = await screen.findAllByTestId("accordion");
    expect(datapoints).toHaveLength(2);

    const button = await screen.findByText(/sdfhdshdshdsdfgdsg/i);
    fireEvent.click(button);

    const editButton = await screen.findAllByTestId("editinsideaccordion");
    fireEvent.click(editButton[0]);
    const deleteButtons = await screen.findAllByTestId(
      "delete_attribute_button"
    );
    fireEvent.click(deleteButtons[0]);
  });
  test("update datapoint and their attributes", async () => {
    setUserId("sometoken");
    render(<StandardizationInOnbord inSettings={true} />, {
      wrapper: FarmStackProvider,
    });
    const datapoints = await screen.findAllByTestId("accordion");
    expect(datapoints).toHaveLength(2);

    const editbuttons = await screen.findAllByTestId("editbutton");
    fireEvent.click(editbuttons[0]);

    const dataPointCategoryName = screen.getByRole("textbox", {
      name: /datapoint category name/i,
    });
    fireEvent.change(dataPointCategoryName, { target: { value: "georgo" } });
    fireEvent.click(dataPointCategoryName);

    const dataPointAttribute = screen.getAllByRole("textbox", {
      name: /Datapoint attributes/i,
    });
    fireEvent.change(dataPointAttribute[0], { target: { value: "chilli" } });
    const addAttributeImageButton = screen.getAllByRole("img", {
      name: "add_icon",
    });
    fireEvent.click(addAttributeImageButton[0]);
    const updateButton = screen.getByRole("button", {
      name: /update/i,
    });
    fireEvent.click(updateButton);
  });
  test("renders list of datapoints failure scenarios", async () => {
    server.use(
      rest.get(
        `${UrlConstant.base_url}${UrlConstant.standardization_get_data}`,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json());
        }
      )
    );
    render(<StandardizationInOnbord inSettings={true} />, {
      wrapper: FarmStackProvider,
    });
  });
  test("trying to generate new access token from refresh token", () => {
    localStorage.setItem("refresh", JSON.stringify("some refresh token"));
    server.use(
      rest.get(
        `${UrlConstant.base_url}${UrlConstant.standardization_get_data}`,
        (req, res, ctx) => {
          return res(ctx.status(401), ctx.json({ error: "unautorised" }));
        }
      )
    );
    render(
      <Router>
        <StandardizationInOnbord inSettings={true} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
});
describe("Onboarding module for datapoints", () => {
  afterEach(() => cleanup());
  beforeEach(() => cleanup());
  test("render onboardinbg", () => {
    setUserId("sometoken");
    render(<StandardizationInOnbord isOnborading={true} inSettings={false} />, {
      wrapper: FarmStackProvider,
    });
    const text = screen.getByText(
      "Enter the datapoints and datapoints attributes, we will show to others!"
    );
    expect(text).toBeInTheDocument();
  });
  test("add datapoint in onboarding module with finish", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <StandardizationInOnbord isOnborading={true} inSettings={false} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const dataPointName = screen.getByRole("textbox", {
      name: "Datapoint name",
    });
    const dataPointDescription = screen.getByLabelText("Datapoint description");

    const addButton = screen.getByText(/Add/i);

    fireEvent.change(dataPointName, {
      target: { value: "sample datapoint" },
    });
    fireEvent.change(dataPointDescription, {
      target: { value: "sample datapoint description" },
    });
    fireEvent.click(addButton);

    const submitButton = screen.getByText("Finish");
    fireEvent.click(submitButton);
  });
  test("add datapoint in onboarding module with finish later", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <StandardizationInOnbord isOnborading={true} inSettings={false} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const dataPointName = screen.getByRole("textbox", {
      name: "Datapoint name",
    });
    const dataPointDescription = screen.getByLabelText("Datapoint description");

    const addButton = screen.getByText(/Add/i);

    fireEvent.change(dataPointName, {
      target: { value: "sample datapoint" },
    });
    fireEvent.change(dataPointDescription, {
      target: { value: "sample datapoint description" },
    });
    fireEvent.click(addButton);

    const submitButton = screen.getByText("Finish later");
    fireEvent.click(submitButton);
  });

  test("add datapoint in onboarding module with finish later failure scenario", () => {
    server.use(
      rest.post(
        `${UrlConstant.base_url}${UrlConstant.onboarded}`,
        (req, res, ctx) => {
          return res(ctx.status(404), ctx.json());
        }
      )
    );
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <StandardizationInOnbord isOnborading={true} inSettings={false} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const dataPointName = screen.getByRole("textbox", {
      name: "Datapoint name",
    });
    const dataPointDescription = screen.getByLabelText("Datapoint description");

    const addButton = screen.getByText(/Add/i);

    fireEvent.change(dataPointName, {
      target: { value: "sample datapoint" },
    });
    fireEvent.change(dataPointDescription, {
      target: { value: "sample datapoint description" },
    });
    fireEvent.click(addButton);

    const submitButton = screen.getByText("Finish");
    fireEvent.click(submitButton);
  });
  test("add datapoint in onboarding module with finish later scenario for co-steward", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    render(
      <Router>
        <StandardizationInOnbord isOnborading={true} inSettings={false} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const dataPointName = screen.getByRole("textbox", {
      name: "Datapoint name",
    });
    const dataPointDescription = screen.getByLabelText("Datapoint description");

    const addButton = screen.getByText(/Add/i);

    fireEvent.change(dataPointName, {
      target: { value: "sample datapoint" },
    });
    fireEvent.change(dataPointDescription, {
      target: { value: "sample datapoint description" },
    });
    fireEvent.click(addButton);

    const submitButton = screen.getByText("Finish");
    fireEvent.click(submitButton);
  });
  test("add datapoint in onboarding module with finish later scenario for participant", () => {
    setUserId("sometoken");
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    render(
      <Router>
        <StandardizationInOnbord isOnborading={true} inSettings={false} />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const dataPointName = screen.getByRole("textbox", {
      name: "Datapoint name",
    });
    const dataPointDescription = screen.getByLabelText("Datapoint description");

    const addButton = screen.getByText(/Add/i);

    fireEvent.change(dataPointName, {
      target: { value: "sample datapoint" },
    });
    fireEvent.change(dataPointDescription, {
      target: { value: "sample datapoint description" },
    });
    fireEvent.click(addButton);

    const submitButton = screen.getByText("Finish");
    fireEvent.click(submitButton);
  });
});
