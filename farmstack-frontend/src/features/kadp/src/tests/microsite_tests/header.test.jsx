import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar_New from "../../Components/Navbar/Navbar_New";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import { BrowserRouter as Router } from "react-router-dom";
import UrlConstant from "../../Constants/UrlConstants";
import { server } from "../../mocks/server";
import { rest } from "msw";

describe("render the header without crashing", () => {
  beforeEach(() => cleanup());
  afterEach(() => cleanup());

  test("render the register button", () => {
    render(
      <Router>
        <Navbar_New />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const registerButton = screen.getByTestId("navbar-register-button");
    fireEvent.click(registerButton);
  });
//   test("render the  signout button", () => {
//     render(
//       <Router>
//         <Navbar_New 
//         />
//       </Router>,
//       { wrapper: FarmStackProvider }
//     );
//     const signoutButton = screen.getByTestId("navbar-signout-button");
//     fireEvent.click(signoutButton);
//   });
  test("render the  login button", () => {
    render(
      <Router>
        <Navbar_New />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const loginButton = screen.getByTestId("navbar-login-button");
    fireEvent.click(loginButton);
  });
  test("render the settings button", () => {
    render(
      <Router>
        <Navbar_New loginType="admin" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const settingsButton = screen.getByTestId("navbar-settings-button");
    fireEvent.click(settingsButton);
  });
  test("render the settings button of part", () => {
    render(
      <Router>
        <Navbar_New loginType="participant" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const settingsButton = screen.getByTestId("navbar-settings-button");
    fireEvent.click(settingsButton);
  });
  test("render the connectors button", () => {
    render(
      <Router>
        <Navbar_New loginType="admin" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const connectorsButton = screen.getByTestId("navbar-connectors-button");
    fireEvent.click(connectorsButton);
  });
  test("render the connectors button of part", () => {
    render(
      <Router>
        <Navbar_New loginType="participant" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const connectorsButton = screen.getByTestId("navbar-connectors-button");
    fireEvent.click(connectorsButton);
  });
  test("render the datasets button", () => {
    render(
      <Router>
        <Navbar_New loginType="admin" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const datasetsButton = screen.getByTestId("navbar-datasets-button");
    fireEvent.click(datasetsButton);
  });
  test("render the datasets button of part", () => {
    render(
      <Router>
        <Navbar_New loginType="participant" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const datasetsButton = screen.getByTestId("navbar-datasets-button");
    fireEvent.click(datasetsButton);
  });
  test("render the datasets button of guest", () => {
    render(
      <Router>
        <Navbar_New loginType="guest" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const datasetsButton = screen.getByTestId("navbar-datasets-button");
    fireEvent.click(datasetsButton);
  });
  test("render the participants button ", () => {
    render(
      <Router>
        <Navbar_New loginType="guest" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const participantsButton = screen.getByTestId("navbar-participants-button");
    fireEvent.click(participantsButton);
  });
  test("render the participants button ", () => {
    render(
      <Router>
        <Navbar_New loginType="admin" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const participantsButton = screen.getByTestId("navbar-participants-button");
    fireEvent.click(participantsButton);
  });
  test("render the home button", () => {
    render(
      <Router>
        <Navbar_New />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const homesButton = screen.getByTestId("navbar-home-button");
    fireEvent.click(homesButton);
  });
  test("render the dashboard of part button", () => {
    render(
      <Router>
        <Navbar_New loginType="participant" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const partDashboard = screen.getByTestId("navbar-dashboard-part-button");
    fireEvent.click(partDashboard);
  });
  test("render the dashboard button", () => {
    render(
      <Router>
        <Navbar_New loginType="admin" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const partDashboard = screen.getByTestId("navbar-dashboard-button");
    fireEvent.click(partDashboard);
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
        <Navbar_New loginType="admin" />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const partDashboard = screen.getByTestId("navbar-dashboard-button");
    fireEvent.click(partDashboard);
  });
});
