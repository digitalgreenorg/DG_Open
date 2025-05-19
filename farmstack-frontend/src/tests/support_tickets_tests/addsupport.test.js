import React from "react";
import {
  act,
  cleanup,
  render,
  screen,
  fireEvent,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import { BrowserRouter as Router } from "react-router-dom";
import { setUserMapId } from "../../Utils/Common";
import { server } from "../../mocks/server";
import { rest } from "msw";
import AskSupport from "../../Components/Support_New/SupportForm";
import UrlConstant from "../../Constants/UrlConstants";

global.URL.createObjectURL = jest.fn(() => "mocked-object-url");
global.URL.revokeObjectURL = jest.fn();
describe("Add Support module", () => {
  beforeEach(() => {
    cleanup();
  });
  afterEach(() => {
    cleanup();
  });
  test("renders Add Support component without crashing", () => {
    render(
      <Router>
        <AskSupport />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });

  test("renders all the fields and trigger events", async () => {
    render(
      <Router>
        <AskSupport />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const title = screen.getByRole("textbox", {
      name: /title/i,
    });
    fireEvent.change(title, { target: { value: "sample query" } });

    const descriptionInput =
      screen.getByPlaceholderText(/category description/i);
    fireEvent.change(descriptionInput, {
      target: { value: "sample description" },
    });

    const selectCompoEl = screen.getByTestId("component-under-test");

    const button = within(selectCompoEl).getByRole("button");
    fireEvent.mouseDown(button);

    const listbox = within(screen.getByRole("presentation")).getByRole(
      "listbox"
    );
    const options = within(listbox).getAllByRole("option");
    const optionValues = options.map((li) => li.getAttribute("data-value"));

    expect(optionValues).toEqual([
      "certificate",
      "connectors",
      "datasets",
      "user_accounts",
      "usage_policy",
      "others",
    ]);

    fireEvent.click(options[1]);
  });

  test("add support ticket", async () => {
    setUserMapId("somemapid");
    render(
      <Router>
        <AskSupport />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const title = screen.getByRole("textbox", {
      name: /title/i,
    });
    fireEvent.change(title, { target: { value: "sample query" } });

    const descriptionInput =
      screen.getByPlaceholderText(/category description/i);
    fireEvent.change(descriptionInput, {
      target: { value: "sample description" },
    });

    const selectCompoEl = screen.getByTestId("component-under-test");

    const button = within(selectCompoEl).getByRole("button");
    fireEvent.mouseDown(button);

    const listbox = within(screen.getByRole("presentation")).getByRole(
      "listbox"
    );
    const options = within(listbox).getAllByRole("option");
    const optionValues = options.map((li) => li.getAttribute("data-value"));

    expect(optionValues).toEqual([
      "certificate",
      "connectors",
      "datasets",
      "user_accounts",
      "usage_policy",
      "others",
    ]);

    fireEvent.click(options[1]);
    // const file = new File(["dummy content"], "example.png", {
    //   type: "image/png",
    // });
    // const fileInput = screen.getByLabelText(
    //   /Drop files here or click browse thorough your machine/i
    // );
    // fireEvent.change(fileInput, { target: { files: [file] } });
    const submitBtn = screen.getByText("Submit");
    fireEvent.click(submitBtn);
  });
  test("add support ticket failure", async () => {
    server.use(
      rest.post(
        `${UrlConstant.base_url}${UrlConstant.support_ticket}`,
        (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              ticket_title: ["Invalid title"],
              ticket_attachment: ["Invalid attachment"],
              description: ["Invalid description"],
              some: ["Invalid description"],
            })
          );
        }
      )
    );
    render(
      <Router>
        <AskSupport />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const title = screen.getByRole("textbox", {
      name: /title/i,
    });
    fireEvent.change(title, { target: { value: "sample query" } });

    const descriptionInput =
      screen.getByPlaceholderText(/category description/i);
    fireEvent.change(descriptionInput, {
      target: { value: "sample description" },
    });

    const selectCompoEl = screen.getByTestId("component-under-test");

    const button = within(selectCompoEl).getByRole("button");
    fireEvent.mouseDown(button);

    const listbox = within(screen.getByRole("presentation")).getByRole(
      "listbox"
    );
    const options = within(listbox).getAllByRole("option");
    const optionValues = options.map((li) => li.getAttribute("data-value"));

    expect(optionValues).toEqual([
      "certificate",
      "connectors",
      "datasets",
      "user_accounts",
      "usage_policy",
      "others",
    ]);

    fireEvent.click(options[1]);

    const submitBtn = screen.getByText("Submit");
    fireEvent.click(submitBtn);
  });
  test("add support ticket failure with attachment", async () => {
    server.use(
      rest.post(
        `${UrlConstant.base_url}${UrlConstant.support_ticket}`,
        (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              ticket_attachment: ["Invalid attachment"],
            })
          );
        }
      )
    );
    render(
      <Router>
        <AskSupport />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const title = screen.getByRole("textbox", {
      name: /title/i,
    });
    fireEvent.change(title, { target: { value: "sample query" } });

    const descriptionInput =
      screen.getByPlaceholderText(/category description/i);
    fireEvent.change(descriptionInput, {
      target: { value: "sample description" },
    });

    const selectCompoEl = screen.getByTestId("component-under-test");

    const button = within(selectCompoEl).getByRole("button");
    fireEvent.mouseDown(button);

    const listbox = within(screen.getByRole("presentation")).getByRole(
      "listbox"
    );
    const options = within(listbox).getAllByRole("option");
    const optionValues = options.map((li) => li.getAttribute("data-value"));

    expect(optionValues).toEqual([
      "certificate",
      "connectors",
      "datasets",
      "user_accounts",
      "usage_policy",
      "others",
    ]);

    fireEvent.click(options[1]);
    // const file = new File(["dummy content"], "example.png", {
    //   type: "image/png",
    // });
    // const fileInput = screen.getByLabelText(
    //   /Drop files here or click browse thorough your machine/i
    // );
    // fireEvent.change(fileInput, { target: { files: [file] } });
    const submitBtn = screen.getByText("Submit");
    fireEvent.click(submitBtn);
  });
  test("goback_to_support_page co-steward", () => {
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    render(
      <Router>
        <AskSupport />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const goback_to_support_page = screen.getByTestId("goback_to_support_page");
    fireEvent.click(goback_to_support_page);
  });
  test("goback_to_support_page participant", () => {
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    render(
      <Router>
        <AskSupport />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const goback_to_support_page = screen.getByTestId("goback_to_support_page");
    fireEvent.click(goback_to_support_page);
  });
  test("upload file", async () => {
    render(
      <Router>
        <AskSupport />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    const fileInput = screen.getByLabelText(
      /Drop files here or click browse thorough your machine/i
    );
    fireEvent.change(fileInput, { target: { files: [file] } });
    const cancel = screen.getByTestId("CancelIcon");
    fireEvent.click(cancel);
  });
  test("trigger handle clear form for co-steward", () => {
    setUserMapId("somemapid");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    render(
      <Router>
        <AskSupport />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const title = screen.getByRole("textbox", {
      name: /title/i,
    });
    fireEvent.change(title, { target: { value: "sample query" } });

    const descriptionInput =
      screen.getByPlaceholderText(/category description/i);
    fireEvent.change(descriptionInput, {
      target: { value: "sample description" },
    });

    const selectCompoEl = screen.getByTestId("component-under-test");

    const button = within(selectCompoEl).getByRole("button");
    fireEvent.mouseDown(button);

    const listbox = within(screen.getByRole("presentation")).getByRole(
      "listbox"
    );
    const options = within(listbox).getAllByRole("option");
    const optionValues = options.map((li) => li.getAttribute("data-value"));

    expect(optionValues).toEqual([
      "certificate",
      "connectors",
      "datasets",
      "user_accounts",
      "usage_policy",
      "others",
    ]);
    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    const fileInput = screen.getByLabelText(
      /Drop files here or click browse thorough your machine/i
    );
    fireEvent.change(fileInput, { target: { files: [file] } });
    const submitBtn = screen.getByText("Submit");
    fireEvent.click(submitBtn);
  });
  test("trigger handle clear form for participant", () => {
    setUserMapId("somemapid");
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    render(
      <Router>
        <AskSupport />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
    const title = screen.getByRole("textbox", {
      name: /title/i,
    });
    fireEvent.change(title, { target: { value: "sample query" } });

    const descriptionInput =
      screen.getByPlaceholderText(/category description/i);
    fireEvent.change(descriptionInput, {
      target: { value: "sample description" },
    });

    const selectCompoEl = screen.getByTestId("component-under-test");

    const button = within(selectCompoEl).getByRole("button");
    fireEvent.mouseDown(button);

    const listbox = within(screen.getByRole("presentation")).getByRole(
      "listbox"
    );
    const options = within(listbox).getAllByRole("option");
    const optionValues = options.map((li) => li.getAttribute("data-value"));

    expect(optionValues).toEqual([
      "certificate",
      "connectors",
      "datasets",
      "user_accounts",
      "usage_policy",
      "others",
    ]);
    const submitBtn = screen.getByText("Submit");
    fireEvent.click(submitBtn);
  });

  test("trigger cancel button for co-steward", () => {
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    render(
      <Router>
        <AskSupport />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const cancel = screen.getByText("Cancel");
    fireEvent.click(cancel);
  });
  test("trigger cancel button for participant", () => {
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    render(
      <Router>
        <AskSupport />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const cancel = screen.getByText("Cancel");
    fireEvent.click(cancel);
  });
});
