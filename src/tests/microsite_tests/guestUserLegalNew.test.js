import "./matchMedia.mock";
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Await, BrowserRouter as Router } from "react-router-dom";
import GuestUserLegalNew from "../../Views/GuestUser/GuestUserLegalNew";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import { server } from "../../mocks/server";
import { rest } from "msw";
import UrlConstant from "../../Constants/UrlConstants";
import FileSaver from "file-saver";

const getBaseUrl = () => {
  return process.env.REACT_APP_BASEURL;
};

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn(),
}));

describe("legal policy component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("policy tab title check", () => {
    render(
      <Router>
        <GuestUserLegalNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    let policyTitle = screen.getByText("Legal Policies");
    expect(policyTitle).toBeInTheDocument;
  });

  test("Click to download policy file", async () => {
    render(
      <Router>
        <GuestUserLegalNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    let downlaodPolicyButton = await screen.findAllByTestId(
      "legal-policy-download-document-test"
    );
    // it will download a file
    const mockSaveAs = jest.fn();
    FileSaver.saveAs = mockSaveAs;
    fireEvent.click(downlaodPolicyButton[0]);
    expect(mockSaveAs).toHaveBeenCalledTimes(1);
  });

  test("legal policy api failer", async () => {
    server.use(
      rest.get(
        `${UrlConstant.base_url}${UrlConstant.microsite_get_policy}`,
        (req, res, ctx) => {
          console.log("failer api call");
          return res(ctx.status(400), ctx.json({ message: "Failed" }));
        }
      )
    );
    render(
      <Router>
        <GuestUserLegalNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });

  test("Click to view policy file", async () => {
    render(
      <Router>
        <GuestUserLegalNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    let viewPolicyButton = await screen.findAllByTestId(
      "legal-policy-view-document-test"
    );
    // It should open a new tab on click of viewPolicyButton
    const mockWindowOpen = jest.fn();
    window.open = mockWindowOpen;

    fireEvent.click(viewPolicyButton[0]);
    expect(mockWindowOpen).toHaveBeenCalledTimes(1);
  });
});
