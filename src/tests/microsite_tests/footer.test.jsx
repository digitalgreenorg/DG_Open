import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import FooterNew from "../../Components/Footer/Footer_New";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import { BrowserRouter as Router } from "react-router-dom";
import UrlConstant from "../../Constants/UrlConstants";
import { server } from "../../mocks/server";
import { rest } from "msw";
import { setUserMapId } from "../../Utils/Common";

describe("render the footer without crashing", () => {
  beforeEach(() => cleanup());
  afterEach(() => cleanup());

  test("render the footer component", () => {
    render(
      <Router>
        <FooterNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
  test("render the part button", () => {
    render(
      <Router>
        <FooterNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const partButton = screen.getByTestId("footer-part-button");
    fireEvent.click(partButton);
  });
  test("render the get started button", () => {
    render(
      <Router>
        <FooterNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const getStarted = screen.getByTestId("get-started-button");
    fireEvent.click(getStarted);
  });
  test("render the datasets button", () => {
    render(
      <Router>
        <FooterNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const datasetsButton = screen.getByTestId("datasets-button");
    fireEvent.click(datasetsButton);
  });
  test("render the datasets for part button", () => {
    setUserMapId("somemapid");
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    render(
      <Router>
        <FooterNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const datasetsButton = screen.getByTestId("datasets-button");
    fireEvent.click(datasetsButton);
  });
  test("render the datasets for admin or costeward button", () => {
    setUserMapId("somemapid");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <FooterNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const datasetsButton = screen.getByTestId("datasets-button");
    fireEvent.click(datasetsButton);
  });
  test("render the part for admin or costeward button for part", () => {
    setUserMapId("somemapid");
    localStorage.setItem("role", JSON.stringify("datahub_participant_root"));
    render(
      <Router>
        <FooterNew name={"participants"} />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const datasetsButton = screen.getByTestId("footer-part-button");
    fireEvent.click(datasetsButton);
  });
  test("render the part for admin or costeward button for part", () => {
    setUserMapId("somemapid");
    localStorage.setItem("role", JSON.stringify("datahub_co_steward"));
    localStorage.setItem("role", JSON.stringify("datahub_admin"));
    render(
      <Router>
        <FooterNew name={"participants"} />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const datasetsButton = screen.getByTestId("footer-part-button");
    fireEvent.click(datasetsButton);
  });
  test("render the login button", () => {
    setUserMapId("");
    localStorage.setItem("role", JSON.stringify(""));
    render(
      <Router>
        <FooterNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const loginClick = screen.getByTestId("login-button");
    fireEvent.click(loginClick);
  });
  test("render the about farmstack", () => {
    render(
      <Router>
        <FooterNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const aboutFarmstackClick = screen.getByTestId("about-farmstack-button");
    fireEvent.click(aboutFarmstackClick);
  });
  test("render the legal click", () => {
    render(
      <Router>
        <FooterNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const legalClick = screen.getByTestId("legal-button");
    fireEvent.click(legalClick);
  });
  test("render the contact us click", () => {
    render(
      <Router>
        <FooterNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const contactUs = screen.getByTestId("contact-us-button");
    fireEvent.click(contactUs);
  });
  test("render the home click", () => {
    render(
      <Router>
        <FooterNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const homeClick = screen.getByTestId("home-button");
    fireEvent.click(homeClick);
  });
  test("render the home click", () => {
    render(
      <Router>
        <FooterNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const homeClick = screen.getByTestId("home-button");
    fireEvent.click(homeClick);
  });
  test("failure of get data", () => {
    server.use(
      rest.get(
        UrlConstant.base_url + "microsite/admin_organization/",
        (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({}));
        }
      )
    );
    render(
      <Router>
        <FooterNew />
      </Router>,
      { wrapper: FarmStackProvider }
    );
  });
});
