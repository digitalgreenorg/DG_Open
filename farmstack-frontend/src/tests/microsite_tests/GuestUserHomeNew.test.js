import "./matchMedia.mock";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GuestUserHome from "../../Views/GuestUser/GuestUserHomeNew";
import FarmStackProvider from "../../Components/Contexts/FarmStackContext";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn(),
}));

describe("GuestUserHome Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("clicking on the 'Get Started' button should navigate to the correct path", () => {
    render(
      <Router>
        <GuestUserHome />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const buttonElement = screen.getByTestId("home-get-started-btn-test");
    fireEvent.click(buttonElement);
    expect(window.location.pathname).toBe("/home/get-started");
  });

  test("click on view all co-steward button click", () => {
    render(
      <Router>
        <GuestUserHome />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const viewAllCoStewardsBtn = screen.getByText(/View all co-steward/i);
    fireEvent.click(viewAllCoStewardsBtn);
  });

  test("click on view all participants button click", () => {
    render(
      <Router>
        <GuestUserHome />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const viewAllParticipantsBtn = screen.getByText(/View all participants/i);
    fireEvent.click(viewAllParticipantsBtn);
  });

  test("clicking on the 'Get Started' button (at the bottom) should navigate to the correct path", () => {
    render(
      <Router>
        <GuestUserHome />
      </Router>,
      { wrapper: FarmStackProvider }
    );
    const buttonElement = screen.getByTestId("home-get-started-btn-test2");
    fireEvent.click(buttonElement);
    expect(window.location.pathname).toBe("/home/get-started");
  });
});
