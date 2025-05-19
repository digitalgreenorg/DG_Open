import React from "react";
import {
  act,
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import CompanyPolicies from "../../Components/NewOnboarding/CompanyPolicies";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import { setUserId } from "../../Utils/Common";
import UrlConstant from "../../Constants/UrlConstants";
import { server } from "../../mocks/server";
import { rest } from "msw";
import "@testing-library/jest-dom/extend-expect";

const pdfContent = "This is the content of the PDF file.";
const pdfBlob = new Blob([pdfContent], { type: "application/pdf" });
const file = new File([pdfBlob], "example.pdf");
global.URL.createObjectURL = jest.fn(() => "mocked-object-url");
global.URL.revokeObjectURL = jest.fn();
describe("Settings module", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  test("renders without crashing", () => {
    render(<CompanyPolicies />, {
      wrapper: FarmStackProvider,
    });
  });

  test("input existenece", () => {
    render(<CompanyPolicies isPolicySettings={true} isVisible={true} />, {
      wrapper: FarmStackProvider,
    });

    expect(
      screen.getByRole("textbox", {
        name: "Policy name",
      })
    ).toBeInTheDocument();

    const policyDescriptionElement = screen.getByRole("combobox", {
      name: "Block type",
    });
    expect(policyDescriptionElement).toBeInTheDocument();
  });

  test("adds a new policy on button click", async () => {
    render(
      <CompanyPolicies
        isPolicySettings={true}
        isVisible={true}
        initialKey={0}
      />,
      {
        wrapper: FarmStackProvider,
      }
    );

    const addButton = screen.getByText(/Add New Policy/i);
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    const policyNameInput = screen.getByRole("textbox", {
      name: "Policy name",
    });
    expect(policyNameInput).toBeInTheDocument();
    fireEvent.change(policyNameInput, {
      target: { value: "Test Policy" },
    });
    const fileInput = screen.getByLabelText(/Drop files here or click /i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const addPolicy = screen.getByText("Add");
    fireEvent.click(addPolicy);
  });
  test("clear uploaded file after upload", () => {
    render(
      <CompanyPolicies
        isPolicySettings={true}
        isVisible={true}
        initialKey={0}
      />,
      {
        wrapper: FarmStackProvider,
      }
    );
    const addButton = screen.getByText(/Add New Policy/i);
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    const policyNameInput = screen.getByRole("textbox", {
      name: "Policy name",
    });
    expect(policyNameInput).toBeInTheDocument();
    fireEvent.change(policyNameInput, {
      target: { value: "Test Policy" },
    });
    const fileInput = screen.getByLabelText(/Drop files here or click /i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const previewFileBtn = screen.getByTestId("preview-file");
    fireEvent.click(previewFileBtn);
    const cancelUploadIcon = screen.getByTestId("cancel-policy-file");
    fireEvent.click(cancelUploadIcon);
  });
  test("adds a new policy on button click with failure description", async () => {
    server.use(
      rest.post(
        `${UrlConstant.base_url}${UrlConstant.datahub_policy}`,
        (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              description: ["Description is required"],
            })
          );
        }
      )
    );
    render(
      <CompanyPolicies
        isPolicySettings={true}
        isVisible={true}
        initialKey={0}
      />,
      {
        wrapper: FarmStackProvider,
      }
    );

    const addButton = screen.getByText(/Add New Policy/i);
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    const policyNameInput = screen.getByRole("textbox", {
      name: "Policy name",
    });
    expect(policyNameInput).toBeInTheDocument();
    fireEvent.change(policyNameInput, {
      target: { value: "Test Policy" },
    });
    const fileInput = screen.getByLabelText(/Drop files here or click /i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const addPolicy = screen.getByText("Add");
    fireEvent.click(addPolicy);
  });
  test("adds a new policy on button click failure without any error key", async () => {
    server.use(
      rest.post(
        `${UrlConstant.base_url}${UrlConstant.datahub_policy}`,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({}));
        }
      )
    );
    render(
      <Router>
        <CompanyPolicies
          isPolicySettings={true}
          isVisible={true}
          initialKey={0}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );

    const addButton = screen.getByText(/Add New Policy/i);
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    const policyNameInput = screen.getByRole("textbox", {
      name: "Policy name",
    });
    expect(policyNameInput).toBeInTheDocument();
    fireEvent.change(policyNameInput, {
      target: { value: "Test Policy" },
    });
    const fileInput = screen.getByLabelText(/Drop files here or click /i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const addPolicy = screen.getByText("Add");
    fireEvent.click(addPolicy);
  });
  test("renders list of policies", async () => {
    setUserId("sometoken");
    render(
      <CompanyPolicies
        isPolicySettings={true}
        isVisible={false}
        initialKey={0}
      />,
      {
        wrapper: FarmStackProvider,
      }
    );
    const policies = await screen.findAllByTestId("accordion");
    expect(policies).toHaveLength(2);
    expect(policies[0]).toHaveTextContent("jiohujgvbv");
  });
  test("renders list of policies failure", async () => {
    server.use(
      rest.get(
        `${UrlConstant.base_url}${UrlConstant.datahub_policy}`,
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({}));
        }
      )
    );
    setUserId("sometoken");
    render(
      <Router>
        <CompanyPolicies
          isPolicySettings={true}
          isVisible={true}
          initialKey={0}
        />
      </Router>,
      {
        wrapper: FarmStackProvider,
      }
    );
  });
});

describe("Onboarding module", () => {
  beforeEach(() => cleanup());
  afterEach(() => cleanup());

  test("render and check the component flow for while onboarding", () => {
    render(
      <Router>
        <CompanyPolicies
          isPolicySettings={false}
          isVisible={false}
          initialKey={0}
        />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const titleText = screen.getByText("Company Policies");
    expect(titleText).toBeInTheDocument();
    const policyNameInput = screen.getByRole("textbox", {
      name: "Policy name",
    });
    expect(policyNameInput).toBeInTheDocument();
    fireEvent.change(policyNameInput, {
      target: { value: "Test Policy" },
    });
    const fileInput = screen.getByLabelText(/Drop files here or click /i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const previewFileBtn = screen.getByTestId("file-preview");
    fireEvent.click(previewFileBtn);
    const cancelUploadIcon = screen.getByTestId("cancel-policy-file");
    fireEvent.click(cancelUploadIcon);
  });

  test("Add Policy while onboarding", async () => {
    // userEvent.setup();
    const handlegovLawChange = jest.fn();
    render(
      <Router>
        <CompanyPolicies
          isPolicySettings={false}
          isVisible={false}
          initialKey={0}
          handlegovLawChange={handlegovLawChange}
        />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const titleText = screen.getByText("Company Policies");
    expect(titleText).toBeInTheDocument();
    const policyNameInput = screen.getByRole("textbox", {
      name: "Policy name",
    });
    expect(policyNameInput).toBeInTheDocument();
    fireEvent.change(policyNameInput, {
      target: { value: "Test Policy" },
    });

    const fileInput = screen.getByLabelText(/Drop files here or click /i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    const previewFileBtn = screen.getByTestId("file-preview");
    fireEvent.click(previewFileBtn);
    const addPolicy = screen.getByText("Add");
    fireEvent.click(addPolicy);
  });
});
